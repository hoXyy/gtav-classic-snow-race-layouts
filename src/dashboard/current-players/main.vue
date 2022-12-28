<template>
  <v-app>
    <v-container fluid>
      <v-btn
        @click="enableSelectionPanel(0)"
        :disabled="selectPlayerPanelEnabled"
        >Top Feed</v-btn
      >
      <v-btn
        @click="enableSelectionPanel(1)"
        :disabled="selectPlayerPanelEnabled"
        >Bottom Feed 1</v-btn
      >
      <v-btn
        @click="enableSelectionPanel(2)"
        :disabled="selectPlayerPanelEnabled"
        >Bottom Feed 2</v-btn
      >
      <v-btn
        @click="enableSelectionPanel(3)"
        :disabled="selectPlayerPanelEnabled"
        >Bottom Feed 3</v-btn
      >
    </v-container>
    <v-container v-if="selectPlayerPanelEnabled" fluid>
      <v-btn
        v-for="player in allPlayers"
        :disabled="!isPlayerAlreadySelected(player)"
        @click="changeSelectedPlayer(player)"
        >{{ player.name }}</v-btn
      >
      <v-btn @click="selectPlayerPanelEnabled = false">Cancel</v-btn>
    </v-container>
    <v-btn @click="writeChangesToReplicant" :disabled="!changesPending"
      >Save Changes</v-btn
    >
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import type { AllPlayers, CurrentPlayers } from "@snow-mod-race/types/schemas";
import { Getter } from "vuex-class";
import clone from "clone";
import { storeModule } from "./store";

@Component
export default class extends Vue {
  @Getter readonly allPlayers!: AllPlayers; // from store.ts
  @Getter readonly currentPlayers!: CurrentPlayers; // from store.ts

  currentSlotSelected = 0;
  selectPlayerPanelEnabled = false;
  temporarySelectedPlayersStore = clone(this.currentPlayers);
  changesPending = false;
  pendingFeedChanges: { slot: number; twitch: string }[] = [];

  mounted() {
    this.temporarySelectedPlayersStore = clone(this.currentPlayers);
  }

  enableSelectionPanel(slot: number) {
    this.selectPlayerPanelEnabled = true;
    this.currentSlotSelected = slot;
  }

  isPlayerAlreadySelected(player: { name: string; twitch: string }): boolean {
    if (
      this.temporarySelectedPlayersStore.player1 != player &&
      this.temporarySelectedPlayersStore.player2 != player &&
      this.temporarySelectedPlayersStore.player3 != player &&
      this.temporarySelectedPlayersStore.player4 != player
    ) {
      return true;
    } else {
      return false;
    }
  }

  changeSelectedPlayer(player: { name: string; twitch: string }) {
    let slot = this.currentSlotSelected;
    if (!this.temporarySelectedPlayersStore) {
      this.temporarySelectedPlayersStore = {};
    }
    switch (this.currentSlotSelected) {
      case 0:
        this.temporarySelectedPlayersStore.player1 = player;
        break;
      case 1:
        this.temporarySelectedPlayersStore.player2 = player;
        break;
      case 2:
        this.temporarySelectedPlayersStore.player3 = player;
        break;
      case 3:
        this.temporarySelectedPlayersStore.player4 = player;
        break;
      default:
        break;
    }
    this.pendingFeedChanges.push({ slot, twitch: player.twitch });
    this.changesPending = true;
    this.selectPlayerPanelEnabled = false;
  }

  writeChangesToReplicant(): void {
    storeModule.updateCurrentPlayers(this.temporarySelectedPlayersStore);
    this.changesPending = false;
    this.temporarySelectedPlayersStore = clone(this.currentPlayers);
    nodecg.sendMessage("updateFeeds", this.pendingFeedChanges);
    this.pendingFeedChanges.length = 0;
  }
}
</script>
