import { useEffect } from "react";
import { Button } from "react-native";
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";
import Slider from "@react-native-community/slider";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

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

      {playerState === State.Loading ? (
        <Button title="Loading" disabled />
      ) : playerState === State.Playing ? (
        <Button title="Stop" onPress={() => TrackPlayer.pause()} />
      ) : (
        <Button title="Play" onPress={() => TrackPlayer.play()} />
      )}

      {/* @todo Move this out and hide it behind feature flag / env var for devs only */}
      <ThemedText>
        Buffered progress: {bufferedAsInt} seconds buffered out of{" "}
        {durationAsInt} total
      </ThemedText>
    </ThemedView>
  );
}
