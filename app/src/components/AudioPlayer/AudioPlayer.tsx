import { Slider } from "@react-native-assets/slider";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import TrackPlayer, {
  State as PlayerState,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";

import { IconSymbol } from "@/components/provided";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants";

import { convertSecondsToMSS } from "./convertSecondsToMSS";
import { JumpButton } from "./JumpButton";

export function AudioPlayer() {
  const activeTrack = useActiveTrack();
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
        <ThemedText type="subtitle" numberOfLines={1}>
          {activeTrack.title}
        </ThemedText>
        <ThemedText
          style={{
            color: "#a1a1aa",
          }}
          numberOfLines={1}
        >
          {activeTrack.artist}
        </ThemedText>
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
          justifyContent: "space-around",
          paddingHorizontal: 30,
        }}
      >
        <JumpButton
          onPress={() => jump(-10)}
          imageSource={require("@/assets/images/player/light/jumpBackward.png")}
        />

        {/*
          Even if player is not paused, i.e. it is loading or whatever show the
          play symbol to prevent fast flashing when changing from loading (or
          any other) state to paused state.
        */}
        {playerState === PlayerState.Playing ? (
          <Pressable onPress={TrackPlayer.pause}>
            <View
              style={{
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  padding: 20,
                  backgroundColor: Colors.dark.text,
                  borderRadius: "50%",
                }}
              >
                <IconSymbol name="pause.fill" color="black" size={32} />
              </View>
            </View>
          </Pressable>
        ) : (
          <Pressable onPress={TrackPlayer.play}>
            <View
              style={{
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  padding: 20,
                  backgroundColor: Colors.dark.text,
                  borderRadius: "50%",
                }}
              >
                <IconSymbol name="play.fill" color="black" size={32} />
              </View>
            </View>
          </Pressable>
        )}

        <JumpButton
          onPress={() => jump(10)}
          imageSource={require("@/assets/images/player/light/jumpForward.png")}
        />
      </ThemedView>
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
