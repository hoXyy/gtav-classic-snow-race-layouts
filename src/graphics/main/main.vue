<template>
  <div>
    <div id="backgrounds">
      <img class="bg" src="./snowrace.png" />
    </div>

    <p
      id="game"
      :style="{
        position: 'absolute',
        left: '280px',
        top: '948px',
        width: '338px',
        height: '50px',
        fontWeight: 'bold',
        fontSize: '52px',
        textAlign: 'center',
      }"
    >
      GTA V
    </p>
    <p
      id="category"
      :style="{
        position: 'absolute',
        left: '790px',
        top: '995px',
        width: '338px',
        height: '50px',
        fontWeight: 'bold',
        fontSize: '24px',
        textAlign: 'center',
      }"
    >
      Any% Classic Snow Mod
    </p>
    <p
      id="time"
      :style="{
        position: 'absolute',
        left: '1275px',
        top: '948px',
        width: '338px',
        height: '50px',
        fontWeight: 'bold',
        fontSize: '52px',
        textAlign: 'center',
      }"
    >
      {{ timer.time }}
    </p>
    <player
      id="player1"
      :style="{
        position: 'absolute',
        left: '1445px',
        top: '225px',
        width: '260px',
        height: '50px',
      }"
      :player="currentPlayers.player1.name"
    />
    <player
      id="player2"
      :style="{
        position: 'absolute',
        left: '185px',
        top: '892px',
        width: '260px',
        height: '50px',
      }"
      :player="currentPlayers.player2.name"
    />
    <player
      id="player3"
      :style="{
        position: 'absolute',
        left: '825px',
        top: '890px',
        width: '260px',
        height: '50px',
      }"
      :player="currentPlayers.player3.name"
    />
    <player
      id="player4"
      :style="{
        position: 'absolute',
        left: '1470px',
        top: '888px',
        width: '260px',
        height: '50px',
      }"
      :player="currentPlayers.player4.name"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import type { Timer, CurrentPlayers } from "@snow-mod-race/types/schemas";
import { Getter } from "vuex-class";
import fitty, { FittyInstance } from "fitty";
import Player from "./components/Player.vue";

@Component({
  components: {
    Player,
  },
})
export default class extends Vue {
  @Getter readonly timer!: Timer;
  @Getter readonly currentPlayers!: CurrentPlayers;
}
</script>

<style>
@import url("../css/common.css");
</style>
