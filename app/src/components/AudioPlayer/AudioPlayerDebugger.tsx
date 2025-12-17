import { OldThemedText } from "@/components/ThemedText";
import { useProgress } from "@/TrackPlayer";

export function AudioPlayerDebugger() {
  const progress = useProgress();
  const durationAsInt = Math.trunc(progress.duration);
  const bufferedAsInt = Math.trunc(progress.buffered);
  return (
    <OldThemedText>
      Buffered: {bufferedAsInt}s{"\n"}
      Total: {durationAsInt}s
    </OldThemedText>
  );
}
