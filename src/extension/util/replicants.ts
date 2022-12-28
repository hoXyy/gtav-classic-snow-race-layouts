/* eslint-disable max-len */

import {
  Timer,
  CurrentPlayers,
  AllPlayers,
} from "@snow-mod-race/types/schemas";
import { get as nodecg } from "./nodecg";

/**
 * This is where you can declare all your replicant to import easily into other files,
 * and to make sure they have any correct settings on startup.
 */

// YOU CAN REMOVE THIS RULE WHEN YOU GET MULTIPLE REPLICANTS!
// eslint-disable-next-line import/prefer-default-export
export const timerRep = nodecg().Replicant<Timer>("timer");
export const connectedToOBSRep = nodecg().Replicant<boolean>("connectedToOBS");
export const currentPlayersRep =
  nodecg().Replicant<CurrentPlayers>("currentPlayers");
export const allPlayersRep = nodecg().Replicant<AllPlayers>("allPlayers");
export const currentOBSSceneRep = nodecg().Replicant<string>("currentOBSScene");
