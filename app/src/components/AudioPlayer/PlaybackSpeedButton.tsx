import { Pressable } from "react-native";
import TrackPlayer from "react-native-track-player";

import { ThemedText } from "@/components";
import { useSettingContext } from "@/context";
import { TrackPlayerPlaybackRates, TrackPlayerPlaybackRateMap } from "@/utils";

export function PlaybackSpeedButton() {
  const settingContext = useSettingContext();
  const trackPlaybackSpeedSetting = settingContext.getSetting(
    "defaultPlaybackSpeed",
  );
  const trackPlaybackSpeed = TrackPlayerPlaybackRateMap.get(
    trackPlaybackSpeedSetting,
  )!;

  function cycleSpeed() {
    // Match against string instead of number to avoid float comparisons
    const currentIndex = TrackPlayerPlaybackRates.findIndex(
      ([val]) => val === trackPlaybackSpeedSetting,
    );

    let newSpeed =
      TrackPlayerPlaybackRates[
        (currentIndex + 1) % TrackPlayerPlaybackRates.length
      ]?.[0];

    // Dont throw error, fallback to default for users to still use
    if (newSpeed === undefined) {
      console.error(
        new Error("Unable to cycle playback speed, defaulting to 1"),
      );
      newSpeed = "1";
    }

    TrackPlayer.setRate(TrackPlayerPlaybackRateMap.get(newSpeed)!);

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
