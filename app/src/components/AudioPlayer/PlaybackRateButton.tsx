import { Pressable } from "react-native";
import TrackPlayer from "react-native-track-player";

import { useSettingContext } from "@/context";
import { TrackPlayerPlaybackRates, TrackPlayerPlaybackRateMap } from "@/utils";

import { ThemedText } from "../ThemedText";

export function PlaybackRateButton(props: {
  /**
   * Defaults to 24
   */
  fontSize?: number;
}) {
  const settingContext = useSettingContext();
  const trackPlaybackRateSetting = settingContext.getSetting("playbackRate");
  const trackPlaybackRate = TrackPlayerPlaybackRateMap.get(
    trackPlaybackRateSetting,
  )!;

  function cycleRate() {
    // Match against string instead of number to avoid float comparisons
    const currentIndex = TrackPlayerPlaybackRates.findIndex(
      ([val]) => val === trackPlaybackRateSetting,
    );

    let newRate =
      TrackPlayerPlaybackRates[
        (currentIndex + 1) % TrackPlayerPlaybackRates.length
      ]?.[0];

    // Dont throw error, fallback to default for users to still use
    if (newRate === undefined) {
      console.error(
        new Error("Unable to cycle playback rate, defaulting to 1"),
      );
      newRate = "1";
    }

    TrackPlayer.setRate(TrackPlayerPlaybackRateMap.get(newRate)!);

    settingContext.updateSetting("playbackRate", newRate);
  }

  return (
    <Pressable onPress={cycleRate}>
      <ThemedText
        style={{
          fontSize: props.fontSize ?? 24,
        }}
      >
        {trackPlaybackRate}x
      </ThemedText>
    </Pressable>
  );
}
