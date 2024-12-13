<script lang="ts" setup>
import PlayerModal from "@/components/PlayerModal.vue";
import { Player } from "@/types/game";
import { computed, ref } from "vue";

const players = ref<Player[]>([]);
const playerModalShown = ref(false);

const noPlayers = computed(() => {
  if (players.value.length === 0) return true;
  return false;
});

function addNewPlayer(player: string | Player) {
  if (typeof player === "string") {
    players.value.push({
      id: 1,
      name: player,
      average: 0,
      points: 0,
    });
  }
}
</script>

<template>
  <main class="flex flex-col bg-gray-200 h-screen">
    <section class="flex flex-col pt-2">
      <span v-if="noPlayers" v-text="'No players'" class="text-center" />
      <div v-for="player in players" class="flex">
        <span v-text="player.name" />
        <span v-text="player.average ?? '-'" />
      </div>
      <div class="flex ml-auto mr-3 items-center space-x-2">
        <span v-text="'Add player(s)'" class="text-sky-500" />
        <button
          class="my-4 bg-sky-500 text-white aspect-square w-10 rounded-full flex justify-center items-center shadow-sm hover:bg-sky-600 transition-colors"
          @click="playerModalShown = true"
        >
          <mdicon name="plus" />
        </button>
      </div>
    </section>
    <button
      v-text="'Start game'"
      class="bg-green-500 rounded-md p-2 font-medium text-white hover:bg-green-600 transition-colors w-10/12 mx-auto"
      :disabled="noPlayers"
      :class="{ '!bg-gray-400 cursor-not-allowed': noPlayers }"
    />

    <PlayerModal v-model="playerModalShown" @update-players="addNewPlayer" />
  </main>
</template>
