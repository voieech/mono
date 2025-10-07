import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable } from "react-native";
import {
  State as PlayerState,
  usePlaybackState,
} from "react-native-track-player";

import { AppDebuggingSurface } from "@/components/AppDebuggingSurface";
import { ExperimentalSurface } from "@/components/ExperimentalSurface";
import { MarqueeText } from "@/components/MarqueeText";
import { Icon } from "@/components/provided";
import { ThemedView } from "@/components/ThemedView";
import { useActiveTrackWithMetadata } from "@/hooks";
import { TrackPlayer } from "@/utils";

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
import { ShareCurrentTrackIcon } from "./ShareCurrentTrackIcon";

export function AudioPlayer() {
  const router = useRouter();
  const activeTrack = useActiveTrackWithMetadata();
  const playerState = usePlaybackState().state;
  const [like, setLike] = useState<null | boolean>(null);

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
              color: "#a1a1aa",
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
              <Icon name="shuffle" color="white" size={32} />
            </Pressable>
          </ExperimentalSurface>
          <ExperimentalSurface>
            <Pressable
              onPress={() => {
                setLike(true);
              }}
            >
              <Icon
                name={"hand.thumbsup.fill"}
                color={like ? "green" : "white"}
                size={32}
              />
            </Pressable>
            <Pressable
              onPress={() => {
                setLike(false);
              }}
            >
              <Icon
                name={"hand.thumbsdown.fill"}
                color={like === false ? "#fa4d4d" : "white"}
                size={32}
              />
            </Pressable>
          </ExperimentalSurface>
          <RepeatIcon />
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
              color="white"
              style={{
                marginBottom: 2,
              }}
            />
          </Pressable>
          <ShareCurrentTrackIcon activeTrack={activeTrack} />
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
            onPress={TrackPlayer.pause}
            innerIconSize={32}
            outerBackgroundSize={20}
          />
        ) : (
          <CircularPlayButton
            onPress={TrackPlayer.playWithGlobalRate}
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
