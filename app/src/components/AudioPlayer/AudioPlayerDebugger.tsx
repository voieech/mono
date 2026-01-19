import { ThemedText } from "@/components/ThemedComponents/index";
import { useProgress } from "@/TrackPlayer";

export function AudioPlayerDebugger() {
  const progress = useProgress();
  const durationAsInt = Math.trunc(progress.duration);
  const bufferedAsInt = Math.trunc(progress.buffered);
  return (
    <ThemedText>
      Buffered: {bufferedAsInt}s{"\n"}
      Total: {durationAsInt}s
    </ThemedText>
  );
}
