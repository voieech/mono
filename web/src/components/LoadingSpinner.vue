<script setup lang="ts">
import { ref, onUnmounted } from "vue";

const props = defineProps<{
  /**
   * Allow users to set a delay in ms before loader is shown to improve
   * UX and perceived performance, by not flashing the loader momentarily
   * especially if the loader is only displayed for a short period of time, for
   * e.g. if your API call is very fast.
   *
   * Defaults to 500ms if not set.
   */
  delayInMsBeforeShowingLoader?: number;

  /**
   * Custom loading message to override the default loading message
   */
  message?: string;
}>();

const showLoader = ref(false);
const timer = setTimeout(
  () => (showLoader.value = true),
  props.delayInMsBeforeShowingLoader ?? 500,
);
onUnmounted(() => clearTimeout(timer));

const imageLink = new URL(
  // Generate 0-2 to randomly pick one of the gifs
  [
    `../assets/loading/1.webp`,
    `../assets/loading/2.gif`,
    `../assets/loading/3.gif`,
  ][Math.trunc(Math.random() * 3)],
  import.meta.url,
).href;
</script>

<template>
  <div
    v-if="showLoader"
    class="bg-opacity-40 fixed top-0 left-0 z-40 flex h-screen w-screen items-center justify-center backdrop-blur-xs select-none"
  >
    <div
      class="max-w-xs rounded-2xl border border-zinc-200 px-8 py-8 shadow-2xl sm:max-w-sm md:px-16"
    >
      <div class="flex flex-row justify-center">
        <img class="w-full" :src="imageLink" alt="loading animation" />
      </div>

      <!-- @todo -->
      <!-- <div v-if="longerThanExpected">
        <p class="pb-1 leading-tight md:text-lg">
          This is taking longer than usual, do you want to reload the page and
          try again?
        </p>
        <p class="pb-4 text-sm">
          *Reloading page might reset whatever you were doing.
        </p>

        <button
          class="w-full rounded-lg border border-zinc-300 p-1 text-lg text-zinc-700"
          @click="reloadPage"
        >
          Reload
        </button>
      </div> -->

      <p class="pt-8 text-center text-3xl font-thin">
        ...{{ props.message ?? $t("common.loading") }}...
      </p>
    </div>
  </div>
</template>
