import { useEffect, useState } from "react";
import { Pressable } from "react-native";

import { ThemedText } from "@/components";

export function PlaybackSpeedButton(props: {
  getTrackPlaybackRate: () => Promise<number>;
  setTrackPlaybackRate: (rate: number) => Promise<void>;
}) {
  const allPlaybackSpeed = [0.75, 1, 1.5, 2];
  const [trackPlaybackSpeed, setTrackPlaybackSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const trackPlaybackRate = await props.getTrackPlaybackRate();
      setTrackPlaybackSpeed(trackPlaybackRate);
      setIsLoading(false);
    };
    fetchData();
  });

  function handleOnClick() {
    const currentIndex = allPlaybackSpeed.indexOf(trackPlaybackSpeed);
    const newSpeed =
      allPlaybackSpeed[(currentIndex + 1) % allPlaybackSpeed.length];

    if (newSpeed !== undefined) {
      props.setTrackPlaybackRate(newSpeed);
      setTrackPlaybackSpeed(newSpeed);
    }
  }

  if (isLoading) {
    return <ThemedText style={{ paddingTop: 10 }}>Loading...</ThemedText>;
  }

  return (
    <Pressable onPress={handleOnClick}>
      <ThemedText style={{ fontSize: 28, paddingTop: 10 }}>
        {trackPlaybackSpeed}x
      </ThemedText>
    </Pressable>
  );
}
