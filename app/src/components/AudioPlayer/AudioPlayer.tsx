import { Slider } from "@react-native-assets/slider";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable } from "react-native";
import TrackPlayer, {
  State as PlayerState,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";

import { AppDebuggingSurface } from "@/components/AppDebuggingSurface";
import { ExperimentalSurface } from "@/components/ExperimentalSurface";
import { MarqueeText } from "@/components/MarqueeText";
import { Icon } from "@/components/provided";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useActiveTrackWithMetadata } from "@/hooks";

import { CircularPauseButton } from "./CircularPauseButton";
import { CircularPlayButton } from "./CircularPlayButton";
import { convertSecondsToMSS } from "./convertSecondsToMSS";
import { RepeatIcon } from "./RepeatIcon";
import { ShareCurrentTrackIcon } from "./ShareCurrentTrackIcon";

export function AudioPlayer() {
  const router = useRouter();
  const activeTrack = useActiveTrackWithMetadata();
  const playerState = usePlaybackState().state;
  const progress = useProgress();

  const audioLength = activeTrack?.duration;
  const positionAsInt = Math.trunc(progress.position);
  const durationAsInt = Math.trunc(progress.duration);
  const bufferedAsInt = Math.trunc(progress.buffered);
  const currentPos = convertSecondsToMSS(positionAsInt);
  const remainingTime = convertSecondsToMSS(durationAsInt - positionAsInt);

  const jump = useCallback(
    function (jumpInterval: number) {
      if (audioLength === undefined) {
        return;
      }

      const newPosition = positionAsInt + jumpInterval;
      if (newPosition < 0) {
        TrackPlayer.seekTo(0);
        return;
      }
      if (newPosition > audioLength) {
        TrackPlayer.seekTo(audioLength);
        return;
      }
      TrackPlayer.seekTo(newPosition);
    },
    [positionAsInt, audioLength]
  );

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
                  `Unimplemented track type: ${activeTrack.trackType}`
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
          paddingBottom: 32,
        }}
      >
        <ThemedView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
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
          <RepeatIcon />
        </ThemedView>
        <ShareCurrentTrackIcon activeTrack={activeTrack} />
      </ThemedView>

      <AudioProgressSlider
        // @todo Can pass in custom default starting position based on last use
        defaultTrackPosition={0}
        // Setting high polling frequency so that the slider animation is smooth
        updateInterval={100}
        duration={durationAsInt}
      />

      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <ThemedText style={{ fontSize: 12 }}>{currentPos}</ThemedText>
        <ThemedText style={{ fontSize: 12 }}>-{remainingTime}</ThemedText>
      </ThemedView>

      <ThemedView
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pressable
          // @todo Make this a configurable setting
          onPress={() =>
            positionAsInt > 3
              ? TrackPlayer.seekTo(0)
              : TrackPlayer.skipToPrevious()
          }
        >
          <Icon name="backward.end.fill" color="white" />
        </Pressable>
        <Pressable onPress={() => jump(-10)}>
          <Icon name="gobackward.10" color="white" size={48} />
        </Pressable>
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
            onPress={TrackPlayer.play}
            innerIconSize={32}
            outerBackgroundSize={20}
          />
        )}
        <Pressable onPress={() => jump(10)}>
          <Icon name="goforward.10" color="white" size={48} />
        </Pressable>
        <Pressable onPress={() => TrackPlayer.skipToNext()}>
          <Icon name="forward.end.fill" color="white" />
        </Pressable>
      </ThemedView>

      <AppDebuggingSurface>
        <ThemedText>
          Buffered: {bufferedAsInt}s{"\n"}
          Total: {durationAsInt}s
        </ThemedText>
      </AppDebuggingSurface>
    </ThemedView>
  );
}

function AudioProgressSlider(props: {
  defaultTrackPosition: number;
  updateInterval: number;
  duration: number;
}) {
  const [position, setPosition] = useState(props.defaultTrackPosition);

  useEffect(() => {
    const intervalID = setInterval(() => {
      TrackPlayer.getProgress()
        .then(({ position }) => setPosition(position))
        // This only throw if you haven't yet setup RNTP, ignore failure
        .catch(() => {});
    }, props.updateInterval);

    return () => clearInterval(intervalID);
  }, [props.updateInterval, setPosition]);

  async function onSlidingComplete(newPosition: number) {
    setPosition(newPosition);

    await TrackPlayer.seekTo(newPosition);
    await TrackPlayer.play();
  }

  return (
    <Slider
      minimumValue={0}
      maximumValue={props.duration}
      //
      value={position}
      //
      // Stop updating position when user start touching it
      // Position will be auto updated again after user stop touching it
      onTouchStart={() => {
        TrackPlayer.pause();
      }}
      // onTouchEnd={() => TrackPlayer.play()}
      // onTouchCancel={() => TrackPlayer.play()}
      //
      // This is the same as "onValueChange", just that it is not called
      // continously and only called once user lifts their finger
      onSlidingComplete={onSlidingComplete}
      thumbTintColor="white"
      minimumTrackTintColor="#FFFFFF" // Sets left track color
      // maximumTrackTintColor="#000000" // Optional: Sets right track color
      // @todo This should be dynamic based on theme
    />
  );
}
