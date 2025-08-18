import { useState } from "react";
import { Pressable } from "react-native";

import { ThemedText } from "@/components";

export function PlaybackSpeedButton() {
  const [speedIndex, setSpeedIndex] = useState(0);
  const allPlaybackSpeed = [0.75, 1, 1.5, 2];

  function getPlaybackSpeed() {
    setSpeedIndex((prev) => (prev + 1) % allPlaybackSpeed.length);
  }

  return (
    <Pressable onPress={getPlaybackSpeed}>
      <ThemedText style={{ fontSize: 28, paddingTop: 10 }}>
        {allPlaybackSpeed[speedIndex]}x
      </ThemedText>
      ;
    </Pressable>
  );
}
