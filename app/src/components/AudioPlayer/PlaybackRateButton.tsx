import { Pressable } from "react-native";

import { useTrackPlayer } from "@/context";

import { OldThemedText } from "../ThemedText";

export function PlaybackRateButton(props: {
  /**
   * Defaults to 24
   */
  fontSize?: number;
}) {
  const trackPlayer = useTrackPlayer();
  return (
    <Pressable onPress={trackPlayer.updatePlaybackRateByCycling}>
      <OldThemedText
        style={{
          fontSize: props.fontSize ?? 24,
        }}
      >
        {trackPlayer.playbackRate}x
      </OldThemedText>
    </Pressable>
  );
}
