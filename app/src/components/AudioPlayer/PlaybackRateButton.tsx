import { Pressable } from "react-native";

import { ThemedText } from "@/components/ThemedComponents";
import { useTrackPlayer } from "@/context";

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
