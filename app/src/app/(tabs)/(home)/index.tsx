import { Trans } from "@lingui/react/macro";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import {
  RefreshControl,
  View,
  ScrollView,
  useWindowDimensions,
} from "react-native";

import {
  SafeScrollViewContainer,
  ThemedView,
  ThemedText,
  Icon,
} from "@/components";
import { Colors } from "@/constants";
import { useFeaturedChannels, useFeaturedEpisodes } from "@/hooks";

export default function HomeScreen() {
  const windowDimensions = useWindowDimensions();
  const featuredChannelImageWidth = windowDimensions.width * 0.4;
  const featuredChannelImageMargin = Math.min(
    windowDimensions.width * 0.03,
    16,
  );

  const featuredChannelsQuery = useFeaturedChannels();
  const featuredEpisodesQuery = useFeaturedEpisodes();

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
          <Link
            href={{
              pathname: "/featured-channels",
            }}
          >
            <ThemedView
              style={{
                flexDirection: "row",
                columnGap: 16,
              }}
            >
              <ThemedText
                style={{
                  fontSize: 28,
                  lineHeight: 28,
                  fontWeight: "300",
                }}
              >
                <Trans>Featured Channels</Trans>
              </ThemedText>
              <Icon name="chevron.right" color={Colors.dark.text} />
            </ThemedView>
          </Link>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredChannelsQuery.data.map((channel) => (
              <Link
                key={channel.id}
                href={{
                  pathname: "/podcast/channel/[channelID]",
                  params: {
                    channelID: channel.id,
                  },
                }}
                style={{
                  marginRight: featuredChannelImageMargin,
                }}
              >
                <View>
                  <Image
                    source={channel.img_url}
                    style={{
                      width: featuredChannelImageWidth,
                      aspectRatio: 1,
                      borderRadius: 4,
                    }}
                    contentFit="cover"
                  />
                  <ThemedText
                    numberOfLines={1}
                    style={{
                      paddingTop: 4,
                      color: "#CCC",
                      fontSize: 14,
                    }}
                  >
                    {channel.name}
                  </ThemedText>
                </View>
              </Link>
            ))}
          </ScrollView>
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
                    paddingVertical: 4,
                    paddingHorizontal: 16,
                    backgroundColor: "#3f3f46",
                  }}
                >
                  <ThemedText
                    style={{
                      paddingBottom: 8,
                    }}
                    numberOfLines={2}
                  >
                    {episode.title}
                  </ThemedText>
                  <ThemedText numberOfLines={2}>
                    {episode.channel_name}
                  </ThemedText>
                  <ThemedText
                    style={{
                      fontSize: 14,
                      lineHeight: 0,
                    }}
                  >
                    {episode.created_at.split("T")[0]}
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
