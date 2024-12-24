<script lang="ts" setup>
import { useGameStore } from "@/store/game-store";
import { Game, Gamemode, Multiplier } from "@/types/game";
import { ref } from "vue";

interface Props {
  game: Game;
}

const gameStore = useGameStore();

const multiplier = ref<Multiplier | undefined>();

const props = defineProps<Props>();

function undo() {
  if (!props.game.points || props.game.points.length === 0) return;

  const pointLength = props.game.points.length;
  const currentRound = props.game.points[pointLength - 1];
  const roundStartedPlayer = currentRound.points!.length > 0;

  if (roundStartedPlayer) {
    currentRound.points!.pop();
    props.game.currentPlayer = currentRound.player;
  } else {
    const previousRoundPlayer = currentRound.player;
    props.game.points.pop();

    const players = props.game.players || [];
    if (players.length === 0) return;

    if (props.game.points.length > 0) {
      props.game.currentPlayer = previousRoundPlayer;
    } else {
      const currentPlayer = props.game.currentPlayer;
      const currentIndex = players.findIndex(
        (player) => player.id === currentPlayer?.id
      );

      if (currentIndex === -1) return;

      if (currentIndex === 0) {
        if (props.game.round! > 1) {
          props.game.currentPlayer = players[players.length - 1];
        }
        if (props.game.round! > 1) {
          props.game.round!--;
        }
      } else {
        props.game.currentPlayer = players[currentIndex - 1];
      }
    }
  }
}
</script>

<template>
  <section class="w-10/12 mx-auto mt-4">
    <button
      class="flex bg-gray-300 px-3 py-2 rounded-md items-center space-x-2 hover:bg-gray-400 transition-colors mb-3"
      @click="undo()"
    >
      <mdicon name="undo" />
      <span v-text="'undo'" />
    </button>
    <div
      v-if="props.game.Gamemode === Gamemode.Normal"
      class="flex flex-wrap justify-center gap-2"
    >
      <div class="flex w-full justify-between">
        <button
          v-text="'Double'"
          class="bg-green-600 p-2 text-white rounded-md hover:bg-green-700 transition-colors w-2/5"
        />
        <button
          v-text="'Triple'"
          class="bg-red-500 p-2 text-white rounded-md hover:bg-red-600 transition-colors w-2/5"
        />
      </div>
      <button
        v-for="(_, index) in 21"
        :key="index"
        v-text="index"
        class="bg-gray-300 w-1/6 aspect-square rounded-md hover:bg-gray-400 transition-colors"
        @click="gameStore.addPoint(index, multiplier)"
      />
      <div class="flex w-full justify-between">
        <button
          v-text="'Semi bull'"
          class="bg-green-600 p-2 text-white rounded-md hover:bg-green-700 transition-colors w-2/5"
        />
        <button
          v-text="'Bullseye'"
          class="bg-red-500 p-2 text-white rounded-md hover:bg-red-600 transition-colors w-2/5"
        />
      </div>
    </div>
  </section>
</template>
