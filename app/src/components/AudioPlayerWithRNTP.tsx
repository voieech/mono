import { useCallback, useEffect, useState } from "react";
import { View, Pressable } from "react-native";
import { Image, ImageSource } from "expo-image";
import TrackPlayer, {
  State as PlayerState,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";
import { Slider } from "@react-native-assets/slider";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useTheme } from "@/hooks/useTheme";

function convertSecondsToMSS(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = String(seconds).padStart(2, "0");
  return `${minutes}:${paddedSeconds}`;
}

export function AudioPlayerWithRNTP(props: {
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
    <ThemedView>
      <ThemedText>{props.title}</ThemedText>

      <AudioProgressSlider duration={durationAsInt} />

      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <ThemedText>{currentPos}</ThemedText>
        <ThemedText>-{remainingTime}</ThemedText>
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

      {/* @todo Move this out and hide it behind feature flag / env var for devs only */}
      <ThemedText>
        Buffered progress: {bufferedAsInt} seconds buffered out of{" "}
        {durationAsInt} total
      </ThemedText>
    </ThemedView>
  );
}

// Can pass in default position, based on last listen
// Setting high polling frequency so that the slider animation is smoother
const updateInterval = 100;

function AudioProgressSlider(props: { duration: number }) {
  const [touching, setTouching] = useState(false);
  const [position, setPosition] = useState(0);
  const [positionUpdateIntervalID, setPositionUpdateIntervalID] = useState<
    null | number
  >(null);

  const startUpdating = useCallback(() => {
    if (positionUpdateIntervalID !== null) {
      return;
    }

    const intervalID = setInterval(() => {
      TrackPlayer.getProgress()
        .then(({ position }) => setPosition(position))
        // This only throw if you haven't yet setup RNTP, ignore failure
        .catch(() => {});
    }, updateInterval);

    setPositionUpdateIntervalID(intervalID);
  }, [positionUpdateIntervalID, setPositionUpdateIntervalID, setPosition]);

  const onSlidingComplete = useCallback(
    async (value: number) => {
      // Update the UI first, so that when user lifts their finger up, there
      // wont be a reset to the old position that hasnt been updated yet
      setPosition(value);

      await TrackPlayer.seekTo(value);

      // Only after track player has seeked to that position then do we resume
      // updating, and using setTimeout for a next tick effect
      setTimeout(startUpdating, 10);
    },
    [setPosition, startUpdating]
  );

  const cleanUpTimer = useCallback(() => {
    console.log("running clean up!");
    if (positionUpdateIntervalID !== null) {
      clearInterval(positionUpdateIntervalID);
      setPositionUpdateIntervalID(null);
      console.log("timers is now clean!");
    }
  }, [positionUpdateIntervalID, setPositionUpdateIntervalID]);

  const isPlaying = usePlaybackState().state === PlayerState.Playing;

  useEffect(() => {
    console.log("main effect to start updating is called");

    if (isPlaying && !touching) {
      startUpdating();
    } else {
      cleanUpTimer();
    }

    return cleanUpTimer;
  }, [
    isPlaying,
    touching,
    startUpdating,
    positionUpdateIntervalID,
    setPositionUpdateIntervalID,
    cleanUpTimer,
  ]);

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
        console.log("touch STARTED");
        setTouching(true);
        cleanUpTimer();
      }}
      onTouchEnd={() => setTouching(false)}
      onTouchCancel={() => setTouching(false)}
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

function JumpButton(props: { onPress: () => void; imageSource: ImageSource }) {
  return (
    <View
      style={{
        width: 40,
        height: 40,
      }}
    >
      <Pressable onPress={props.onPress}>
        <Image
          source={props.imageSource}
          style={{
            width: "100%",
            height: "100%",
          }}
          contentFit="contain"
        />
      </Pressable>
    </View>
  );
}
