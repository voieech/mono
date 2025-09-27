import type { Channel, Episode } from "dto";

import { Trans } from "@lingui/react/macro";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import { RefreshControl, View } from "react-native";

import { SafeScrollViewContainer, ThemedView, ThemedText } from "@/components";
import { apiBaseUrl } from "@/constants";
import { getAcceptLanguageHeader } from "@/utils";

export default function HomeScreen() {
  const featuredChannelsQuery = useQuery({
    queryKey: ["podcast", "featured-channels"],
    async queryFn() {
      const res = await fetch(
        `${apiBaseUrl}/v1/landing-page/featured-channels/`,
        {
          headers: {
            ...getAcceptLanguageHeader(),
          },
        },
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
      for (const _channel of channels) {
        // queryClient.setQueryData(["podcast-channel", channel.id], channel);
      }

      return channels;
    },
  });

  const featuredEpisodesQuery = useQuery({
    queryKey: ["podcast", "featured-episodes"],
    async queryFn() {
      const res = await fetch(
        `${apiBaseUrl}/v1/landing-page/featured-episodes/`,
        {
          headers: {
            ...getAcceptLanguageHeader(),
          },
        },
      );

      if (!res.ok) {
        const defaultErrorMessage = "Failed to load featured episodes";
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
        //   episode
        // );
      }

      return episodes;
    },
  });

  const [refreshing, setRefreshing] = useState(false);
  async function onRefresh() {
    setRefreshing(true);
    await Promise.all([
      featuredChannelsQuery.refetch(),
      featuredEpisodesQuery.refetch(),
    ]);
    setRefreshing(false);
  }

  return (
    <SafeScrollViewContainer
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {featuredChannelsQuery.data !== undefined && (
        <ThemedView
          style={{
            gap: 8,
            marginBottom: 8,
          }}
        >
          <ThemedText type="subtitle">
            <Trans>Featured Channels</Trans>
          </ThemedText>
          {featuredChannelsQuery.data.map((channel) => (
            <Link
              key={channel.id}
              href={{
                pathname: "/podcast/channel/[channelID]",
                params: {
                  channelID: channel.id,
                },
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
                  source={channel.img_url}
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
                      fontSize: 24,
                    }}
                    numberOfLines={1}
                  >
                    {channel.name}
                  </ThemedText>
                  <ThemedText
                    style={{
                      paddingBottom: 4,
                      fontSize: 12,
                    }}
                    numberOfLines={2}
                  >
                    {channel.description}
                  </ThemedText>
                  {channel.category_primary !== null && (
                    <ThemedText
                      style={{
                        fontSize: 12,
                      }}
                    >
                      {channel.category_primary}
                      {channel.subcategory_primary !== null &&
                        `, ${channel.subcategory_primary}`}
                    </ThemedText>
                  )}
                </ThemedView>
              </ThemedView>
            </Link>
          ))}
        </ThemedView>
      )}
      <View
        style={{
          paddingVertical: 8,
        }}
      />
      {featuredEpisodesQuery.data !== undefined && (
        <ThemedView
          style={{
            gap: 8,
            marginBottom: 8,
          }}
        >
          <ThemedText type="subtitle">
            <Trans>Featured Episodes</Trans>
          </ThemedText>
          {featuredEpisodesQuery.data.map((episode) => (
            <Link
              key={episode.id}
              href={{
                pathname: "/podcast/episode/[vanityID]",
                params: {
                  vanityID: episode.vanity_id,
                },
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
                    {Math.trunc(episode.audio_length / 60)} mins
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </Link>
          ))}
        </ThemedView>
      )}
      <View
        style={{
          paddingBottom: 64,
        }}
      />
    </SafeScrollViewContainer>
  );
}
