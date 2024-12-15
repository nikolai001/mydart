<script lang="ts" setup>
import PlayerModal from "@/components/PlayerModal.vue";
import { useGameStore } from "@/store/game-store";
import { Gamemode, Player } from "@/types/game";
import { computed, onMounted, ref } from "vue";

const gameStore = useGameStore();

const players = ref<Player[]>([]);
const playerModalShown = ref(false);
const gamemode = <Gamemode>Gamemode.Normal;

const noPlayers = computed(() => {
  if (gameStore.gameLobby?.players.length === 0) return true;
  return false;
});

onMounted(() => gameStore.initializeGameLobby(gamemode));
</script>

<template>
  <main class="flex flex-col bg-gray-200 h-screen">
    <section class="flex flex-col pt-2 justify-items-center w-10/12 mx-auto">
      <span v-if="noPlayers" v-text="'No players'" class="text-center" />
      <div class="rounded-md overflow-hidden shadow-sm">
        <div
          v-for="player in gameStore.gameLobby?.players"
          class="flex mx-auto w-full even:bg-gray-400 odd:bg-gray-500 text-white py-2 px-4"
        >
          <span :key="player.id" v-text="player.name" />
          <span
            :key="player.id"
            v-text="player.average + ' avg'"
            class="ml-auto mr-10"
          />
          <button
            class="flex justify-center items-center"
            @click="gameStore.removePlayer(player)"
          >
            <mdicon name="close" class="text-red-500 hover:text-red-200" />
          </button>
        </div>
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
    <router-link
      v-text="'Start game'"
      class="bg-green-500 rounded-md p-2 font-medium text-white hover:bg-green-600 transition-colors w-10/12 mx-auto"
      :disabled="noPlayers"
      :class="{ '!bg-gray-400 cursor-not-allowed': noPlayers }"
      :to="'/game'"
      @click="gameStore.startGame()"
    />

    <PlayerModal v-model="playerModalShown" />
  </main>
</template>
