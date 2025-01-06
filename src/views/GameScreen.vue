<script lang="ts" setup>
import FinishGameModal from "@/components/FinishGameModal.vue";
import PointsKeyboard from "@/components/PointsKeyboard.vue";
import { useGameStore } from "@/store/game-store";
import { Player, Point } from "@/types/game";
import { watch } from "vue";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const gameStore = useGameStore();
const router = useRouter();

const game = ref();
const finishGameModalShown = ref(false);

const playerScores = computed(() => {
  if (!game.value) return;

  return game.value.players?.map((player: Player) => {
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
      id: player.id,
      name: player.name,
      totalPoints: player.totalPoints - totalPoints,
      average: 0,
    };
  });
});

watch(playerScores, (scores) => {
  if (!game.value.players) return;
  scores.forEach((player: Player) => {
    if (player.totalPoints < 0) {
      const lastPlayerRound = gameStore.currentGame?.points?.findLast(
        (round) => round.player.id === player.id
      );
      if (!lastPlayerRound) return;

      const lastPlayerRoundIndex =
        gameStore.currentGame?.points?.indexOf(lastPlayerRound);
      console.log(5);
      if (!lastPlayerRoundIndex) return;

      gameStore.currentGame?.points?.splice(lastPlayerRoundIndex, 1);
      gameStore.incrementPlayer();
      return;
    }

    if (
      player.totalPoints === 0 &&
      !game.value.winners.find((plr: Player) => plr.id === player.id)
    ) {
      game.value.winners.push(player);
      gameStore.incrementPlayer();
    }
  });
});

watch(
  game,
  () => {
    if (!game.value) return;
    if (!game.value.players) return;
    if (!game.value.winners) return;
    if (game.value.winners.length === game.value.players.length) {
      finishGameModalShown.value = true;
    }
  },
  { deep: true }
);

function playerRoundScore(player: Player): Number[] | undefined {
  if (!game.value) return;

  const currentRoundPoints = game.value.points?.find(
    (pointEntry: Point) =>
      pointEntry.player.id === player.id &&
      pointEntry.round === game.value.round
  );

  const fallbackPoints =
    currentRoundPoints ??
    game.value.points?.find(
      (pointEntry: Point) =>
        pointEntry.player.id === player.id &&
        pointEntry.round === game.value.round - 1
    );

  return fallbackPoints?.points?.join(", ");
}

function cancelGame() {
  gameStore.cancelGame();
  router.push("/");
}

onMounted(() => {
  game.value = gameStore.getCurrentGame;
});
</script>

<template>
  <main v-if="game">
    <section class="flex flex-col pt-2 justify-items-center w-10/12 mx-auto">
      <button
        class="flex space-x-2 bg-gray-300 px-3 py-2 rounded-md hover:bg-gray-400 transition-colors mb-10 w-fit"
        @click="cancelGame()"
      >
        <mdicon name="home" />
        <span v-text="'End game'" />
      </button>
      <div class="rounded-md overflow-hidden shadow-sm">
        <div
          v-for="player in playerScores"
          :key="player.id"
          class="flex mx-auto w-full even:bg-gray-400 odd:bg-gray-500 text-white py-2 px-4"
          :class="{
            'animate-pulse':
              game.currentPlayer.id === player.id && player.totalPoints > 0,
            'bg-gray-800': player.totalPoints === 0,
          }"
        >
          <span v-text="player.name" class="w-16 truncate" />
          <span v-text="playerRoundScore(player)" class="ml-20 w-1/3" />
          <span
            v-text="player.totalPoints > 0 ? player.totalPoints : 0"
            class="ml-auto mr-10"
          />
          <span v-if="player.totalPoints <= 0" class="ml-4 text-red-500">
            <mdicon
              v-if="
                game.winners.findIndex((winner:Player) => winner.id === player.id) ===
                0
              "
              name="crown"
            />
            <mdicon
              v-if="
                game.winners.findIndex((winner:Player) => winner.id === player.id) ===
                1
              "
              name="chess-queen"
            />

            <mdicon
              v-if="
                game.winners.findIndex((winner:Player) => winner.id === player.id) ===
                2
              "
              name="chess-pawn"
            />

            <mdicon
              v-if="
                game.winners.findIndex((winner:Player) => winner.id === player.id) ===
                3
              "
              name="emoticon-poop"
            />
          </span>
        </div>
      </div>
      <FinishGameModal v-model="finishGameModalShown" />
    </section>
    <PointsKeyboard :game="game" />
  </main>
</template>
