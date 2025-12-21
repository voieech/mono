import { Pressable } from "react-native";

import { useTrackPlayer } from "@/context";

import { ThemedText } from "../ThemedText";

export function PlaybackRateButton(props: {
  /**
   * Defaults to 24
   */
  fontSize?: number;
}) {
  const trackPlayer = useTrackPlayer();
  return (
    <Pressable onPress={trackPlayer.updatePlaybackRateByCycling}>
      <ThemedText
        style={{
          fontSize: props.fontSize ?? 24,
        }}
      >
        {trackPlayer.playbackRate}x
      </ThemedText>
    </Pressable>
  );
}
