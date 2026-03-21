import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, RefreshControl, View } from "react-native";

import { useUserConsumedInfiniteQuery, usePodcastEpisodeQuery } from "@/api";
import { SafeScrollViewContainer, ThemedView, ThemedText } from "@/components";
import { Colors } from "@/constants";

export default function History() {
  const userConsumedInfiniteQuery = useUserConsumedInfiniteQuery({
    limit: 10,
  });

  const [refreshing, setRefreshing] = useState(false);
  async function onRefresh() {
    setRefreshing(true);
    await Promise.all([userConsumedInfiniteQuery.refetch()]);
    setRefreshing(false);
  }

  if (userConsumedInfiniteQuery.data === undefined) {
    return null;
  }

  return (
    <SafeScrollViewContainer
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View
        style={{
          flexDirection: "column",
          rowGap: 8,
        }}
      >
        {userConsumedInfiniteQuery.data.pages.map((page) =>
          page.map((consumedItem) =>
            consumedItem.itemType === "podcast_episode" ? (
              <PodcastEpisodeRow
                key={consumedItem.itemID}
                id={consumedItem.itemID}
              />
            ) : null,
          ),
        )}
      </View>

      <Pressable
        style={{
          margin: 16,
          padding: 16,
          backgroundColor: Colors.black,
        }}
        onPress={() => userConsumedInfiniteQuery.fetchNextPage()}
        disabled={
          !userConsumedInfiniteQuery.hasNextPage ||
          userConsumedInfiniteQuery.isFetchingNextPage
        }
      >
        <ThemedText>
          {userConsumedInfiniteQuery.isFetchingNextPage
            ? "Loading..."
            : userConsumedInfiniteQuery.hasNextPage
              ? "Load More"
              : "Nothing more to load"}
        </ThemedText>
      </Pressable>
      <View
        style={{
          paddingBottom: 64,
        }}
      />
    </SafeScrollViewContainer>
  );
}

function PodcastEpisodeRow(props: { id: string }) {
  const {
    isPending,
    isError,
    data: episode,
  } = usePodcastEpisodeQuery(props.id);

  if (isPending || isError || episode === undefined) {
    return null;
  }

  return (
    <Link
      key={episode.id}
      href={{
        pathname: "/podcast/episode/[episodeID]",
        params: {
          episodeID: episode.id,
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
            {episode.title}
          </ThemedText>
          <ThemedText type="sm-light" numberOfLines={1}>
            {episode.channel_name}
          </ThemedText>
          <ThemedText type="sm-light">
            {episode.created_at.split("T")[0]}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </Link>
  );
}
