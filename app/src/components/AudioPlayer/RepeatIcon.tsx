import { Pressable } from "react-native";
import { RepeatMode } from "react-native-track-player";

import { Icon } from "@/components/provided";
import { Colors } from "@/constants";
import { useRepeatMode } from "@/TrackPlayer";

export function RepeatIcon() {
  const repeatMode = useRepeatMode();
  switch (repeatMode.repeatMode) {
    case null:
      return null;
    case RepeatMode.Off: {
      return (
        <Pressable
          onPress={() => repeatMode.setRepeatMode(RepeatMode.Queue)}
          disabled={repeatMode.isRepeatModeUpdating}
        >
          <Icon name="repeat" color={Colors.white} size={32} />
        </Pressable>
      );
    }
    case RepeatMode.Queue: {
      return (
        <Pressable
          onPress={() => repeatMode.setRepeatMode(RepeatMode.Track)}
          disabled={repeatMode.isRepeatModeUpdating}
        >
          <Icon name="repeat" color={Colors.green500} size={32} />
        </Pressable>
      );
    }
    case RepeatMode.Track: {
      return (
        <Pressable
          onPress={() => repeatMode.setRepeatMode(RepeatMode.Off)}
          disabled={repeatMode.isRepeatModeUpdating}
        >
          <Icon name="repeat.1" color={Colors.green500} size={32} />
        </Pressable>
      );
    }
    default:
      throw new Error(`Unsupported PlayerRepeatMode found: ${repeatMode}`);
  }
}
