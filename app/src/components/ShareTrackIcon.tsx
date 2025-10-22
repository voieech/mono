import { i18n } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { Share, Pressable } from "react-native";

import type { TrackWithMetadata } from "@/utils";

import { Icon } from "@/components/provided";
import { posthog } from "@/utils";

export function ShareTrackIcon(props: { track: TrackWithMetadata }) {
  async function onShare() {
    try {
      const result = await Share.share(
        generateShareSheetObjectForTrack(props.track),
      );

      posthog.capture("share_track", {
        // Cast to any is safe since it is a JSON stringifiable type.
        track: props.track as any,
        shareAction: result.action,
        shareActivityType: result.activityType ?? null,
      });
    } catch (_: any) {
      // @todo Log to app monitoring
    }
  }

  return (
    <Pressable onPress={onShare}>
      <Icon
        name="square.and.arrow.up"
        color="white"
        style={{
          marginBottom: 6,
        }}
      />
    </Pressable>
  );
}

// @todo Use URL builders instead of hardcoded links
function generateShareSheetObjectForTrack(track: TrackWithMetadata) {
  const trackTitle = track.title;
  switch (track.trackType) {
    case "podcast_episode": {
      return {
        url: `https://voieech.com/podcast/episode/${track.episode.vanity_id}`,
        title: trackTitle,
        message: i18n.t(msg`Check out voieech for "${trackTitle}"`),
      };
    }
    default:
      throw new Error(
        `Unimplemented share sheet generation for trackType: ${track.trackType}`,
      );
  }
}
