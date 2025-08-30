import { useEffect } from "react";
import { Pressable } from "react-native";
import TrackPlayer from "react-native-track-player";

import { ThemedText } from "@/components";
import { useSettingContext } from "@/context";

const allPlaybackSpeed: Array<[string, number]> = [
  ["0.75", 0.75],
  ["1", 1],
  ["1.25", 1.25],
  ["1.5", 1.5],
  ["1.75", 1.75],
  ["2", 2],
];
const allPlaybackSpeedMap = new Map<string, number>(allPlaybackSpeed);

export function PlaybackSpeedButton() {
  const settingContext = useSettingContext();
  const trackPlaybackSpeedSetting = settingContext.getSetting(
    "defaultPlaybackSpeed",
  );
  const trackPlaybackSpeed = allPlaybackSpeedMap.get(
    trackPlaybackSpeedSetting,
  )!;

  // @todo do this with the play button!
  useEffect(() => {
    TrackPlayer.setRate(trackPlaybackSpeed);
  }, [trackPlaybackSpeed]);

  function cycleSpeed() {
    // Match against string instead of number to avoid float comparisons
    const currentIndex = allPlaybackSpeed.findIndex(
      ([val]) => val === trackPlaybackSpeedSetting,
    );

    let newSpeed =
      allPlaybackSpeed[(currentIndex + 1) % allPlaybackSpeed.length]?.[0];

    // Dont throw error, fallback to default for users to still use
    if (newSpeed === undefined) {
      console.error(
        new Error("Unable to cycle playback speed, defaulting to 1"),
      );
      newSpeed = "1";
    }

    TrackPlayer.setRate(allPlaybackSpeedMap.get(newSpeed)!);

    settingContext.updateSetting("defaultPlaybackSpeed", newSpeed);
  }

  return (
    <Pressable onPress={cycleSpeed}>
      <ThemedText
        style={{
          fontSize: 24,
        }}
      >
        {trackPlaybackSpeed}x
      </ThemedText>
    </Pressable>
  );
}
