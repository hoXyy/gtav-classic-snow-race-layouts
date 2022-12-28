import { Configschema } from "@snow-mod-race/types/schemas";
import OBSWebSocket from "obs-websocket-js";
import { get as nodecg } from "./util/nodecg";
import {
  connectedToOBSRep,
  currentPlayersRep,
  currentOBSSceneRep,
} from "./util/replicants";

let reconnectTimeout: NodeJS.Timeout;
const obs = new OBSWebSocket();
const config = (nodecg().bundleConfig as Configschema).obs;
connectedToOBSRep.value = false;

if (config.enabled) {
  nodecg().log.info("Connecting to OBS...");
  obs.connect(`${config.address}:${config.port}`).catch((err) => {
    nodecg().log.error(`Failed to connect to OBS! Reason: ${err}`);
    reconnectTimeout = setTimeout(reconnectToOBS, 5000);
  });

  function reconnectToOBS() {
    clearTimeout(reconnectTimeout);
    if (!connectedToOBSRep.value) {
      nodecg().log.info("Connecting to OBS...");
      obs.connect(config.address).catch((err) => {
        nodecg().log.error(`Failed to connect to OBS! Reason: ${err}`);
        reconnectTimeout = setTimeout(reconnectToOBS, 5000);
      });
    }
  }

  obs.on("ConnectionOpened", () => {
    nodecg().log.info("Connected to OBS!");
    connectedToOBSRep.value = true;
    // timeout needed or it just crashes
    setTimeout(() => {
      obs.call("GetCurrentProgramScene").then((data) => {
        currentOBSSceneRep.value = data.currentProgramSceneName;
      });
    }, 500);
  });

  obs.on("ConnectionClosed", () => {
    nodecg().log.info("Disconnected from OBS! Reconnecting in 5 seconds...");
    setTimeout(reconnectToOBS, 5000);
    connectedToOBSRep.value = false;
  });

  obs.on("CurrentProgramSceneChanged", (data) => {
    currentOBSSceneRep.value = data.sceneName;
  });

  function updateBrowserSources(sources: { slot: number; twitch: string }[]) {
    const twitchUrl =
      "https://player.twitch.tv/?channel={{channel}}&enableExtensions=false&muted=false&player=popout&volume=1&parent=twitch.tv";
    const sourcesNames = [
      config.sources?.feed1!,
      config.sources?.feed2!,
      config.sources?.feed3!,
      config.sources?.feed4!,
    ];
    if (connectedToOBSRep) {
      sources.forEach((source) => {
        obs
          .call("SetInputSettings", {
            inputName: sourcesNames[source.slot],
            inputSettings: {
              url: twitchUrl.replace(
                new RegExp("{{channel}}", "g"),
                source.twitch
              ),
            },
          })
          .then(() => {
            nodecg().log.debug(`Successfully set feed ${source.slot} URL`);
          })
          .catch((err) => {
            nodecg().log.error(
              `Error setting stream feed ${source.slot}: ${err}`
            );
          });
      });
    }
  }

  nodecg().listenFor("updateFeeds", (feeds) => {
    updateBrowserSources(feeds);
  });
}
