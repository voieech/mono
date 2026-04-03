import { Trans } from "@lingui/react/macro";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import { RefreshControl, View } from "react-native";

import { useFeaturedChannelsQuery } from "@/api";
import { SafeScrollViewContainer, ThemedView, ThemedText } from "@/components";
import { Colors } from "@/constants";
import { categoryStringToMsgDescriptor } from "@/locales";

export default function FeaturedPodcastChannels() {
  const featuredPodcastChannelsQuery = useFeaturedChannelsQuery();

  const [refreshing, setRefreshing] = useState(false);
  async function onRefresh() {
    setRefreshing(true);
    await Promise.all([featuredPodcastChannelsQuery.refetch()]);
    setRefreshing(false);
  }

  return (
    <SafeScrollViewContainer
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {featuredPodcastChannelsQuery.data !== undefined && (
        <ThemedView
          style={{
            gap: 8,
            marginBottom: 8,
          }}
        >
          <ThemedText type="lg-light">
            <Trans>Featured Channels</Trans>
          </ThemedText>
          {featuredPodcastChannelsQuery.data.map((podcastChannel) => (
            <Link
              key={podcastChannel.id}
              href={{
                pathname: "/podcast/channel/[channelID]",
                params: {
                  channelID: podcastChannel.id,
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
                  source={podcastChannel.img_url}
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
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    backgroundColor: Colors.neutral800,
                  }}
                >
                  <ThemedText
                    type="lg-normal"
                    numberOfLines={1}
                    style={{
                      paddingBottom: 8,
                    }}
                  >
                    {podcastChannel.name}
                  </ThemedText>
                  <ThemedText
                    type="sm-light"
                    numberOfLines={4}
                    style={{
                      paddingBottom: 8,
                    }}
                  >
                    {podcastChannel.description}
                  </ThemedText>
                  {podcastChannel.category_primary !== null && (
                    <ThemedText type="sm-light">
                      {categoryStringToMsgDescriptor(
                        podcastChannel.category_primary,
                      )}
                      {podcastChannel.subcategory_primary !== null &&
                        `, ${categoryStringToMsgDescriptor(podcastChannel.subcategory_primary)}`}
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
          paddingBottom: 64,
        }}
      />
    </SafeScrollViewContainer>
  );
}
