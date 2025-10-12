import { useCallback, useEffect, useState } from "react";
import RNTPTrackPlayer, { RepeatMode } from "react-native-track-player";

/**
 * Use cautiously in 1 location since any changes to repeat mode only updates
 * the local hook state and will not reflect in other callsites of this hook.
 */
export function useRepeatMode() {
  const [repeatMode, setRepeatModeState] = useState<RepeatMode | null>(null);
  const [isRepeatModeUpdating, setIsRepeatModeUpdating] = useState(false);

  const setRepeatMode = useCallback(
    async function (repeatMode: RepeatMode) {
      setIsRepeatModeUpdating(true);
      await RNTPTrackPlayer.setRepeatMode(repeatMode);
      setRepeatModeState(repeatMode);
      setIsRepeatModeUpdating(false);
    },
    [setIsRepeatModeUpdating, setRepeatModeState],
  );

  useEffect(() => {
    RNTPTrackPlayer.getRepeatMode().then(setRepeatModeState);
  }, []);

  return {
    repeatMode,
    setRepeatMode,
    isRepeatModeUpdating,
  };
}
