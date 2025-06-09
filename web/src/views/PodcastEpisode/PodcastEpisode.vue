<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useHead } from "@unhead/vue";
import PlatformCard from "./PlatformCard.vue";
import WebPlayer from "./WebPlayer.vue";
import LanguageSelector from "@/components/LanguageSelector.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";
import { usePodcastEpisode } from "@/composables/usePodcastEpisode";
import { HomeRoute } from "@/router";

const i18n = useI18n({ useScope: "global" });
const router = useRouter();
const route = useRoute();
const vanityID = route.params.vanityID.toString();
const isDescriptionExpanded = ref(false);
const podcastEpisodeQuery = usePodcastEpisode({ vanityID }, { router, i18n });

useHead({
  title: computed(() =>
    podcastEpisodeQuery.data.value === undefined
      ? document.title
      : `voieech AI podcast - ${podcastEpisodeQuery.data.value.title}`,
  ),
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
      v-if="podcastEpisodeQuery.isPending.value"
      :message="$t('PodcastEpisode.loadingEpisode')"
    />
    <div v-else-if="podcastEpisodeQuery.isError.value">
      Error: {{ podcastEpisodeQuery.error.value?.message }}
    </div>
    <div v-else-if="podcastEpisodeQuery.data.value !== undefined">
      <div class="pb-4">
        <p class="text-sm font-thin">
          <span class="pr-2">{{
            podcastEpisodeQuery.data.value.created_at.split("T")[0]
          }}</span>

          <template
            v-if="podcastEpisodeQuery.data.value.season_number !== null"
          >
            {{
              $t("common.SeasonNumber", {
                seasonNumber: podcastEpisodeQuery.data.value.season_number,
              })
            }},
          </template>
          <template
            v-if="podcastEpisodeQuery.data.value.episode_number !== null"
          >
            {{
              $t("common.EpisodeNumber", {
                episodeNumber: podcastEpisodeQuery.data.value.episode_number,
              })
            }}
          </template>
        </p>
        <p class="pb-2 text-2xl text-zinc-800">
          {{ podcastEpisodeQuery.data.value.title }}
        </p>

        <p>
          {{ Math.trunc(podcastEpisodeQuery.data.value.audio_length / 60) }}
          {{ $t("common.mins") }}
        </p>

        <div class="py-2"></div>

        <p
          class="text-sm leading-relaxed font-light"
          :class="{
            'line-clamp-3 text-zinc-800': !isDescriptionExpanded,
          }"
        >
          {{ podcastEpisodeQuery.data.value.description }}
        </p>

        <div class="text-right">
          <button
            class="cursor-pointer text-sm text-blue-400 outline-none"
            :onclick="() => (isDescriptionExpanded = !isDescriptionExpanded)"
          >
            {{
              isDescriptionExpanded
                ? $t("PodcastEpisode.Hide")
                : $t("PodcastEpisode.ReadMore")
            }}
          </button>
        </div>
      </div>

      <div>
        <p class="pb-2 pl-4 text-sm font-light text-zinc-400 italic">
          {{ $t("common.PodcastPlatforms") }}
        </p>

        <WebPlayer
          class="pb-4"
          :url="podcastEpisodeQuery.data.value.audio_public_url"
        />

        <PlatformCard
          class="pb-4"
          v-for="platform in podcastEpisodeQuery.data.value
            .externallyHostedLinks"
          :key="platform.podcast_platform"
          :platform="platform"
        />
      </div>
    </div>

    <!-- @todo Add social icons here -->
  </div>
</template>
