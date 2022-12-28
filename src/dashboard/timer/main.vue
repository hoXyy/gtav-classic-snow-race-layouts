<template>
    <v-app>
        <v-container fluid class="text-center">
            <h1 style="font-size: 48px">{{ timer.time }}</h1>
        </v-container>
        <v-container
            fluid
            class="d-flex text-center"
            style="justify-content: space-between"
        >
            <v-btn
                width="45%"
                @click="startTimer"
                :disabled="phase === 'finished'"
                >{{
                    phase === 'running' ? 'Pause Timer' : 'Start Timer'
                }}</v-btn
            >
            <v-btn
                width="45%"
                @click="resetTimer"
                :disabled="phase === 'stopped'"
                >Reset Timer</v-btn
            >
        </v-container>
    </v-app>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import type {
        Timer
    } from '@snow-mod-race/types/schemas';
    import { Getter } from 'vuex-class';

    @Component
    export default class extends Vue {
        @Getter readonly timer!: Timer; // from store.ts
        get phase() {
            return this.timer.phase;
        }
        async startTimer(): Promise<void> {
            try {
                if (this.phase === 'stopped' || this.phase === 'paused') {
                    await nodecg.sendMessage('timerStart');
                } else if (this.phase === 'running') {
                    await nodecg.sendMessage('timerPause');
                }
            } catch (err) {
                // catch
            }
        }
        async resetTimer(): Promise<void> {
            try {
                await nodecg.sendMessage('timerReset', true);
            } catch (err) {
                // error
            }
        }
    }
</script>