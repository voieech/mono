import type { Channel } from "dto";
import type { StyleProp, TextStyle } from "react-native";

import { i18n } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { Share, Pressable } from "react-native";

import { Icon } from "@/components/provided";
import { Colors } from "@/constants";
import { posthog } from "@/utils";

export function ShareChannelIcon(props: {
  channel: Channel;
  style?: StyleProp<TextStyle>;
  size?: number;
}) {
  async function onShare() {
    try {
      const channelName = props.channel.name;
      const result = await Share.share({
        // @todo Use URL builders instead of hardcoded links
        url: `https://voieech.com/podcast/channel/${props.channel.id}`,
        title: channelName,
        message: i18n.t(msg`Check out "${channelName}" on voieech.com`),
      });

      posthog.capture("share_channel", {
        // Cast to any is safe since it is a JSON stringifiable type.
        channel: props.channel as any,
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
        color={Colors.white}
        style={props.style}
        size={props.size}
      />
    </Pressable>
  );
}
