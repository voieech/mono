import type { ReactNode } from "react";

import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useLocalSearchParams, Link, Redirect } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";

import type { ColorValues } from "@/constants";

import {
  usePodcastChannelQuery,
  usePodcastChannelEpisodesQuery,
  useUserSubscriptionQuery,
  useUserSubscriptionMutation,
} from "@/api";
import {
  ParallaxScrollViewContainer,
  SafeScrollViewContainer,
  FullScreenLoader,
  ThemedView,
  ThemedText,
  ShareChannelIcon,
  Icon,
  VerticalSpacer,
} from "@/components";
import { Colors } from "@/constants";
import { useAuthContext } from "@/context";
import { NotFoundError } from "@/errors";
import { categoryStringToMsgDescriptor } from "@/locales";
import { toast } from "@/utils";

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
      <ThemedText type="xl-normal">{podcastChannelQuery.data.name}</ThemedText>
      {podcastChannelQuery.data.category_primary !== null && (
        <ThemedText type="sm-light">
          {categoryStringToMsgDescriptor(
            podcastChannelQuery.data.category_primary,
          )}
          {podcastChannelQuery.data.subcategory_primary !== null &&
            `, ${categoryStringToMsgDescriptor(podcastChannelQuery.data.subcategory_primary)}`}
        </ThemedText>
      )}
      <VerticalSpacer />
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          columnGap: 16,
        }}
      >
        <PodcastChannelSubscriptionButtonMaybeUnauthenticated
          channelID={channelID}
        />
        <ShareChannelIcon channel={podcastChannelQuery.data} size={32} />
      </ThemedView>
      <VerticalSpacer />
      <ThemedText type="base-light">
        {podcastChannelQuery.data.description}
      </ThemedText>
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

function PodcastChannelSubscriptionButtonMaybeUnauthenticated(props: {
  channelID: string;
}) {
  const authContext = useAuthContext();

  if (!authContext.isAuthenticated) {
    return (
      <PodcastChannelSubscribeBaseButton
        onPress={authContext.showFullScreenSigninModalIfNotAuthenticated}
        isUpdating={false}
      />
    );
  }

  return <PodcastChannelSubscriptionButton channelID={props.channelID} />;
}

/**
 * User is authenticated already
 */
function PodcastChannelSubscriptionButton(props: { channelID: string }) {
  const podcastChannelUserSubscriptionStatusQuery = useUserSubscriptionQuery({
    itemType: "podcast_channel",
    itemID: props.channelID,
  });

  if (podcastChannelUserSubscriptionStatusQuery.isLoading) {
    return (
      <PodcastChannelSubscriptionBaseButton
        backgroundColor={Colors.black}
        text={
          <ThemedText type="base-light" colorType="subtext">
            <Trans>Loading</Trans>
          </ThemedText>
        }
        icon={<ActivityIndicator />}
      />
    );
  }

  // Actually if failed to load status, should treat it as the same as not subscribed
  // Do nothing if loading or failed to load status
  if (
    podcastChannelUserSubscriptionStatusQuery.isError ||
    podcastChannelUserSubscriptionStatusQuery.data === undefined
  ) {
    return null;
  }

  return podcastChannelUserSubscriptionStatusQuery.data.subscribe ? (
    <PodcastChannelUnsubscribeButton channelID={props.channelID} />
  ) : (
    <PodcastChannelSubscribeButton channelID={props.channelID} />
  );
}

function PodcastChannelSubscribeBaseButton(props: {
  onPress: () => unknown;
  isUpdating: boolean;
}) {
  return (
    <PodcastChannelSubscriptionBaseButton
      onPress={props.onPress}
      disabled={props.isUpdating}
      backgroundColor={Colors.neutral100}
      text={
        <ThemedText
          type="base-semibold"
          customColors={{
            dark: Colors.green600,
          }}
        >
          <Trans>Subscribe</Trans>
        </ThemedText>
      }
      icon={
        props.isUpdating ? (
          <ActivityIndicator color={Colors.green600} />
        ) : (
          <Icon name="bell" size={20} color={Colors.green600} />
        )
      }
    />
  );
}

const showFailedToUpdateSubscriptionToast = () =>
  toast(msg`Failed to update subscription`);

function PodcastChannelSubscribeButton(props: { channelID: string }) {
  const podcastChannelUserSubscriptionStatusUpdateMutation =
    useUserSubscriptionMutation();
  return (
    <PodcastChannelSubscribeBaseButton
      onPress={() => {
        podcastChannelUserSubscriptionStatusUpdateMutation.mutate(
          {
            itemType: "podcast_channel",
            itemID: props.channelID,
            subscribe: true,
          },
          {
            onError: showFailedToUpdateSubscriptionToast,
          },
        );
      }}
      isUpdating={podcastChannelUserSubscriptionStatusUpdateMutation.isPending}
    />
  );
}

function PodcastChannelUnsubscribeButton(props: { channelID: string }) {
  const podcastChannelUserSubscriptionStatusUpdateMutation =
    useUserSubscriptionMutation();
  return (
    <PodcastChannelSubscriptionBaseButton
      onPress={() => {
        podcastChannelUserSubscriptionStatusUpdateMutation.mutate(
          {
            itemType: "podcast_channel",
            itemID: props.channelID,
            subscribe: false,
          },
          {
            onError: showFailedToUpdateSubscriptionToast,
          },
        );
      }}
      disabled={podcastChannelUserSubscriptionStatusUpdateMutation.isPending}
      backgroundColor={Colors.black}
      text={
        <ThemedText
          type="base-semibold"
          customColors={{
            dark: Colors.red600,
          }}
        >
          <Trans>Unsubscribe</Trans>
        </ThemedText>
      }
      icon={
        podcastChannelUserSubscriptionStatusUpdateMutation.isPending ? (
          <ActivityIndicator color={Colors.red600} />
        ) : (
          <Icon name="bell.slash" size={20} color={Colors.red600} />
        )
      }
    />
  );
}

export function PodcastChannelSubscriptionBaseButton(props: {
  onPress?: () => unknown;
  disabled?: boolean;
  backgroundColor: ColorValues;
  text: ReactNode;
  icon: ReactNode;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        props.onPress?.();
      }}
      disabled={props.disabled}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 16,
        columnGap: 8,
        backgroundColor: props.backgroundColor,
      }}
    >
      {props.text}
      {props.icon}
    </TouchableOpacity>
  );
}
