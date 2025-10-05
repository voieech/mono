import type { PodcastPlatform } from "dto";

import * as kyselyPostgresHelpers from "kysely/helpers/postgres";

import { apiDB } from "../apiDB.js";

/**
 * Generate a `Episode` DTO type base query instead of having to duplicate this
 * code always.
 */
export function genPodcastEpisodeBaseQuery() {
  return apiDB
    .selectFrom("podcast_episode")
    .innerJoin("audio", "podcast_episode.audio_id", "audio.id")
    .leftJoin(
      "podcast_episode_externally_hosted_link",
      "podcast_episode.id",
      "podcast_episode_externally_hosted_link.podcast_episode_id",
    )
    .selectAll("podcast_episode")
    .select([
      "audio.public_url as audio_public_url",
      "audio.length as audio_length",
    ])
    .select((eb) =>
      kyselyPostgresHelpers
        .jsonArrayFrom(
          eb
            .selectFrom("podcast_episode_externally_hosted_link")
            .select([
              "podcast_episode_externally_hosted_link.podcast_platform",
              "podcast_episode_externally_hosted_link.url",
            ])
            .$castTo<{
              podcast_platform: PodcastPlatform;
              url: string;
            }>()
            .whereRef(
              "podcast_episode_externally_hosted_link.podcast_episode_id",
              "=",
              eb.ref("podcast_episode.id"),
            ),

          /**
           * This results in the same query as the above but with these diffs:
           * 1. This doesnt use `$castTo` and that is dangerous as it allows u
           * to do arbitrary type casts that differs from what is selected.
           *
           * 2. This uses eb + .$notNull() and .as() on the select, which
           * generates the extra as ... alias in SQL, which is redundant but is
           * more explicit and can potentially prevent errors from random casts.
           */
          // eb
          //   .selectFrom("podcast_episode_externally_hosted_link")
          //   .select([
          //     eb
          //       .ref("podcast_episode_externally_hosted_link.podcast_platform")
          //       .$notNull()
          //       .as("podcast_platform"),
          //     eb
          //       .ref("podcast_episode_externally_hosted_link.url")
          //       .$notNull()
          //       .as("url"),
          //   ])
          //   .whereRef(
          //     "podcast_episode_externally_hosted_link.podcast_episode_id",
          //     "=",
          //     eb.ref("podcast_episode.id"),
          //   ),
        )
        .as("externally_hosted_links"),
    );
}
