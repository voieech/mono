import { Trans } from "@lingui/react/macro";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { View, ScrollView, useWindowDimensions } from "react-native";

import {
  useUserSubscriptionsOfItemTypeQuery,
  usePodcastChannelQuery,
} from "@/api";
import { ThemedView, ThemedText, VerticalSpacer } from "@/components";

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

  return (
    <>
      {userSubscriptionsOfItemTypeQuery.data !== undefined &&
        userSubscriptionsOfItemTypeQuery.data.itemIDs.length !== 0 && (
          <ThemedView
            style={{
              gap: 8,
              marginBottom: 8,
            }}
          >
            {/* <Link
              href={{
                pathname: "/subscribed-channels",
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
            <ThemedText type="lg-light">
              <Trans>Your Subscriptions</Trans>
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {userSubscriptionsOfItemTypeQuery.data.itemIDs.map(
                (channelID) => (
                  <View
                    key={channelID}
                    style={{
                      marginRight: featuredChannelImageMargin,
                      width: featuredChannelImageWidth,
                    }}
                  >
                    <PodcastChannelImage channelID={channelID} />
                  </View>
                ),
              )}
            </ScrollView>
          </ThemedView>
        )}
      <VerticalSpacer />
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
