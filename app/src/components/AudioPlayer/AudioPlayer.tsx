import { Slider } from "@react-native-assets/slider";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import TrackPlayer, {
  State as PlayerState,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useTheme } from "@/hooks";

import { convertSecondsToMSS } from "./convertSecondsToMSS";
import { JumpButton } from "./JumpButton";

export function AudioPlayer(props: {
  url: string;
  title: string;
  audioLength: number;
  artist?: string;
}) {
  useEffect(() => {
    async function clearTracksAndAddNewTrack() {
      await TrackPlayer.reset();
      TrackPlayer.add([
        {
          artist: props.artist ?? "voieech",
          url: props.url,
          title: props.title,
          duration: props.audioLength,
          artwork: require("@/assets/images/logo.png"),
        },
      ]);
    }
    clearTracksAndAddNewTrack();

    return () => {
      TrackPlayer.reset();
    };
  }, [props.artist, props.url, props.title, props.audioLength]);

  const theme = useTheme();

  const playerState = usePlaybackState().state;
  const progress = useProgress();

  const positionAsInt = Math.trunc(progress.position);
  const durationAsInt = Math.trunc(progress.duration);
  const bufferedAsInt = Math.trunc(progress.buffered);

  const currentPos = convertSecondsToMSS(positionAsInt);
  const remainingTime = convertSecondsToMSS(durationAsInt - positionAsInt);

  function jump(jumpInterval: number) {
    const newPosition = positionAsInt + jumpInterval;

    if (newPosition < 0) {
      TrackPlayer.seekTo(0);
      return;
    }

    if (newPosition > props.audioLength) {
      TrackPlayer.seekTo(props.audioLength);
      return;
    }

    TrackPlayer.seekTo(newPosition);
  }

  return (
    <ThemedView
      style={{
        marginVertical: 16,
        padding: 16,
        borderWidth: 1,
        borderRadius: 16,
        borderColor: "#e6e2e1",
      }}
    >
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

        <ThemedView
          style={{
            width: 70,
            height: 70,
          }}
        >
          {playerState === PlayerState.Loading ? (
            // @todo Use a loading state gif
            <Image
              source={
                // @todo Use different theme variants
                theme === "light"
                  ? require("@/assets/images/player/light/loading.png")
                  : require("@/assets/images/player/light/loading.png")
              }
              style={{
                width: "100%",
                height: "100%",
              }}
              contentFit="contain"
            />
          ) : playerState === PlayerState.Playing ? (
            <Pressable onPress={() => TrackPlayer.pause()}>
              <Image
                source={
                  theme === "light"
                    ? require("@/assets/images/player/light/pause.png")
                    : require("@/assets/images/player/dark/pause.png")
                }
                style={{
                  width: "100%",
                  height: "100%",
                }}
                contentFit="contain"
              />
            </Pressable>
          ) : (
            <Pressable onPress={() => TrackPlayer.play()}>
              <Image
                source={
                  theme === "light"
                    ? require("@/assets/images/player/light/play.png")
                    : require("@/assets/images/player/dark/play.png")
                }
                style={{
                  width: "100%",
                  height: "100%",
                }}
                contentFit="contain"
              />
            </Pressable>
          )}
        </ThemedView>

        <JumpButton
          onPress={() => jump(10)}
          imageSource={require("@/assets/images/player/light/jumpForward.png")}
        />
      </ThemedView>

      {__DEV__ && (
        <ThemedText>
          Buffered: {bufferedAsInt}s{"\n"}
          Total: {durationAsInt}s
        </ThemedText>
      )}
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
