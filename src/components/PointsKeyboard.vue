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
</script>

<template>
  <section class="w-10/12 mx-auto mt-4">
    <div
      v-if="props.game.Gamemode === Gamemode.Normal"
      class="flex flex-wrap justify-center gap-2"
    >
      <div class="flex w-full justify-evenly">
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
        v-for="index in 20"
        :key="index"
        v-text="index"
        class="bg-gray-300 w-1/6 aspect-square rounded-md hover:bg-gray-400 transition-colors"
        @click="gameStore.addPoint(index, multiplier)"
      />
      <div class="flex w-full justify-evenly">
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
