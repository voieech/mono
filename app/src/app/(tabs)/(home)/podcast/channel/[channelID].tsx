import { Trans } from "@lingui/react/macro";
import { Image } from "expo-image";
import { useLocalSearchParams, Link, Redirect } from "expo-router";
import { useState } from "react";
import { RefreshControl } from "react-native";

import {
  ParallaxScrollViewContainer,
  SafeScrollViewContainer,
  FullScreenLoader,
  ThemedView,
  ThemedText,
  ShareChannelIcon,
} from "@/components";
import { Colors } from "@/constants";
import { NotFoundError } from "@/errors";
import {
  usePodcastChannelQuery,
  usePodcastChannelEpisodesQuery,
} from "@/hooks";

export default function PodcastChannel() {
  const channelID = useLocalSearchParams<{ channelID: string }>().channelID;
  const podcastChannelQuery = usePodcastChannelQuery(channelID);
  const podcastChannelEpisodesQuery = usePodcastChannelEpisodesQuery(channelID);

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
    if (podcastChannelQuery.error instanceof NotFoundError) {
      return <Redirect href="/+not-found" />;
    }

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
      <ThemedText
        type="xl-normal"
        style={{
          marginBottom: 8,
        }}
      >
        {podcastChannelQuery.data.name}
      </ThemedText>
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          columnGap: 8,
        }}
      >
        <ThemedView
          style={{
            flex: 1,
          }}
        >
          <ThemedText type="base-light">
            {podcastChannelQuery.data.description}
          </ThemedText>
          {podcastChannelQuery.data.category_primary !== null && (
            <ThemedText
              type="sm-light"
              style={{
                marginTop: 8,
              }}
            >
              {podcastChannelQuery.data.category_primary}
              {podcastChannelQuery.data.subcategory_primary !== null &&
                `, ${podcastChannelQuery.data.subcategory_primary}`}
            </ThemedText>
          )}
        </ThemedView>
        <ShareChannelIcon channel={podcastChannelQuery.data} size={32} />
      </ThemedView>
      {!podcastChannelEpisodesQuery.isLoading &&
        !podcastChannelEpisodesQuery.isError &&
        podcastChannelEpisodesQuery.data !== undefined && (
          <>
            <ThemedText
              type="lg-light"
              style={{
                paddingTop: 20,
                paddingBottom: 8,
              }}
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
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        backgroundColor: Colors.neutral800,
                        rowGap: 8,
                      }}
                    >
                      <ThemedText
                        numberOfLines={3}
                        style={{
                          paddingBottom: 2,
                        }}
                      >
                        {episode.title}
                      </ThemedText>
                      <ThemedText type="sm-thin">
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
