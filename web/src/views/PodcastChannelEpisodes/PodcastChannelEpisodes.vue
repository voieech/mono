<script setup lang="ts">
import { useRoute, useRouter, RouterLink } from "vue-router";

import LanguageSelector from "@/components/LanguageSelector.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { usePodcastChannel } from "@/composables/usePodcastChannel";
import { usePodcastChannelEpisodes } from "@/composables/usePodcastChannelEpisodes";

import { HomeRoute, PodcastEpisodeRoute } from "../../router";

const router = useRouter();
const route = useRoute();
const channelID = route.params.channelID.toString();

const podcastChannelQuery = usePodcastChannel(channelID, { router });
const podcastChannelEpisodesQuery = usePodcastChannelEpisodes(channelID, {
  router,
});
</script>

<template>
  <div class="mx-auto max-w-screen-sm p-4 pb-32">
    <div class="flex flex-row items-center justify-between pb-4">
      <router-link :to="HomeRoute">
        <img class="h-12" src="../../assets/logo.png" alt="voieech logo" />
      </router-link>
      <LanguageSelector />
    </div>

    <LoadingSpinner
      v-if="podcastChannelEpisodesQuery.isPending.value"
      :message="$t('PodcastChannelEpisodes.loading_episodes')"
    />
    <div v-else-if="podcastChannelEpisodesQuery.isError.value">
      Error: {{ podcastChannelEpisodesQuery.error.value?.message }}
    </div>
    <template v-else-if="podcastChannelEpisodesQuery.data.value !== undefined">
      <p
        v-if="podcastChannelQuery.data.value !== undefined"
        class="pb-4 text-2xl font-medium text-zinc-800"
      >
        {{ podcastChannelQuery.data.value.name }}
      </p>

      <p class="pb-2 text-zinc-600">
        {{ $t("common.Episodes") }} ({{
          $t("PodcastChannelEpisodes.latest_first")
        }})
      </p>

      <div class="flex flex-col gap-4">
        <template
          v-for="episode of podcastChannelEpisodesQuery.data.value"
          :key="episode.id"
        >
          <RouterLink
            :to="{
              name: PodcastEpisodeRoute.name,
              params: {
                vanityID: episode.vanity_id,
              },
            }"
          >
            <div class="rounded-lg border border-zinc-200 p-4 shadow-lg">
              <p class="pb-2 text-xs text-zinc-600">
                <span class="pr-2">{{ episode.created_at.split("T")[0] }}</span>
                <template v-if="episode.season_number !== null">
                  {{
                    $t("common.SeasonNumber", {
                      seasonNumber: episode.season_number,
                    })
                  }},
                </template>
                <template v-if="episode.episode_number !== null">
                  {{
                    $t("common.EpisodeNumber", {
                      episodeNumber: episode.episode_number,
                    })
                  }}
                </template>
              </p>

              <div class="pb-2">
                <p
                  class="line-clamp-3 text-sm leading-snug text-zinc-800 sm:line-clamp-2 sm:text-base"
                >
                  {{ episode.title }}
                </p>
              </div>

              <!-- @todo Add a play button -->

              <p class="text-xs font-extralight text-zinc-600">
                {{ Math.trunc(episode.audio_length / 60) }}
                {{ $t("common.mins") }}
              </p>
            </div>
          </RouterLink>
        </template>
      </div>
    </template>
  </div>
</template>
