<template>
  <div :style="{ color: 'black', fontWeight: 'bold', textAlign: 'center', margin: '0px', display: 'flex' }">
    <p class="player" :style="{margin: 'auto'}">{{ player }}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from "vue-property-decorator";
import fitty, { FittyInstance } from "fitty";

@Component
export default class extends Vue {
  playerFit: FittyInstance[] | undefined;

  @Prop(String) player!: string;

  mounted() {
    setTimeout(() => {
      this.fit();
    }, 300);
  }

  fit() {
    this.playerFit = fitty(".player", {
      minSize: 10,
      maxSize: 48,
    });
  }

  @Watch("player")
  onPlayersChange() {
    setTimeout(() => {
      this.fit();
    }, 300);
  }
}
</script>
