import { useState, useEffect } from "react";
import RNTPTrackPlayer, {
  useTrackPlayerEvents,
  Event,
} from "react-native-track-player";

import { TrackWithMetadata } from "@/utils";

export function usePlayerQueue() {
  const [queue, setQueue] = useState<Array<TrackWithMetadata>>([]);

  // Initial run
  useEffect(() => {
    RNTPTrackPlayer.getQueue().then((q) =>
      setQueue(q as Array<TrackWithMetadata>),
    );
  }, []);

  // Whenever the queue has ended, or when the track is changed, we want to
  // updated the current queue object.
  useTrackPlayerEvents(
    [Event.PlaybackQueueEnded, Event.PlaybackActiveTrackChanged],
    () =>
      RNTPTrackPlayer.getQueue().then((q) =>
        setQueue(q as Array<TrackWithMetadata>),
      ),
  );

  return queue;
}
