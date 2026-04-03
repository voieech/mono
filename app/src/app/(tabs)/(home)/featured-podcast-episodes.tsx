import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import { RefreshControl, FlatList, ActivityIndicator } from "react-native";

import { useFeaturedPodcastEpisodesInfiniteQuery } from "@/api";
import {
  SafeAreaViewContainer,
  ThemedView,
  ThemedText,
  VerticalSpacer,
} from "@/components";
import { Colors } from "@/constants";

export default function FeaturedPodcastEpisodes() {
  const featuredPodcastEpisodesInfiniteQuery =
    useFeaturedPodcastEpisodesInfiniteQuery({
      limit: 10,
    });

  const [refreshing, setRefreshing] = useState(false);
  async function onRefresh() {
    setRefreshing(true);
    await Promise.all([featuredPodcastEpisodesInfiniteQuery.refetch()]);
    setRefreshing(false);
  }

  if (featuredPodcastEpisodesInfiniteQuery.data === undefined) {
    return null;
  }

  // Flatten the pages into a single array for FlatList
  const flattenedData = featuredPodcastEpisodesInfiniteQuery.data.pages.flatMap(
    (page) => page,
  );

  if (flattenedData.length === 0) {
    return null;
  }

  return (
    <SafeAreaViewContainer>
      <FlatList
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}
        data={flattenedData}
        keyExtractor={(item) => item.id}
        renderItem={({ item: podcastEpisode }) => (
          <Link
            key={podcastEpisode.id}
            href={{
              pathname: "/podcast/episode/[episodeID]",
              params: {
                episodeID: podcastEpisode.id,
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
                source={podcastEpisode.img_url}
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
                  paddingVertical: 4,
                  paddingHorizontal: 16,
                  backgroundColor: Colors.neutral800,
                }}
              >
                <ThemedText
                  numberOfLines={3}
                  style={{
                    paddingBottom: 8,
                  }}
                >
                  {podcastEpisode.title}
                </ThemedText>
                <ThemedText type="sm-light" numberOfLines={1}>
                  {podcastEpisode.channel_name}
                </ThemedText>
                <ThemedText type="sm-light">
                  {podcastEpisode.created_at.split("T")[0]}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </Link>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        // How close to the bottom before triggering the `onEndReached` method,
        // where 0.1 = 10% of the list's visible length remains
        onEndReachedThreshold={0.1}
        // Triggered when user reaches the threshold
        onEndReached={() => {
          if (
            featuredPodcastEpisodesInfiniteQuery.hasNextPage &&
            !featuredPodcastEpisodesInfiniteQuery.isFetchingNextPage
          ) {
            featuredPodcastEpisodesInfiniteQuery.fetchNextPage();
          }
        }}
        ItemSeparatorComponent={() => <VerticalSpacer height={4} />}
        ListFooterComponent={
          featuredPodcastEpisodesInfiniteQuery.isFetchingNextPage ? (
            <ActivityIndicator size="small" />
          ) : null
        }
      />
    </SafeAreaViewContainer>
  );
}
