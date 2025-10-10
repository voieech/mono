import { useState, useCallback, type PropsWithChildren } from "react";
import RNTPTrackPlayer, {
  useTrackPlayerEvents,
  Event,
} from "react-native-track-player";

import type { TrackWithMetadata } from "@/utils";

import { TrackPlayerContext } from "@/context";

export function TrackPlayerProvider(props: PropsWithChildren) {
  const [currentPosition, setCurrentPosition] = useState(0);
  const [tracks, setTracks] = useState<Array<TrackWithMetadata>>([]);

  const getTracksBehind = useCallback(
    () => tracks.slice(0, currentPosition),
    [tracks, currentPosition],
  );

  const getTracksBehindWithCurrentTrack = useCallback(
    () => tracks.slice(0, currentPosition + 1),
    [tracks, currentPosition],
  );

  const getTracksAhead = useCallback(
    () => tracks.slice(currentPosition + 1),
    [tracks, currentPosition],
  );

  const getTracksAheadWithCurrentTrack = useCallback(
    () => tracks.slice(currentPosition),
    [tracks, currentPosition],
  );

  const updateCurrentPosition = useCallback(async () => {
    setCurrentPosition((await RNTPTrackPlayer.getActiveTrackIndex()) ?? 0);
  }, []);

  const updateTracks = useCallback(async () => {
    setTracks(
      ((await RNTPTrackPlayer.getQueue()) as Array<TrackWithMetadata>) ?? [],
    );
  }, []);

  useTrackPlayerEvents(
    [Event.PlaybackActiveTrackChanged, Event.PlaybackQueueEnded],
    (e) => {
      switch (e.type) {
        case Event.PlaybackActiveTrackChanged:
          updateCurrentPosition();
          break;

        case Event.PlaybackQueueEnded:
          updateCurrentPosition();
          break;

        default:
          console.log("Unsupported event type!");
      }
    },
  );

  return (
    <TrackPlayerContext
      value={{
        currentPosition,
        tracks,
        getTracksBehind,
        getTracksBehindWithCurrentTrack,
        getTracksAhead,
        getTracksAheadWithCurrentTrack,
        updateCurrentPosition,
        updateTracks,
      }}
    >
      {props.children}
    </TrackPlayerContext>
  );
}
