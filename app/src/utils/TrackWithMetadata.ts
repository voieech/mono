import type { Episode } from "dto";
import type { Track } from "react-native-track-player";

import type { RemoveIndexSignature, MakeSomeFieldsRequired } from "@/types";

/**
 * `ExtendedTrack` type removes index fields, makes some fields required, and
 * adds a required `id` field to uniquely identify every single track.
 *
 * Removing the Index signature to make it easier to extend since the index
 * signature make the entire object's keyof type into generic `string` and all
 * values into generic `any`.
 */
type ExtendedTrack = MakeSomeFieldsRequired<
  RemoveIndexSignature<Track>,
  "artist" | "url" | "title" | "duration" | "artwork"
> & {
  id: string;
  locale: string;
};

export interface TrackWithPodcastEpisode extends ExtendedTrack {
  trackType: "podcast_episode";
  episode: Episode;
}

export type TrackWithMetadata = TrackWithPodcastEpisode;

export function createTrackWithMetadata<const T extends TrackWithMetadata>(
  track: T,
) {
  return track as TrackWithMetadata;
}

const allTrackTypes: Array<TrackWithMetadata["trackType"]> = [
  "podcast_episode",
];

export function isTrackWithMetadata(track: Track): track is TrackWithMetadata {
  return (
    typeof track.trackType === "string" &&
    allTrackTypes.includes(track.trackType as TrackWithMetadata["trackType"])
  );
}
