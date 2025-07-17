import { Slider } from "@react-native-assets/slider";
import { useEffect, useState } from "react";
import TrackPlayer from "react-native-track-player";

import type { TrackWithMetadata } from "@/utils";

export function AudioProgressSlider(props: {
  defaultTrackPosition: number;
  updateInterval: number;
  activeTrack: TrackWithMetadata;
}) {
  const durationAsInt = Math.trunc(props.activeTrack.duration);
  const [position, setPosition] = useState(props.defaultTrackPosition);

  useEffect(() => {
    const intervalID = setInterval(() => {
      TrackPlayer.getProgress()
        .then(({ position }) => setPosition(position))
        // This only throw if you haven't yet setup RNTP, ignore failure
        .catch(() => {});
    }, props.updateInterval);

    return () => clearInterval(intervalID);
  }, [props.updateInterval, setPosition]);

  async function onSlidingComplete(newPosition: number) {
    setPosition(newPosition);

    await TrackPlayer.seekTo(newPosition);
    await TrackPlayer.play();
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
      onTouchStart={() => {
        TrackPlayer.pause();
      }}
      // onTouchEnd={() => TrackPlayer.play()}
      // onTouchCancel={() => TrackPlayer.play()}
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
