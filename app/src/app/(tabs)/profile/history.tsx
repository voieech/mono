import { Trans } from "@lingui/react/macro";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import {
  RefreshControl,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";

import { useUserConsumedInfiniteQuery, usePodcastEpisodeQuery } from "@/api";
import {
  SafeAreaViewContainer,
  ThemedView,
  ThemedText,
  VerticalSpacer,
} from "@/components";
import { Colors } from "@/constants";
import { useBottomTabOverflow } from "@/hooks";

export default function History() {
  const bottomOverflow = useBottomTabOverflow();

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

  // Flatten the pages into a single array for FlatList
  const flattenedData = userConsumedInfiniteQuery.data.pages.flatMap(
    (page) => page,
  );

  if (flattenedData.length === 0) {
    return (
      <ThemedView
        style={{
          flex: 1,
          paddingHorizontal: 16,
          flexDirection: "column",
          rowGap: 16,
          justifyContent: "center",
        }}
      >
        <ThemedText type="lg-light">
          <Trans>No history yet</Trans>
        </ThemedText>
        <Pressable
          onPress={onRefresh}
          style={{
            padding: 16,
            alignItems: "center",
            backgroundColor: Colors.neutral700,
            borderRadius: 8,
          }}
        >
          <ThemedText type="lg-light">
            <Trans>Reload</Trans>
          </ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <SafeAreaViewContainer>
      <FlatList
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
          marginBottom: bottomOverflow,
        }}
        data={flattenedData}
        keyExtractor={(item) => item.itemID}
        renderItem={({ item }) =>
          item.itemType === "podcast_episode" ? (
            <PodcastEpisodeRow key={item.itemID} id={item.itemID} />
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        // How close to the bottom before triggering the `onEndReached` method,
        // where 0.1 = 10% of the list's visible length remains
        onEndReachedThreshold={0.1}
        // Triggered when user reaches the threshold
        onEndReached={() => {
          if (
            userConsumedInfiniteQuery.hasNextPage &&
            !userConsumedInfiniteQuery.isFetchingNextPage
          ) {
            userConsumedInfiniteQuery.fetchNextPage();
          }
        }}
        ItemSeparatorComponent={() => <VerticalSpacer height={4} />}
        ListFooterComponent={
          userConsumedInfiniteQuery.isFetchingNextPage ? (
            <ActivityIndicator size="small" />
          ) : null
        }
      />
    </SafeAreaViewContainer>
  );
}

function PodcastEpisodeRow(props: { id: string }) {
  const {
    isPending,
    isError,
    data: podcastEpisode,
  } = usePodcastEpisodeQuery(props.id);

  if (isPending || isError || podcastEpisode === undefined) {
    return null;
  }

  return (
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
          borderRadius: 8,
        }}
      >
        <Image
          source={podcastEpisode.img_url}
          style={{
            width: "100%",
            height: "100%",
            maxWidth: 128,
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
          }}
          contentFit="cover"
        />
        <ThemedView
          style={{
            flex: 1,
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
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
  );
}
