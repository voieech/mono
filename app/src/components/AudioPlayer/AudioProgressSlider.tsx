import { Slider } from "@react-native-assets/slider";
import { useEffect, useState } from "react";
import RNTPTrackPlayer from "react-native-track-player";

import type { TrackWithMetadata } from "@/utils";

import { useTrackPlayer } from "@/context";

export function AudioProgressSlider(props: {
  defaultTrackPosition: number;
  activeTrack: TrackWithMetadata;
}) {
  const durationAsInt = Math.trunc(props.activeTrack.duration);
  const [position, setPosition] = useState(props.defaultTrackPosition);
  const trackPlayer = useTrackPlayer();

  useEffect(() => {
    const intervalID = setInterval(
      () => {
        RNTPTrackPlayer.getProgress()
          .then(({ position }) => setPosition(position))
          // This only throw if you haven't yet setup RNTP, ignore failure
          .catch(() => {});
      },

      // Setting high polling frequency so that the slider animation is smooth
      100,
    );

    return () => clearInterval(intervalID);
  }, [setPosition]);

  async function onSlidingComplete(newPosition: number) {
    setPosition(newPosition);

    // eslint-disable-next-line no-restricted-properties
    await RNTPTrackPlayer.seekTo(newPosition);
    await trackPlayer.play();
  }

  return (
    <Slider
      minimumValue={0}
      maximumValue={durationAsInt}
      //
      value={position}
      //
      // Stop updating position when user start touching it
      // Position will be auto updated again after user stop touching it
      onTouchStart={() => trackPlayer.pause()}
      // onTouchEnd={() => trackPlayer.play()}
      // onTouchCancel={() => trackPlayer.play()}
      //
      // This is the same as "onValueChange", just that it is not called
      // continously and only called once user lifts their finger
      onSlidingComplete={onSlidingComplete}
      thumbTintColor="white"
      minimumTrackTintColor="#FFFFFF" // Sets left track color
      // maximumTrackTintColor="#000000" // Optional: Sets right track color
      // @todo This should be dynamic based on theme
    />
  );
}
