import RNTPTrackPlayer from "react-native-track-player";

import { TrackWithMetadata } from "@/utils";

class TrackQueue {
  #currentPosition = 0;
  #tracks: Array<TrackWithMetadata> = [];

  getCurrentPosition() {
    return this.#currentPosition;
  }

  getAllTracks() {
    return this.#tracks.slice();
  }

  getTracksBehind() {
    return this.#tracks.slice(0, this.#currentPosition);
  }

  getTracksBehindWithCurrentTrack() {
    return this.#tracks.slice(0, this.#currentPosition + 1);
  }

  getTracksAhead() {
    return this.#tracks.slice(this.#currentPosition + 1);
  }

  getTracksAheadWithCurrentTrack() {
    return this.#tracks.slice(this.#currentPosition);
  }

  /**
   * Sync queue position with source of truth
   */
  async updateCurrentPosition() {
    this.#currentPosition = (await RNTPTrackPlayer.getActiveTrackIndex()) ?? 0;
  }

  /**
   * Sync queue with source of truth
   */
  async updateTracks() {
    this.#tracks =
      ((await RNTPTrackPlayer.getQueue()) as Array<TrackWithMetadata>) ?? [];
  }
}

/**
 * Singleton `TrackQueue`.
 */
export const trackQueue = new TrackQueue();
