import { Share, Pressable } from "react-native";

import type { TrackWithMetadata } from "@/utils";

import { Icon } from "@/components/provided";

export function ShareCurrentTrackIcon(props: {
  activeTrack: TrackWithMetadata;
}) {
  async function onShare() {
    try {
      const result = await Share.share(
        generateShareSheetObjectForTrack(props.activeTrack),
      );

      // @todo Log to analytics
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
      // @todo Log to analytics
    }
  }

  return (
    <Pressable onPress={onShare}>
      <Icon name="square.and.arrow.up" color="white" size={32} />
    </Pressable>
  );
}

// @todo Use URL builders instead of hardcoded links
function generateShareSheetObjectForTrack(track: TrackWithMetadata) {
  switch (track.trackType) {
    case "podcast_episode": {
      return {
        url: `https://www.voieech.com/podcast/episode/${track.episode.vanity_id}`,
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
