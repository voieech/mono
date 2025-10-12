import { Pressable } from "react-native";
import TrackPlayer from "react-native-track-player";

import { Icon } from "@/components/provided";
import { useTrackPlayer } from "@/context";

export function AudioPlayerSkipPreviousButton() {
  const trackPlayer = useTrackPlayer();
  return (
    <Pressable onPress={trackPlayer.goToPreviousOrStartOfTrack}>
      <Icon name="backward.end.fill" color="white" />
    </Pressable>
  );
}

export function AudioPlayerSkipNextButton() {
  return (
    <Pressable onPress={() => TrackPlayer.skipToNext()}>
      <Icon name="forward.end.fill" color="white" />
    </Pressable>
  );
}
