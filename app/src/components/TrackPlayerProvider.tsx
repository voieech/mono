import { useState, useCallback, type PropsWithChildren } from "react";
import RNTPTrackPlayer, {
  useTrackPlayerEvents,
  Event,
} from "react-native-track-player";

import type { TrackWithMetadata } from "@/utils";

import { TrackPlayerContext, useSettingContext } from "@/context";
import {
  settings,
  settingsInLocalStorage,
  TrackPlayerPlaybackRateMap,
  posthog,
} from "@/utils";

export function TrackPlayerProvider(props: PropsWithChildren) {
  const settingContext = useSettingContext();
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

  const removeUpcomingTracks = useCallback(async () => {
    await RNTPTrackPlayer.removeUpcomingTracks();
    await Promise.all([updateCurrentPosition(), updateTracks()]);
  }, [updateCurrentPosition, updateTracks]);

  const play = useCallback(async () => {
    // eslint-disable-next-line no-restricted-properties
    await RNTPTrackPlayer.play();

    const localStorageSettings = await settingsInLocalStorage.read();

    const playbackRateString =
      localStorageSettings.playbackRate ?? settings.playbackRate.defaultValue;

    const playbackRate =
      TrackPlayerPlaybackRateMap.get(playbackRateString) ?? 1;

    await RNTPTrackPlayer.setRate(playbackRate);

    // Make sure the current position is up to date
    updateCurrentPosition();

    const activeTrack = (await RNTPTrackPlayer.getActiveTrack()) as
      | TrackWithMetadata
      | undefined;

    if (activeTrack === undefined) {
      return;
    }

    posthog.capture("track_playback", {
      id: activeTrack.id,
      type: activeTrack.trackType,
      locale: activeTrack.locale,
      playbackRate,
    });
  }, [updateCurrentPosition]);

  const enqueueTracksAfterCurrent = useCallback(
    async (newTracks: Array<TrackWithMetadata>) => {
      const currentTracksSet = new Set(tracks.map((track) => track.id));
      const filteredTracks = newTracks.filter(
        (track) => !currentTracksSet.has(track.id),
      );

      // Add it to index 1, to be the next in line after the current track
      await RNTPTrackPlayer.add(filteredTracks, 1);

      await Promise.all([updateCurrentPosition(), updateTracks()]);
    },
    [tracks, updateCurrentPosition, updateTracks],
  );

  const goToPreviousOrStartOfTrack = useCallback(async () => {
    const shouldRewindToStartOnSkipPrevious = settingContext.getSetting(
      "rewindToStartOnSkipPrevious",
    );

    if (shouldRewindToStartOnSkipPrevious) {
      const progress = await RNTPTrackPlayer.getProgress();
      const positionAsInt = Math.trunc(progress.position);
      if (positionAsInt > 3) {
        await RNTPTrackPlayer.seekTo(0);
      } else {
        await RNTPTrackPlayer.skipToPrevious();
      }
    } else {
      await RNTPTrackPlayer.skipToPrevious();
    }

    await updateCurrentPosition();
  }, [settingContext, updateCurrentPosition]);

  useTrackPlayerEvents(
    [
      Event.RemotePlay,
      Event.PlaybackActiveTrackChanged,
      Event.PlaybackQueueEnded,
    ],
    (e) => {
      switch (e.type) {
        case Event.RemotePlay:
          play();
          break;

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
        play,
        // eslint-disable-next-line no-restricted-properties
        pause: RNTPTrackPlayer.pause,
        enqueueTracksAfterCurrent,
        goToPreviousOrStartOfTrack,

        /* Queue related */
        currentPosition,
        tracks,
        getTracksBehind,
        getTracksBehindWithCurrentTrack,
        getTracksAhead,
        getTracksAheadWithCurrentTrack,
        updateCurrentPosition,
        updateTracks,
        removeUpcomingTracks,
      }}
    >
      {props.children}
    </TrackPlayerContext>
  );
}
