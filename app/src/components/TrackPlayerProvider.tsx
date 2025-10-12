import type { PropsWithChildren } from "react";

import { useState, useCallback } from "react";
import RNTPTrackPlayer, {
  useTrackPlayerEvents,
  Event,
} from "react-native-track-player";

import type { TrackWithMetadata } from "@/utils";

import { TrackPlayerContext, useSettingContext } from "@/context";
import {
  TrackPlayerPlaybackRates,
  TrackPlayerPlaybackRateMap,
  posthog,
} from "@/utils";

export function TrackPlayerProvider(props: PropsWithChildren) {
  const settingContext = useSettingContext();
  const [currentPosition, setCurrentPosition] = useState(0);
  const [tracks, setTracks] = useState<Array<TrackWithMetadata>>([]);
  const playbackRateSetting = settingContext.getSetting("playbackRate");
  const playbackRate = TrackPlayerPlaybackRateMap.get(playbackRateSetting) ?? 1;

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
  }, [playbackRate, updateCurrentPosition]);

  // eslint-disable-next-line no-restricted-properties
  const pause = useCallback(() => RNTPTrackPlayer.pause(), []);

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

  const goToNextTrack = useCallback(() => RNTPTrackPlayer.skipToNext(), []);

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

  const updatePlaybackRateByCycling = useCallback(async () => {
    // Match against string instead of number to avoid float comparisons
    const currentIndex = TrackPlayerPlaybackRates.findIndex(
      ([val]) => val === playbackRateSetting,
    );

    let newRate =
      TrackPlayerPlaybackRates[
        (currentIndex + 1) % TrackPlayerPlaybackRates.length
      ]?.[0];

    // Dont throw error, fallback to default for users to still use
    if (newRate === undefined) {
      console.error("Unable to cycle playback rate, defaulting to 1");
      newRate = "1";
    }

    await RNTPTrackPlayer.setRate(TrackPlayerPlaybackRateMap.get(newRate)!);

    settingContext.updateSetting("playbackRate", newRate);
  }, [settingContext, playbackRateSetting]);

  useTrackPlayerEvents(
    [
      Event.PlaybackActiveTrackChanged,
      Event.PlaybackQueueEnded,
      Event.RemotePlay,
      Event.RemotePause,
      Event.RemoteStop,
      Event.RemoteNext,
      Event.RemotePrevious,
      Event.RemoteJumpForward,
      Event.RemoteJumpBackward,
      Event.RemoteSeek,
      Event.PlaybackError,
    ],
    async (e) => {
      if (__DEV__) {
        console.log(`RNTPTrackPlayer event fired: ${e.type}`);
      }

      switch (e.type) {
        case Event.PlaybackActiveTrackChanged:
          {
            await updateCurrentPosition();
          }
          break;

        case Event.PlaybackQueueEnded:
          {
          }
          break;

        /* Remote Control events */

        case Event.RemotePlay:
          {
            await play();
          }
          break;

        case Event.RemotePause:
          {
            await pause();
          }
          break;

        case Event.RemoteStop:
          {
            await RNTPTrackPlayer.stop();
          }
          break;

        case Event.RemoteNext:
          {
            await goToNextTrack();
          }
          break;

        case Event.RemotePrevious:
          {
            await goToPreviousOrStartOfTrack();
          }
          break;

        case Event.RemoteJumpForward:
          {
            await RNTPTrackPlayer.seekBy(e.interval);
          }
          break;

        case Event.RemoteJumpBackward:
          {
            const progress = await RNTPTrackPlayer.getProgress();
            if (progress.position < e.interval) {
              await RNTPTrackPlayer.seekTo(0);
            } else {
              await RNTPTrackPlayer.seekBy(-e.interval);
            }
          }
          break;

        case Event.RemoteSeek:
          {
            await RNTPTrackPlayer.seekTo(e.position);
          }
          break;

        // @todo
        // Log these errors and in dev mode / intern user mode,
        // show snackbar about error
        //
        // case Event.PlayerError:
        // case Event.PlaybackError:
        //   break;

        default:
          console.error(`Unsupported event type: ${e.type}`);
      }
    },
  );

  return (
    <TrackPlayerContext
      value={{
        play,
        pause,
        enqueueTracksAfterCurrent,
        goToNextTrack,
        goToPreviousOrStartOfTrack,
        playbackRate,
        updatePlaybackRateByCycling,

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
