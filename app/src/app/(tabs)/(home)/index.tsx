import type { UseQueryResult } from "@tanstack/react-query";
import type { PodcastChannel, PodcastEpisode } from "dto";

import { msg } from "@lingui/core/macro";
import { Trans, useLingui } from "@lingui/react/macro";
import { useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState, useRef } from "react";
import {
  RefreshControl,
  View,
  ScrollView,
  useWindowDimensions,
  Pressable,
  TextInput,
} from "react-native";

import { useFeaturedChannelsQuery, useFeaturedEpisodesQuery } from "@/api";
import { queryKeyBuilder } from "@/api-client";
import {
  FrontPageLayoutTopBarWithProfilePic,
  SafeAreaViewContainer,
  ScrollViewContainer,
  ThemedView,
  ThemedText,
  Icon,
  VerticalSpacer,
  AuthenticatedUsersOnly,
} from "@/components";
import { UserSubscriptions } from "@/components-page/(tabs)/(home)/index/UserSubscriptions";
import { Colors } from "@/constants";
import { linguiMsgToString } from "@/utils";

const allHomeRowTabs = [
  {
    key: "all",
    title: msg`All`,
  },
  {
    key: "podcasts",
    title: msg`Podcasts`,
  },
  {
    key: "news-articles",
    title: msg`News Articles`,
  },
] as const;

export default function HomeScreen() {
  const [selectedTab, setSelectedTab] =
    useState<(typeof allHomeRowTabs)[number]["key"]>("all");

  const [searchInput, setSearchInput] = useState("");

  return (
    <SafeAreaViewContainer>
      <FrontPageLayoutTopBarWithProfilePic>
        <View
          style={{
            flexDirection: "row",
            columnGap: 6,
          }}
        >
          {allHomeRowTabs.map((tab) => (
            <Pressable key={tab.key} onPress={() => setSelectedTab(tab.key)}>
              <View
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 32,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor:
                    tab.key === selectedTab
                      ? Colors.green500
                      : Colors.neutral700,
                }}
              >
                <ThemedText
                  type="sm-normal"
                  customColors={{
                    dark: tab.key === selectedTab ? Colors.black : Colors.white,
                  }}
                >
                  {linguiMsgToString(tab.title)}
                </ThemedText>
              </View>
            </Pressable>
          ))}
        </View>
      </FrontPageLayoutTopBarWithProfilePic>
      <SearchBar searchInput={searchInput} setSearchInput={setSearchInput} />
      <FeaturedHomeSection />
    </SafeAreaViewContainer>
  );
}

function SearchBar(props: {
  searchInput: string;
  setSearchInput: (searchInput: string) => void;
}) {
  const { t } = useLingui();
  const searchInputBoxRef = useRef<TextInput>(null);
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 8,
      }}
    >
      <Pressable onPress={() => searchInputBoxRef.current?.focus?.()}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 8,
            borderRadius: 4,
            backgroundColor: Colors.neutral200,
            width: "100%",
            columnGap: 8,
          }}
        >
          <Icon name="magnifyingglass" size={20} color={Colors.neutral700} />
          <TextInput
            ref={searchInputBoxRef}
            value={props.searchInput}
            onChangeText={props.setSearchInput}
            placeholder={t`What are you looking for?`}
            placeholderTextColor={Colors.neutral700}
            onSubmitEditing={() => {
              console.log("Searched!", props.searchInput);
            }}
            style={{
              flex: 1,
              fontSize: 18,
              color: Colors.neutral900,

              // Prevents extra padding on Android
              paddingVertical: 0,
            }}
          />
          {props.searchInput.length !== 0 && (
            <Pressable
              onPress={(e) => {
                e.preventDefault();
                props.setSearchInput("");
                searchInputBoxRef.current?.focus?.();
              }}
            >
              <Icon name="multiply" size={20} color={Colors.neutral700} />
            </Pressable>
          )}
        </View>
      </Pressable>
    </View>
  );
}

function FeaturedHomeSection() {
  const featuredPodcastChannelsQuery = useFeaturedChannelsQuery();
  const featuredPodcastEpisodesQuery = useFeaturedEpisodesQuery();

  const queryClient = useQueryClient();

  const [refreshing, setRefreshing] = useState(false);
  async function onRefresh() {
    setRefreshing(true);
    await Promise.all([
      featuredPodcastChannelsQuery.refetch(),
      featuredPodcastEpisodesQuery.refetch(),
      queryClient.invalidateQueries({
        queryKey: queryKeyBuilder.fullPath(
          "user.subscription.itemType.$itemType",
          {
            itemType: "podcast_channel",
          },
        ),
      }),
    ]);
    setRefreshing(false);
  }

  return (
    <ScrollViewContainer
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <FeaturedPodcastChannels
        featuredPodcastChannelsQuery={featuredPodcastChannelsQuery}
      />
      <VerticalSpacer />
      <AuthenticatedUsersOnly>
        <UserSubscriptions />
      </AuthenticatedUsersOnly>
      <FeaturedPodcastEpisodes
        featuredPodcastEpisodesQuery={featuredPodcastEpisodesQuery}
      />
    </ScrollViewContainer>
  );
}

function FeaturedPodcastChannels(props: {
  featuredPodcastChannelsQuery: UseQueryResult<Array<PodcastChannel>, Error>;
}) {
  const windowDimensions = useWindowDimensions();
  const featuredChannelImageWidth = windowDimensions.width * 0.4;
  const featuredChannelImageMargin = Math.min(
    windowDimensions.width * 0.03,
    16,
  );

  if (props.featuredPodcastChannelsQuery.data === undefined) {
    return null;
  }

  return (
    <ThemedView
      style={{
        gap: 8,
        marginBottom: 8,
      }}
    >
      <Link
        href={{
          pathname: "/featured-podcast-channels",
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            columnGap: 16,
            paddingRight: 16,
          }}
        >
          <ThemedText type="lg-light">
            <Trans>Featured Channels</Trans>
          </ThemedText>
          <Icon name="chevron.right" color={Colors.neutral50} size={20} />
        </View>
      </Link>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {props.featuredPodcastChannelsQuery.data.map((podcastChannel) => (
          <Link
            key={podcastChannel.id}
            href={{
              pathname: "/podcast/channel/[channelID]",
              params: {
                channelID: podcastChannel.id,
              },
            }}
            style={{
              marginRight: featuredChannelImageMargin,
            }}
          >
            <View
              style={{
                width: featuredChannelImageWidth,
              }}
            >
              <Image
                source={podcastChannel.img_url}
                style={{
                  aspectRatio: 1,
                  borderRadius: 4,
                }}
                contentFit="cover"
              />
              <ThemedText
                type="sm-semibold"
                numberOfLines={1}
                style={{
                  paddingTop: 4,
                  color: Colors.neutral200,
                }}
              >
                {podcastChannel.name}
              </ThemedText>
            </View>
          </Link>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

function FeaturedPodcastEpisodes(props: {
  featuredPodcastEpisodesQuery: UseQueryResult<Array<PodcastEpisode>, Error>;
}) {
  if (props.featuredPodcastEpisodesQuery.data === undefined) {
    return null;
  }

  return (
    <ThemedView
      style={{
        gap: 8,
        marginBottom: 8,
      }}
    >
      <Link
        href={{
          pathname: "/featured-podcast-episodes",
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            columnGap: 16,
            paddingRight: 16,
          }}
        >
          <ThemedText type="lg-light">
            <Trans>Featured Episodes</Trans>
          </ThemedText>
          <Icon name="chevron.right" color={Colors.neutral50} size={20} />
        </View>
      </Link>
      {props.featuredPodcastEpisodesQuery.data.map((podcastEpisode) => (
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
      ))}
    </ThemedView>
  );
}
