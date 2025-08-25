import { useState } from "react";
import { Pressable } from "react-native";

import { ThemedText } from "@/components";

export function PlaybackSpeedButton(props: {
  trackPlaybackSpeed: number;
  setTrackPlaybackRate: (rate: number) => Promise<void>;
}) {
  const allPlaybackSpeed = [0.75, 1, 1.25, 1.5, 1.75, 2];
  const [trackPlaybackSpeed, setTrackPlaybackSpeed] = useState(
    props.trackPlaybackSpeed,
  );

  function handleOnClick() {
    const currentIndex = allPlaybackSpeed.indexOf(trackPlaybackSpeed);
    const newSpeed =
      allPlaybackSpeed[(currentIndex + 1) % allPlaybackSpeed.length];

    if (newSpeed === undefined) {
      throw new Error("New playback speed is undefined");
    }

    props.setTrackPlaybackRate(newSpeed);
    setTrackPlaybackSpeed(newSpeed);
  }

  return (
    <Pressable onPress={handleOnClick}>
      <ThemedText style={{ fontSize: 28, paddingTop: 10 }}>
        {trackPlaybackSpeed}x
      </ThemedText>
    </Pressable>
  );
}
