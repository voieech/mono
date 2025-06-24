import { useCallback, useEffect, useState } from "react";
import { Pressable } from "react-native";
import TrackPlayer, {
  RepeatMode as PlayerRepeatMode,
} from "react-native-track-player";

import { Icon } from "@/components/provided";

export function RepeatIcon() {
  const [repeatMode, setRepeatModeState] = useState<PlayerRepeatMode>(
    PlayerRepeatMode.Off
  );
  const [isPressDisabled, setIsPressDisabled] = useState(false);

  useEffect(() => {
    TrackPlayer.getRepeatMode().then(setRepeatModeState);
  }, []);

  const setRepeatMode = useCallback(
    async function (repeatMode: PlayerRepeatMode) {
      setIsPressDisabled(true);
      TrackPlayer.setRepeatMode(repeatMode).then(() => {
        setRepeatModeState(repeatMode);
        setIsPressDisabled(false);
      });
    },
    [setIsPressDisabled, setRepeatModeState]
  );

  switch (repeatMode) {
    case PlayerRepeatMode.Off: {
      return (
        <Pressable
          onPress={() => setRepeatMode(PlayerRepeatMode.Queue)}
          disabled={isPressDisabled}
        >
          <Icon name="repeat" color="white" size={32} />
        </Pressable>
      );
    }
    case PlayerRepeatMode.Queue: {
      return (
        <Pressable
          onPress={() => setRepeatMode(PlayerRepeatMode.Track)}
          disabled={isPressDisabled}
        >
          <Icon name="repeat" color="#16a34a" size={32} />
        </Pressable>
      );
    }
    case PlayerRepeatMode.Track: {
      return (
        <Pressable
          onPress={() => setRepeatMode(PlayerRepeatMode.Off)}
          disabled={isPressDisabled}
        >
          <Icon name="repeat.1" color="#16a34a" size={32} />
        </Pressable>
      );
    }
    default:
      throw new Error(`Unsupported PlayerRepeatMode found: ${repeatMode}`);
  }
}
