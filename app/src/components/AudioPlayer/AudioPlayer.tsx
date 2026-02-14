import type { LikeableItemType } from "dto";

import { msg } from "@lingui/core/macro";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ActivityIndicator, Pressable } from "react-native";
import {
  State as PlayerState,
  usePlaybackState,
} from "react-native-track-player";

import { useUserLikeQuery, useUserLikeMutation } from "@/api";
import { AppDebuggingSurface } from "@/components/AppDebuggingSurface";
import { ExperimentalSurface } from "@/components/ExperimentalSurface";
import { MarqueeText } from "@/components/MarqueeText";
import { Icon } from "@/components/provided";
import { ThemedView } from "@/components/ThemedComponents/index";
import { Colors } from "@/constants";
import { useTrackPlayer, useAuthContext } from "@/context";
import { useActiveTrackWithMetadata } from "@/TrackPlayer";
import { toast } from "@/utils";

import { ShareTrackIcon } from "../ShareTrackIcon";
import { AudioPlayerDebugger } from "./AudioPlayerDebugger";
import {
  AudioPlayerJumpBackwardButton,
  AudioPlayerJumpForwardButton,
} from "./AudioPlayerJumpButton";
import {
  AudioPlayerSkipPreviousButton,
  AudioPlayerSkipNextButton,
} from "./AudioPlayerSkipButtons";
import { AudioPlayerTime } from "./AudioPlayerTime";
import { AudioProgressSlider } from "./AudioProgressSlider";
import { CircularPauseButton } from "./CircularPauseButton";
import { CircularPlayButton } from "./CircularPlayButton";
import { PlaybackRateButton } from "./PlaybackRateButton";
import { RepeatIcon } from "./RepeatIcon";

export function AudioPlayer() {
  const router = useRouter();
  const activeTrack = useActiveTrackWithMetadata();
  const playerState = usePlaybackState().state;
  const trackPlayer = useTrackPlayer();

  if (activeTrack === undefined) {
    return null;
  }

  return (
    <ThemedView
      style={{
        padding: 8,
      }}
    >
      <ThemedView
        style={{
          paddingVertical: 16,
        }}
      >
        <Image
          source={activeTrack.artwork}
          style={{
            width: "100%",
            aspectRatio: 1,
            borderRadius: 8,
          }}
          contentFit="contain"
        />
      </ThemedView>
      <ThemedView
        style={{
          paddingVertical: 16,
        }}
      >
        <MarqueeText
          key={activeTrack.title}
          text={activeTrack.title}
          delayInMsBeforeScrollStart={1500}
        />
        <Pressable
          onPress={() => {
            switch (activeTrack.trackType) {
              case "podcast_episode": {
                router.dismiss();
                return router.push({
                  pathname: "/podcast/channel/[channelID]",
                  params: {
                    channelID: activeTrack.episode.channel_id,
                  },
                });
              }
              default:
                throw new Error(
                  `Unimplemented track type: ${activeTrack.trackType}`,
                );
            }
          }}
        >
          <MarqueeText
            key={activeTrack.artist}
            text={activeTrack.artist}
            delayInMsBeforeScrollStart={1500}
            textStyle={{
              color: Colors.neutral400,
            }}
          />
        </Pressable>
      </ThemedView>

      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 32,
        }}
      >
        <ThemedView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            columnGap: 16,
          }}
        >
          <ExperimentalSurface>
            <Pressable
              onPress={() => {
                //
              }}
            >
              <Icon name="shuffle" color={Colors.white} size={32} />
            </Pressable>
          </ExperimentalSurface>
          <RepeatIcon />
          <LikeButtonMaybeUnauthenticated
            audioTrackType={activeTrack.trackType}
            audioTrackID={activeTrack.id}
          />
        </ThemedView>
        <ThemedView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            columnGap: 16,
          }}
        >
          <PlaybackRateButton />
          <Pressable
            onPress={() => {
              router.push("/track-queue-modal");
            }}
          >
            <Icon
              name="list.dash"
              color={Colors.white}
              style={{
                marginBottom: 2,
              }}
            />
          </Pressable>
          <ShareTrackIcon
            track={activeTrack}
            style={{
              marginBottom: 6,
            }}
          />
        </ThemedView>
      </ThemedView>

      <AudioProgressSlider
        // @todo Can pass in custom default starting position based on last use
        defaultTrackPosition={0}
        activeTrack={activeTrack}
      />

      <AudioPlayerTime />

      <ThemedView
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <AudioPlayerSkipPreviousButton />
        <AudioPlayerJumpBackwardButton />
        {/*
          Even if player is not paused, i.e. it is loading or whatever show the
          play symbol to prevent fast flashing when changing from loading (or
          any other) state to paused state.
        */}
        {playerState === PlayerState.Playing ? (
          <CircularPauseButton
            onPress={trackPlayer.pause}
            innerIconSize={32}
            outerBackgroundSize={20}
          />
        ) : (
          <CircularPlayButton
            onPress={trackPlayer.play}
            innerIconSize={32}
            outerBackgroundSize={20}
          />
        )}
        <AudioPlayerJumpForwardButton />
        <AudioPlayerSkipNextButton />
      </ThemedView>

      <AppDebuggingSurface>
        <AudioPlayerDebugger />
      </AppDebuggingSurface>
    </ThemedView>
  );
}

function LikeButtonMaybeUnauthenticated(props: {
  audioTrackType: LikeableItemType;
  audioTrackID: string;
}) {
  const authContext = useAuthContext();

  if (!authContext.isAuthenticated) {
    return (
      <HeartBaseButton
        isLiked={false}
        onPress={authContext.showFullScreenSigninModalIfNotAuthenticated}
      />
    );
  }

  return <LikeUnlikeButton {...props} />;
}

/**
 * User is authenticated already
 */
function LikeUnlikeButton(props: {
  audioTrackType: LikeableItemType;
  audioTrackID: string;
}) {
  const userLikeQuery = useUserLikeQuery({
    itemType: props.audioTrackType,
    itemID: props.audioTrackID,
  });

  if (userLikeQuery.isLoading) {
    return <ActivityIndicator />;
  }

  // If failed to load status, treat it as the same as not liked
  if (
    userLikeQuery.isError ||
    userLikeQuery.data === undefined ||
    userLikeQuery.data.like === undefined ||
    userLikeQuery.data.like === false
  ) {
    return <ClickToLikeButton {...props} />;
  }

  return <ClickToUnlikeButton {...props} />;
}

const showFailedToUpdateLikeToast = () => toast(msg`Failed to update like`);

function ClickToLikeButton(props: {
  audioTrackType: LikeableItemType;
  audioTrackID: string;
}) {
  const userLikeMutation = useUserLikeMutation();
  return (
    <HeartBaseButton
      isLiked={false}
      onPress={() => {
        userLikeMutation.mutate(
          {
            itemType: "podcast_episode",
            itemID: props.audioTrackID,
            like: true,
          },
          {
            onError: showFailedToUpdateLikeToast,
          },
        );
      }}
      disabled={userLikeMutation.isPending}
    />
  );
}

function ClickToUnlikeButton(props: {
  audioTrackType: LikeableItemType;
  audioTrackID: string;
}) {
  const userLikeMutation = useUserLikeMutation();
  return (
    <HeartBaseButton
      isLiked={true}
      onPress={() => {
        userLikeMutation.mutate(
          {
            itemType: "podcast_episode",
            itemID: props.audioTrackID,
            like: false,
          },
          {
            onError: showFailedToUpdateLikeToast,
          },
        );
      }}
      disabled={userLikeMutation.isPending}
    />
  );
}

export function HeartBaseButton(props: {
  isLiked: boolean;
  onPress?: () => unknown;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        props.onPress?.();
      }}
      disabled={props.disabled}
    >
      <Icon
        name={props.isLiked ? "heart.fill" : "heart"}
        color={props.isLiked ? Colors.red600 : Colors.neutral200}
        size={32}
      />
    </Pressable>
  );
}
