import {
  replicantModule,
  ReplicantModule,
  ReplicantTypes,
} from "@snow-mod-race/browser_shared/replicant_store";
import clone from "clone";
import Vue from "vue";
import Vuex, { Store } from "vuex";
import { Action, getModule, Module, VuexModule } from "vuex-module-decorators";
import type { AllPlayers } from "@snow-mod-race/types/schemas";

Vue.use(Vuex);

@Module({ name: "OurModule" })
class OurModule extends VuexModule {
  // Helper getter to return all replicants.
  get reps(): ReplicantTypes {
    return this.context.rootState.ReplicantModule.reps;
  }

  // Helper getter to return a specific replicant.
  get allPlayers(): AllPlayers {
    return this.reps.allPlayers;
  }

  @Action({ rawError: true })
  updateAllPlayers(players: AllPlayers): void {
    replicantModule.setReplicant<AllPlayers>({
      name: "allPlayers",
      val: players,
    });
  }
}

const store = new Store({
  strict: process.env.NODE_ENV !== "production",
  state: {},
  modules: { ReplicantModule, OurModule },
});
export default store;
export const storeModule = getModule(OurModule, store);
