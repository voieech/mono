import { apiDB } from "../apiDB.js";

/**
 * Generate a `Episode` DTO type base query instead of having to duplicate this
 * code always.
 */
export function genPodcastEpisodeBaseQuery() {
  return apiDB
    .selectFrom("podcast_episode")
    .innerJoin("audio", "podcast_episode.audio_id", "audio.id")
    .innerJoin(
      "podcast_channel",
      "podcast_episode.channel_id",
      "podcast_channel.id",
    )
    .selectAll("podcast_episode")
    .select([
      "audio.public_url as audio_public_url",
      "audio.length as audio_length",
      "podcast_channel.name as channel_name",
    ]);
}
