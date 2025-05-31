import { useEffect } from "react";
import { Pressable } from "react-native";
import { Image } from "expo-image";
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";
import Slider from "@react-native-community/slider";
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

  return (
    <ThemedView>
      <ThemedText>{props.title}</ThemedText>

      <Slider
        value={positionAsInt}
        minimumValue={0}
        maximumValue={durationAsInt}
        // @todo Might not use this, or maybe make this smaller to make the
        // transition animation smooth
        step={1}
        // This is the same as "onValueChange", just that it is not called
        // continously and only called once user lifts their finger
        onSlidingComplete={(value) => TrackPlayer.seekTo(value)}
        // IOS only: Permits tapping on the slider track to set the position.
        tapToSeek

        // @todo Use a smaller image
        // thumbImage={require("../assets/images/small-thumb.png")}

        // This should be dynamic based on theme
        // minimumTrackTintColor="#FFFFFF" // Sets left track color
        // maximumTrackTintColor="#000000" // Optional: Sets right track color
      />

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
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ThemedView
          style={{
            width: 70,
            height: 70,
          }}
        >
          {playerState === State.Loading ? (
            <ThemedText>loading</ThemedText>
          ) : playerState === State.Playing ? (
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
      </ThemedView>

      {/* @todo Move this out and hide it behind feature flag / env var for devs only */}
      <ThemedText>
        Buffered progress: {bufferedAsInt} seconds buffered out of{" "}
        {durationAsInt} total
      </ThemedText>
    </ThemedView>
  );
}
