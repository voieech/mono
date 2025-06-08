<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { twMerge } from "tailwind-merge";

const props = defineProps<{ url: string }>();

const showPlayer = ref(false);
const audioPlayerRef = useTemplateRef("audio-player");

const playbackRateOptions = [
  "0.25",
  "0.50",
  "0.75",
  "1.00",
  "1.25",
  "1.50",
  "1.75",
  "2.00",
  "2.25",
  "2.50",
  "2.75",
  "3.00",
] as const;
const playbackRateDefaultOptionIndex = 3;
const playbackRateOptionIndex = ref<number>(playbackRateDefaultOptionIndex);

function onAudioPlayerLoaded<T extends Array<unknown>>(
  fn: (audioPlayer: HTMLAudioElement, ...args: T) => unknown,
) {
  return function (...args: T) {
    const audioPlayer = audioPlayerRef.value;
    if (audioPlayer === null) {
      console.error(`AudioPlayer not available when calling: ${fn.name}`);
      return;
    }

    fn(audioPlayer, ...args);
  };
}

const skipForward = onAudioPlayerLoaded(
  (audioPlayer) => (audioPlayer.currentTime += 10),
);

const skipBackward = onAudioPlayerLoaded(
  (audioPlayer) => (audioPlayer.currentTime -= 10),
);

const updateSpeed = onAudioPlayerLoaded(
  (audioPlayer, direction: "+" | "-" | "reset") => {
    // Do nothing if min and max option hit
    if (
      (direction === "-" && playbackRateOptionIndex.value === 0) ||
      (direction === "+" &&
        playbackRateOptionIndex.value === playbackRateOptions.length - 1)
    ) {
      return;
    }

    if (direction === "+") {
      playbackRateOptionIndex.value += 1;
    } else if (direction === "-") {
      playbackRateOptionIndex.value -= 1;
    } else {
      playbackRateOptionIndex.value = playbackRateDefaultOptionIndex;
    }

    audioPlayer.playbackRate =
      parseFloat(playbackRateOptions[playbackRateOptionIndex.value]) ?? 1;
  },
);

const onNativePlaybackRateChange = onAudioPlayerLoaded(async (audioPlayer) => {
  const playbackRate = audioPlayer.playbackRate.toFixed(2);
  const playbackRateIndex = playbackRateOptions.findIndex(
    (val) => val.toString() === playbackRate,
  );

  playbackRateOptionIndex.value =
    playbackRateIndex === -1
      ? playbackRateDefaultOptionIndex
      : playbackRateIndex;
});
</script>

<template>
  <div>
    <div
      :class="{
        'pb-4': showPlayer,
      }"
    >
      <div
        :class="
          twMerge(
            'w-full cursor-pointer rounded-full border border-zinc-200 bg-zinc-50 p-4 shadow-md select-none',
            showPlayer && 'rounded-2xl shadow-2xl',
          )
        "
      >
        <div
          class="flex w-full flex-row items-center gap-4"
          @click="showPlayer = !showPlayer"
        >
          <img
            class="h-8 w-8 sm:h-12 sm:w-12"
            src="../../assets/platform-logo/voieech-web-player.png"
            alt="Voieech Web Player icon"
          />
          <div class="flex w-full flex-row items-center justify-between">
            <p>
              {{ $t("PodcastEpisode.WebPlayer.name") }}
              <span class="pl-1 text-xs font-light text-zinc-400">
                ({{ $t("PodcastEpisode.WebPlayer.preferred") }})
              </span>
            </p>
            <svg
              class="mr-3 h-6 w-6 shrink-0 text-yellow-400 transition duration-150"
              :class="{
                'rotate-90': !showPlayer,
                'rotate-180': showPlayer,
              }"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5 5 1 1 5"
              />
            </svg>
          </div>
        </div>

        <div :class="twMerge('pt-8 sm:pt-4', !showPlayer && 'hidden')">
          <audio
            ref="audio-player"
            controls
            class="w-full pb-8"
            :src="props.url"
            :preload="showPlayer ? 'auto' : 'metadata'"
            :onratechange="onNativePlaybackRateChange"
          />

          <div class="border-t border-zinc-200 pb-8"></div>

          <div class="flex flex-row items-center justify-between pb-8">
            <p class="text-2xl font-extralight text-zinc-600">
              {{ $t("PodcastEpisode.WebPlayer.Control") }}
            </p>
            <div class="flex flex-row justify-center gap-4">
              <button class="h-7 w-7" :onclick="skipBackward">
                <img
                  class="w-full"
                  src="../../assets/skipBackward.png"
                  :alt="$t('PodcastEpisode.WebPlayer.SkipBackward')"
                />
              </button>
              <button class="h-7 w-7" :onclick="skipForward">
                <img
                  class="w-full"
                  src="../../assets/skipForward.png"
                  :alt="$t('PodcastEpisode.WebPlayer.SkipForward')"
                />
              </button>
            </div>
          </div>

          <div class="border-t border-zinc-200 pb-8"></div>

          <div class="flex flex-row items-center justify-between pb-4">
            <div class="flex flex-row items-center gap-2">
              <p class="text-2xl font-extralight text-zinc-600">
                {{ $t("PodcastEpisode.WebPlayer.Speed") }}
              </p>
              <p class="text-2xl font-thin text-zinc-600">
                {{ playbackRateOptions[playbackRateOptionIndex] }}
              </p>
            </div>

            <div class="flex flex-row items-center gap-3">
              <button class="h-7 w-7" :onclick="() => updateSpeed('reset')">
                <img
                  class="w-full opacity-40"
                  src="../../assets/reset.png"
                  :alt="$t('PodcastEpisode.WebPlayer.Reset')"
                />
              </button>
              <button class="h-8 w-8" :onclick="() => updateSpeed('-')">
                <img
                  class="w-full"
                  src="../../assets/down.svg"
                  :alt="$t('PodcastEpisode.WebPlayer.SpeedUp')"
                />
              </button>
              <button class="h-8 w-8" :onclick="() => updateSpeed('+')">
                <img
                  class="w-full"
                  src="../../assets/up.svg"
                  :alt="$t('PodcastEpisode.WebPlayer.SlowDown')"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
