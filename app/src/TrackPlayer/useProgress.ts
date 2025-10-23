import { useEffect, useState } from "react";
import RNTPTrackPlayer, {
  Event,
  useTrackPlayerEvents,
} from "react-native-track-player";

const INITIAL_STATE = {
  position: 0,
  duration: 0,
  buffered: 0,
};

/**
 * Poll for track progress for the given interval (in miliseconds, default to
 * 1000)
 *
 * **Re-implementing hook** to write polling mechanism differently to prevent
 * potential uncontrolled recursive stack depth.
 */
function useProgressWithLoop(updateIntervalInMs = 1000) {
  const [state, setState] = useState(INITIAL_STATE);
  useTrackPlayerEvents([Event.PlaybackActiveTrackChanged], () => {
    setState(INITIAL_STATE);
  });

  useEffect(() => {
    let mounted = true;

    async function update() {
      try {
        const { position, duration, buffered } =
          await RNTPTrackPlayer.getProgress();

        setState((state) =>
          position === state.position &&
          duration === state.duration &&
          buffered === state.buffered
            ? state
            : { position, duration, buffered },
        );
      } catch {
        // Ignore failure as method only throws if you haven't ran setup yet.
      }
    }

    async function poll() {
      while (true) {
        if (!mounted) {
          return;
        }
        await update();
        await new Promise((res) => setTimeout(res, updateIntervalInMs));
      }
    }
    poll();

    return () => {
      mounted = false;
    };
  }, [updateIntervalInMs]);

  return state;
}

export const useProgress = useProgressWithLoop;
