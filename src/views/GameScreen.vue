<script lang="ts" setup>
import PointsKeyboard from "@/components/PointsKeyboard.vue";
import { useGameStore } from "@/store/game-store";
import { Player, Point } from "@/types/game";
import { computed, onMounted, ref } from "vue";

const gameStore = useGameStore();
const game = ref();

const playerScores = computed(() => {
  if (!game.value) return;

  return game.value.players.map((player: Player) => {
    const totalPoints =
      game.value.points
        ?.filter((pointEntry: Point) => pointEntry.player.id === player.id)
        .reduce((total: number, pointEntry: Point) => {
          const playerRoundPoints = pointEntry.points?.reduce(
            (sum, p) => sum + p,
            0
          );
          return total + (playerRoundPoints ?? 0);
        }, 0) ?? 0;
    return {
      ...player,
      calculatedScore: player.totalPoints - totalPoints,
    };
  });
});

onMounted(() => {
  game.value = gameStore.getCurrentGame;
});
</script>

<template>
  <main v-if="game">
    <section class="flex flex-col pt-2 justify-items-center w-10/12 mx-auto">
      <div class="rounded-md overflow-hidden shadow-sm">
        <div
          v-for="player in playerScores"
          :key="player.id"
          class="flex mx-auto w-full even:bg-gray-400 odd:bg-gray-500 text-white py-2 px-4"
        >
          <span v-text="player.name" />
          <span v-text="player.calculatedScore" class="ml-auto mr-10" />
        </div>
      </div>
    </section>
    <PointsKeyboard :game="game" />
  </main>
</template>
