import { useProgress } from "react-native-track-player";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { convertSecondsToMSS } from "./convertSecondsToMSS";

export function AudioPlayerTime() {
  const progress = useProgress(1000);
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
      <ThemedText style={{ fontSize: 12 }}>{currentPos}</ThemedText>
      <ThemedText style={{ fontSize: 12 }}>-{remainingTime}</ThemedText>
    </ThemedView>
  );
}
