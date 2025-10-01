<script setup lang="ts">
import type { Channel } from "dto";

import { useQueryClient, useQuery } from "@tanstack/vue-query";
import { useI18n } from "vue-i18n";
import { RouterLink } from "vue-router";

import { apiBaseUrl } from "@/api";
import { PodcastChannelRoute } from "@/router";

const i18n = useI18n({ useScope: "global" });
const queryClient = useQueryClient();

const {
  isPending,
  isError,
  data: featuredChannels,
} = useQuery({
  queryKey: ["featured-channels"],
  async queryFn() {
    const res = await fetch(
      `${apiBaseUrl}/v1/podcast/featured/channel?count=6&lang=${i18n.locale.value}`,
    );

    if (!res.ok) {
      const defaultErrorMessage = "Failed to load featured channels";
      const errorMessage = await res
        .json()
        .then((data) => data.error ?? defaultErrorMessage)
        .catch(() => defaultErrorMessage);
      throw new Error(errorMessage);
    }

    const channels = (await res.json()) as Array<Channel>;

    // Cache data so these dont need to be re queried again on navigate
    for (const channel of channels) {
      queryClient.setQueryData(["podcast-channel", channel.id], channel);
    }

    return channels;
  },
});
</script>

<template>
  <div
    v-if="!isPending && !isError && featuredChannels?.length !== 0"
    class="mx-auto max-w-6xl px-6 md:px-12 lg:px-16 xl:px-24"
  >
    <p class="pb-4 text-2xl text-zinc-800">Featured Channels</p>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-8">
      <template v-for="channel of featuredChannels" :key="channel.vanityID">
        <RouterLink
          :to="{
            name: PodcastChannelRoute.name,
            params: {
              channelID: channel.id,
            },
          }"
        >
          <div
            class="flex h-full flex-row rounded-2xl border border-zinc-200 shadow-sm hover:shadow-2xl"
          >
            <img
              class="w-32 rounded-l-2xl object-cover sm:w-40"
              :src="channel.img_url"
              alt="podcast channel image"
            />

            <div class="flex flex-col justify-between p-4 lg:p-6">
              <div class="pb-2">
                <p class="line-clamp-1 text-lg sm:text-2xl">
                  {{ channel.name }}
                </p>
                <p class="line-clamp-2 text-sm text-zinc-600 sm:line-clamp-3">
                  {{ channel.description }}
                </p>
              </div>
              <div v-if="channel.category_primary !== null">
                <p class="text-xs font-light text-zinc-600 italic">
                  {{ channel.category_primary
                  }}<template v-if="channel.subcategory_primary !== null"
                    >, {{ channel.subcategory_primary }}</template
                  >
                </p>
              </div>
            </div>
          </div>
        </RouterLink>
      </template>
    </div>
  </div>
</template>
