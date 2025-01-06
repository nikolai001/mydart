<script lang="ts" setup>
import { useGameStore } from "@/store/game-store";
import { useRouter } from "vue-router";

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const gameStore = useGameStore();
const router = useRouter();

function completeGame() {
  emit("update:modelValue", false);

  gameStore.completeGame();
  router.push("/");
}
</script>

<template>
  <section
    v-if="props.modelValue"
    class="flex absolute h-screen bg-black bg-opacity-10 w-full left-0 top-0 backdrop-blur-md"
  >
    <div
      class="w-10/12 bg-gray-500 rounded-md flex flex-col h-fit mx-auto my-auto -translate-y-40 py-2"
    >
      <span
        v-text="'Game finished'"
        class="text-white font-semibold text-center"
      />
      <button
        class="bg-green-500 rounded-md p-2 font-medium text-white hover:bg-green-600 transition-colors mx-auto shadow-sm flex space-x-2 mt-2"
        @click="completeGame()"
      >
        <mdicon name="home" />
        <span v-text="'Finish game'" />
      </button>
    </div>
  </section>
</template>
