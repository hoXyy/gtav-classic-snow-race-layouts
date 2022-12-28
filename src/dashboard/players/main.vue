<template>
  <v-app>
    <v-container fluid>
      <div v-for="player in allPlayers" class="d-flex flex-row justify-space-between">
        <p>{{ player.name }}</p>
        <v-btn @click="removePlayer(player)">Remove</v-btn>
      </div>
    </v-container>
    <v-container fluid v-if="addPlayerPanelEnabled">
      <v-text-field dense v-model="newPlayerName" filled label="Name" />
      <v-text-field dense v-model="newPlayerTwitch" filled label="Twitch" />
      <v-btn @click="addPlayer(newPlayerName, newPlayerTwitch)"
        >Add Player</v-btn
      >
      <v-btn @click="addPlayerPanelEnabled = false">Cancel</v-btn>
    </v-container>
    <v-btn v-if="!addPlayerPanelEnabled" @click="addPlayerPanelEnabled = true"
      >Add Player</v-btn
    >
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import type { AllPlayers } from "@snow-mod-race/types/schemas";
import { Getter } from "vuex-class";
import clone from "clone";
import { storeModule } from "./store";

@Component
export default class extends Vue {
  @Getter readonly allPlayers!: AllPlayers; // from store.ts

  newPlayerName = "";
  newPlayerTwitch = "";
  addPlayerPanelEnabled = false;

  addPlayer(name: string, twitch: string) {
    const player = { name, twitch };
    let curVal = clone(this.allPlayers);
    curVal.push(player);
    storeModule.updateAllPlayers(curVal);
    this.addPlayerPanelEnabled = false;
    this.newPlayerName = "";
    this.newPlayerTwitch = "";
  }

  removePlayer(player: any) {
    let curVal = clone(this.allPlayers);
    curVal.splice(curVal.indexOf(player), 1);
    storeModule.updateAllPlayers(curVal);
  }
}
</script>
