import { OldThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useProgress } from "@/TrackPlayer";

import { convertSecondsToMSS } from "./convertSecondsToMSS";

export function AudioPlayerTime() {
  // Use 0.3 seconds because we could allow up to 3x speed, so by using this,
  // we ensure that the UI shows every single second passing rather than the
  // timestamp every 1 second by default.
  const progress = useProgress(300);
  const positionAsInt = Math.trunc(progress.position);
  const durationAsInt = Math.trunc(progress.duration);
  const currentPos = convertSecondsToMSS(positionAsInt);
  const remainingTime = convertSecondsToMSS(durationAsInt - positionAsInt);
  return (
    <ThemedView
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <OldThemedText style={{ fontSize: 12 }}>{currentPos}</OldThemedText>
      <OldThemedText style={{ fontSize: 12 }}>-{remainingTime}</OldThemedText>
    </ThemedView>
  );
}
