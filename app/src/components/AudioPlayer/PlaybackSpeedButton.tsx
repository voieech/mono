import { useEffect, useState } from "react";
import { Pressable } from "react-native";
import TrackPlayer from "react-native-track-player";

import { ThemedText } from "@/components";
import { useSettingContext } from "@/context";

export function PlaybackSpeedButton() {
  const allPlaybackSpeed = [0.75, 1, 1.25, 1.5, 1.75, 2];
  const [trackPlaybackSpeed, setTrackPlaybackSpeed] = useState(
    Number(useSettingContext().getSetting("defaultPlaybackSpeed")),
  );

  useEffect(() => {
    TrackPlayer.setRate(trackPlaybackSpeed);
  }, [trackPlaybackSpeed]);

  function cycleSpeed() {
    const currentIndex = allPlaybackSpeed.indexOf(trackPlaybackSpeed);
    const newSpeed =
      allPlaybackSpeed[(currentIndex + 1) % allPlaybackSpeed.length];

    if (newSpeed === undefined) {
      throw new Error("New playback speed is undefined");
    }

    setTrackPlaybackSpeed(newSpeed);
  }

  return (
    <Pressable onPress={cycleSpeed}>
      <ThemedText style={{ fontSize: 28, paddingTop: 10 }}>
        {trackPlaybackSpeed}x
      </ThemedText>
    </Pressable>
  );
}
