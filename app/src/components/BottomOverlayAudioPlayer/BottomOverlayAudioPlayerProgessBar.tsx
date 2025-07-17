import { View } from "react-native";
import { useProgress } from "react-native-track-player";

/**
 * Mini progress bar at the bottom of the `BottomOverlayAudioPlayer`.
 */
export function BottomOverlayAudioPlayerProgessBar() {
  // Get progress at a higher frequency to show a smoother moving progress bar
  const progress = useProgress(100);
  const progressBarPercentage = (progress.position / progress.duration) * 100;
  return (
    <View
      style={{
        height: 2,
        backgroundColor: "#d4d4d8",
        width: `${progressBarPercentage}%`,
      }}
    />
  );
}
