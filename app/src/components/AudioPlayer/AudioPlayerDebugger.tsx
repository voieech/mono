import { useProgress } from "react-native-track-player";

import { AppDebuggingSurface } from "@/components/AppDebuggingSurface";
import { ThemedText } from "@/components/ThemedText";

export function AudioPlayerDebugger() {
  const progress = useProgress();
  const durationAsInt = Math.trunc(progress.duration);
  const bufferedAsInt = Math.trunc(progress.buffered);
  return (
    <AppDebuggingSurface>
      <ThemedText>
        Buffered: {bufferedAsInt}s{"\n"}
        Total: {durationAsInt}s
      </ThemedText>
    </AppDebuggingSurface>
  );
}
