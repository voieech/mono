import { Trans } from "@lingui/react/macro";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { View, ScrollView, useWindowDimensions } from "react-native";

import {
  useUserSubscriptionsOfItemTypeQuery,
  usePodcastChannelQuery,
  usePodcastChannelEpisodesQuery,
} from "@/api";
import { ThemedText } from "@/components";

export function UserSubscriptions() {
  const windowDimensions = useWindowDimensions();
  const featuredChannelImageWidth = windowDimensions.width * 0.25;
  const featuredChannelImageMargin = Math.min(
    windowDimensions.width * 0.03,
    16,
  );

  const userSubscriptionsOfItemTypeQuery = useUserSubscriptionsOfItemTypeQuery({
    itemType: "podcast_channel",
  });

  if (
    userSubscriptionsOfItemTypeQuery.data === undefined ||
    userSubscriptionsOfItemTypeQuery.data.itemIDs.length === 0
  ) {
    return null;
  }

  return (
    <>
      <ThemedText type="lg-light">
        <Trans>Your Subscriptions</Trans>
      </ThemedText>
      {/* <Link
        href={{
          pathname: "/subscription",
        }}
      >
        <ThemedView
          style={{
            flexDirection: "row",
            columnGap: 16,
          }}
        >
          <ThemedText type="lg-light">
            <Trans>Your Subscriptions</Trans>
          </ThemedText>
          <Icon name="chevron.right" color={Colors.neutral50} />
        </ThemedView>
      </Link> */}
      <View
        style={{
          paddingTop: 4,
          paddingBottom: 16,
          flexDirection: "column",
          rowGap: 8,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            rowGap: 4,
          }}
        >
          <ThemedText>
            <Trans>Podcast Channels</Trans>
          </ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {userSubscriptionsOfItemTypeQuery.data.itemIDs.map((channelID) => (
              <View
                key={channelID}
                style={{
                  marginRight: featuredChannelImageMargin,
                  width: featuredChannelImageWidth,
                }}
              >
                <PodcastChannelImage channelID={channelID} />
              </View>
            ))}
          </ScrollView>
        </View>
        <View
          style={{
            flexDirection: "column",
            rowGap: 4,
          }}
        >
          <ThemedText>
            <Trans>Podcast Episodes</Trans>
          </ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {userSubscriptionsOfItemTypeQuery.data.itemIDs.map((channelID) => (
              <PodcastEpisodeImage
                key={channelID}
                channelID={channelID}
                channelImageMargin={featuredChannelImageMargin}
                channelImageWidth={featuredChannelImageWidth}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </>
  );
}

function PodcastChannelImage(props: { channelID: string }) {
  const podcastChannelQuery = usePodcastChannelQuery(props.channelID);

  if (podcastChannelQuery.isError || podcastChannelQuery.data === undefined) {
    return null;
  }

  return (
    <Link
      href={{
        pathname: "/podcast/channel/[channelID]",
        params: {
          channelID: podcastChannelQuery.data.id,
        },
      }}
    >
      <View>
        <Image
          source={podcastChannelQuery.data.img_url}
          style={{
            width: "100%",
            aspectRatio: 1,
            borderRadius: 4,
          }}
          contentFit="cover"
        />
      </View>
    </Link>
  );
}

function PodcastEpisodeImage(props: {
  channelID: string;
  channelImageMargin: number;
  channelImageWidth: number;
}) {
  const podcastChannelEpisodesQuery = usePodcastChannelEpisodesQuery(
    props.channelID,
    {
      limit: 3,
    },
  );

  if (
    podcastChannelEpisodesQuery.isError ||
    podcastChannelEpisodesQuery.data === undefined ||
    podcastChannelEpisodesQuery.data.length === 0
  ) {
    return null;
  }

  return podcastChannelEpisodesQuery.data.map((podcastEpisode) => (
    <View
      key={podcastEpisode.id}
      style={{
        marginRight: props.channelImageMargin,
        width: props.channelImageWidth,
      }}
    >
      <Link
        href={{
          pathname: "/podcast/episode/[episodeID]",
          params: {
            episodeID: podcastEpisode.id,
          },
        }}
      >
        <View>
          <Image
            source={podcastEpisode.img_url}
            style={{
              width: "100%",
              aspectRatio: 1,
              borderRadius: 4,
            }}
            contentFit="cover"
          />
        </View>
      </Link>
    </View>
  ));
}
