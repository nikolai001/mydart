<script lang="ts" setup>
import { useGameStore } from "@/store/game-store";
import { ref } from "vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const gameStore = useGameStore();
const router = useRouter();

const game = ref();

onMounted(() => {
  game.value = gameStore.getCurrentGame;
  if (game.value.players) {
    router.push("game");
  }
});
</script>

<template>
  <main class="flex flex-col bg-gray-200 h-screen">
    <img src="@/assets/dart.png" class="aspect-square w-full" />
    <div class="flex flex-col w-10/12 mx-auto space-y-2">
      <router-link
        :to="'player-selection'"
        v-text="'Play'"
        class="bg-green-500 rounded-md p-2 font-medium text-white text-center hover:bg-green-600 transition-colors"
      />
      <button
        v-text="'Show stats'"
        class="bg-sky-500 rounded-md p-2 font-medium text-white hover:bg-sky-600 transition-colors"
      />
    </div>
  </main>
</template>
