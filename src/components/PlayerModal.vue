<script lang="ts" setup>
import { Player } from "@/types/game";
import { computed, ref } from "vue";
import { useGameStore } from "@/store/game-store";
interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const gameStore = useGameStore();

const addNewPlayersShown = ref(false);
const player = ref<String>("");

const storedPlayers = computed(() => {
  return gameStore.players.filter((plr) => {
    return !gameStore.gameLobby?.players?.some(
      (gamePlayer) => gamePlayer.id === plr.id
    );
  });
});
</script>

<template>
  <div
    v-if="props.modelValue"
    class="absolute w-10/12 bg-gray-500 rounded-md flex flex-col px-5 py-6 left-1/2 -translate-x-1/2 translate-y-4"
  >
    <button
      class="bg-red-500 text-white aspect-square w-6 rounded-full flex justify-center items-center shadow-sm ml-auto -translate-y-3 translate-x-1"
      @click="emit('update:modelValue', false)"
    >
      <mdicon name="close" height="20" width="20" />
    </button>

    <div class="flex space-x-2 justify-center mb-2">
      <button
        @click="gameStore.addPlayer(player as Player)"
        class="bg-sky-500 shadow-md rounded-md px-3 py-1 hover:bg-sky-600 transition-colors"
        v-for="player in storedPlayers"
      >
        {{ player.name }}
      </button>
    </div>

    <button
      v-if="storedPlayers.length > 0"
      class="flex flex-wrap w-max mx-auto"
      @click="addNewPlayersShown = !addNewPlayersShown"
    >
      <span class="text-white" v-text="'Add additional players'" />
      <mdicon
        class="transition-all text-white mb-2"
        name="chevron-right"
        :class="{ 'rotate-90': addNewPlayersShown }"
      />
      <hr class="border-t border-white w-full h-1 flex-shrink-0" />
    </button>
    <div
      class="flex flex-col space-y-3"
      v-if="
        addNewPlayersShown ||
        (!addNewPlayersShown && storedPlayers.length === 0)
      "
    >
      <label v-text="'Name'" for="name" />
      <input
        type="text"
        id="name"
        class="outline-none py-1 px-2 rounded-md shadow-sm hover:shadow-md transition-all hover:bg-slate-50 bg-white"
        v-model="player"
      />
      <button
        v-text="'Add player'"
        class="bg-green-500 rounded-md p-2 font-medium text-white hover:bg-green-600 transition-colors ml-auto shadow-sm"
        @click="gameStore.addPlayer(player as string)"
      />
    </div>
  </div>
</template>

<!-- :disabled="noPlayers"
      :class="{ '!bg-gray-400 cursor-not-allowed': noPlayers }" -->
