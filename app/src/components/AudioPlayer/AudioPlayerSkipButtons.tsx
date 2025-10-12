import { Pressable } from "react-native";

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
  const trackPlayer = useTrackPlayer();
  return (
    <Pressable onPress={trackPlayer.goToNextTrack}>
      <Icon name="forward.end.fill" color="white" />
    </Pressable>
  );
}
