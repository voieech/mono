<script setup lang="ts">
import type { Episode } from "dto";

const props = defineProps<{
  platform: Episode["externally_hosted_links"][number];
}>();

const imageLink = new URL(
  `../../assets/platform-logo/${props.platform.podcast_platform}.png`,
  import.meta.url,
).href;
</script>

<template>
  <div>
    <a :href="props.platform.url" target="_blank">
      <div
        class="flex w-full flex-row items-center gap-4 rounded-full border border-zinc-200 bg-zinc-50 p-4 shadow-lg"
      >
        <img
          class="h-8 w-8 sm:h-12 sm:w-12"
          :src="imageLink"
          :alt="`${props.platform.podcast_platform}-icon`"
        />
        <div class="w-full">
          <p>{{ $t(`PlatformName.${props.platform.podcast_platform}`) }}</p>
        </div>
      </div>
    </a>
  </div>
</template>
