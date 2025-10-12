import type { EventPayloadByEvent } from "react-native-track-player";

import { useEffect, useRef } from "react";
import RNTPTrackPlayer, { Event } from "react-native-track-player";

/**
 * Implementation based on the library provided useTrackPlayerEvents, where the
 * only difference is that this requires event and their event handler to be
 * individually specified.
 *
 * Attaches a handler to the given TrackPlayer event and performs cleanup on
 * unmount.
 */
export function useTrackPlayerEventHandler<
  const E extends Event,
  const EventHandler extends (event: EventPayloadByEvent[E]) => void,
>(
  /**
   * TrackPlayer event to subscribe to
   */
  event: E,
  /**
   * Callback invoked when the event fires
   */
  eventHandler: EventHandler,
) {
  const savedHandler = useRef(eventHandler);
  savedHandler.current = eventHandler;

  useEffect(() => {
    const subscription = RNTPTrackPlayer.addEventListener(
      event,
      // @ts-expect-error
      (e) => {
        if (__DEV__) {
          console.log(`RNTPTrackPlayer event fired: ${event}`);
        }
        savedHandler.current(e);
      },
    );

    return () => subscription.remove();
  }, [event]);
}
