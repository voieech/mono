import { Slider } from "@react-native-assets/slider";
import { useCallback, useEffect, useState } from "react";
import TrackPlayer, {
  State as PlayerState,
  usePlaybackState,
} from "react-native-track-player";

/**
 * Audio progress slider that is live, meaning it allows for the audio to keep
 * playing while user is sliding / seeking.
 *
 * This implementation is buggy so not being used right now, keeping it here to
 * come back to this in the future.
 *
 * There is still a bug where if i keep sliding quickly, the thing will be out
 * of sync, like whats shown in the slider and whats playing is not the correct
 * timestamp... i have no idea if this is a bug in the slider library, RNTP, or
 * my slider implementation. This only happens when the slider is being touched
 * again, before the last update is set...
 */
export function LiveAudioProgressSlider__DEPRECATED(props: {
  updateInterval: number;
  duration: number;
}) {
  const [touching, setTouching] = useState(false);
  const [position, setPosition] = useState(0);
  const [positionUpdateIntervalID, setPositionUpdateIntervalID] = useState<
    null | number
  >(null);

  const startUpdating = useCallback(() => {
    if (positionUpdateIntervalID !== null) {
      return;
    }

    const intervalID = setInterval(() => {
      TrackPlayer.getProgress()
        .then(({ position }) => setPosition(position))
        // This only throw if you haven't yet setup RNTP, ignore failure
        .catch(() => {});
    }, props.updateInterval);

    setPositionUpdateIntervalID(intervalID);
  }, [
    props.updateInterval,
    positionUpdateIntervalID,
    setPositionUpdateIntervalID,
    setPosition,
  ]);

  const onSlidingComplete = useCallback(
    async (value: number) => {
      // Update the UI first, so that when user lifts their finger up, there
      // wont be a reset to the old position that hasnt been updated yet
      setPosition(value);

      await TrackPlayer.seekTo(value);

      // Only after track player has seeked to that position then do we resume
      // updating, and using setTimeout for a next tick effect
      setTimeout(startUpdating, 10);
    },
    [setPosition, startUpdating],
  );

  const cleanUpTimer = useCallback(() => {
    if (positionUpdateIntervalID !== null) {
      clearInterval(positionUpdateIntervalID);
      setPositionUpdateIntervalID(null);
    }
  }, [positionUpdateIntervalID, setPositionUpdateIntervalID]);

  const isPlaying = usePlaybackState().state === PlayerState.Playing;

  useEffect(() => {
    if (isPlaying && !touching) {
      startUpdating();
    } else {
      cleanUpTimer();
    }

    return cleanUpTimer;
  }, [
    isPlaying,
    touching,
    startUpdating,
    positionUpdateIntervalID,
    setPositionUpdateIntervalID,
    cleanUpTimer,
  ]);

  return (
    <Slider
      minimumValue={0}
      maximumValue={props.duration}
      value={position}
      //
      // Stop updating position when user start touching it
      // Position will be auto updated again after user stop touching it
      onTouchStart={() => {
        setTouching(true);
        cleanUpTimer();
      }}
      onTouchEnd={() => setTouching(false)}
      onTouchCancel={() => setTouching(false)}
      //
      // This is the same as "onValueChange", just that it is not called
      // continously and only called once user lifts their finger
      onSlidingComplete={onSlidingComplete}
    />
  );
}
