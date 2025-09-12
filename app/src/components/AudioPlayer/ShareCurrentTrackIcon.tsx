import { Share, Pressable } from "react-native";

import type { TrackWithMetadata } from "@/utils";

import { Icon } from "@/components/provided";
import { posthog } from "@/utils";

export function ShareCurrentTrackIcon(props: {
  activeTrack: TrackWithMetadata;
}) {
  async function onShare() {
    try {
      const result = await Share.share(
        generateShareSheetObjectForTrack(props.activeTrack),
      );

      posthog.capture("share_current_track", {
        // Cast to any is safe since it is a JSON stringifiable type.
        track: props.activeTrack as any,
        shareAction: result.action,
        shareActivityType: result.activityType ?? null,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
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
  switch (track.trackType) {
    case "podcast_episode": {
      return {
        url: `https://voieech.com/podcast/episode/${track.episode.vanity_id}`,
        title: track.title,
        message: `Check out voieech for ${track.title}`,
      };
    }
    default:
      throw new Error(
        `Unimplemented share sheet generation for trackType: ${track.trackType}`,
      );
  }
}
