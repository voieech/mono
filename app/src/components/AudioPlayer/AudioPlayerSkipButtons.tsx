import { Pressable } from "react-native";
import TrackPlayer from "react-native-track-player";

import { Icon } from "@/components/provided";
import { useSettingContext } from "@/context";

export function AudioPlayerSkipPreviousButton() {
  const shouldRewindToStartOnSkipPrevious = useSettingContext().getSetting(
    "rewindToStartOnSkipPrevious",
  );

  return (
    <Pressable
      onPress={async () => {
        const progress = await TrackPlayer.getProgress();
        const positionAsInt = Math.trunc(progress.position);

        if (shouldRewindToStartOnSkipPrevious && positionAsInt > 3) {
          TrackPlayer.seekTo(0);
          return;
        }

        TrackPlayer.skipToPrevious();
      }}
    >
      <Icon name="backward.end.fill" color="white" />
    </Pressable>
  );
}

export function AudioPlayerSkipNextButton() {
  return (
    <Pressable onPress={() => TrackPlayer.skipToNext()}>
      <Icon name="forward.end.fill" color="white" />
    </Pressable>
  );
}
