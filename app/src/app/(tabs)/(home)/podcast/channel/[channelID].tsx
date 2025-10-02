import type { Channel, Episode } from "dto";

import { Trans } from "@lingui/react/macro";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import { useState } from "react";
import { RefreshControl } from "react-native";

import {
  ParallaxScrollViewContainer,
  SafeScrollViewContainer,
  FullScreenLoader,
  ThemedView,
  ThemedText,
} from "@/components";
import { apiBaseUrl } from "@/constants";

export default function PodcastChannel() {
  const router = useRouter();
  const channelID = useLocalSearchParams<{ channelID: string }>().channelID;

  const podcastChannelQuery = useQuery({
    queryKey: ["podcast", "channel", channelID],
    async queryFn() {
      const res = await fetch(`${apiBaseUrl}/v1/podcast/channel/${channelID}`);

      if (!res.ok) {
        if (res.status === 404) {
          router.replace("/+not-found");
        }

        const defaultErrorMessage = `Failed to load channel: ${channelID}`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        throw new Error(errorMessage);
      }

      return (await res.json()) as Channel;
    },
  });

  const podcastChannelEpisodesQuery = useQuery({
    queryKey: ["podcast", "channel-episodes", channelID],
    async queryFn() {
      const res = await fetch(
        `${apiBaseUrl}/v1/podcast/channel/${channelID}/episodes`,
      );

      if (!res.ok) {
        if (res.status === 404) {
          router.replace("/+not-found");
        }

        const defaultErrorMessage = `Failed to load channel episodes: ${channelID}`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        throw new Error(errorMessage);
      }

      const episodes = (await res.json()) as Array<Episode>;

      // Cache data so these dont need to be re queried again on navigate
      for (const _episode of episodes) {
        // queryClient.setQueryData(
        //   ["podcast-episode", "vanityID", episode.vanity_id],
        //   episode,
        // );
      }

      return episodes;
    },
  });

  const [refreshing, setRefreshing] = useState(false);
  async function onRefresh() {
    setRefreshing(true);
    await Promise.all([
      podcastChannelQuery.refetch(),
      podcastChannelEpisodesQuery.refetch(),
    ]);
    setRefreshing(false);
  }

  if (podcastChannelQuery.isPending) {
    return <FullScreenLoader />;
  }

  if (podcastChannelQuery.isError || podcastChannelQuery.data === undefined) {
    return (
      <SafeScrollViewContainer>
        <ThemedText>Error: {podcastChannelQuery.error.message}</ThemedText>
      </SafeScrollViewContainer>
    );
  }

  return (
    <ParallaxScrollViewContainer
      headerHeightUseWidth={true}
      headerImage={
        <ThemedView
          style={{
            // Set a width that is as wide as most devices, then let maxWidth
            // constrain it to the "screen - horizontal padding"
            width: 500,
            maxWidth: "100%",
            alignSelf: "center",

            paddingBottom: 16,
          }}
        >
          <Image
            source={podcastChannelQuery.data.img_url}
            style={{
              aspectRatio: 1,
            }}
            contentFit="contain"
          />
        </ThemedView>
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ThemedText type="title">{podcastChannelQuery.data.name}</ThemedText>
      <ThemedText>{podcastChannelQuery.data.description}</ThemedText>
      {!podcastChannelEpisodesQuery.isLoading &&
        !podcastChannelEpisodesQuery.isError &&
        podcastChannelEpisodesQuery.data !== undefined && (
          <>
            <ThemedText
              style={{
                paddingTop: 20,
                paddingBottom: 8,
                fontSize: 20,
              }}
              type="subtitle"
            >
              <Trans>Featured</Trans>
            </ThemedText>
            {podcastChannelEpisodesQuery.data.map((episode) => {
              const episodeLengthInMins = Math.trunc(episode.audio_length / 60);
              return (
                <Link
                  key={episode.id}
                  href={{
                    pathname: "/podcast/episode/[vanityID]",
                    params: {
                      vanityID: episode.vanity_id,
                    },
                  }}
                  style={{
                    marginBottom: 8,
                  }}
                >
                  <ThemedView
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      borderRadius: 16,
                    }}
                  >
                    <Image
                      source={episode.img_url}
                      style={{
                        width: "100%",
                        height: "100%",
                        maxWidth: 128,
                        borderTopLeftRadius: 16,
                        borderBottomLeftRadius: 16,
                      }}
                      contentFit="cover"
                    />
                    <ThemedView
                      style={{
                        flex: 1,
                        borderTopRightRadius: 16,
                        borderBottomRightRadius: 16,
                        padding: 16,
                        backgroundColor: "#3f3f46",
                      }}
                    >
                      <ThemedText
                        style={{
                          paddingBottom: 2,
                        }}
                        numberOfLines={2}
                      >
                        {episode.title}
                      </ThemedText>
                      <ThemedText
                        style={{
                          fontSize: 12,
                        }}
                      >
                        {episode.created_at.split("T")[0]}
                        {"\n"}
                        <Trans>{episodeLengthInMins} mins</Trans>
                      </ThemedText>
                    </ThemedView>
                  </ThemedView>
                </Link>
              );
            })}
          </>
        )}
    </ParallaxScrollViewContainer>
  );
}
