import type { PropsWithChildren } from "react";

import { Pressable } from "react-native";
import TrackPlayer from "react-native-track-player";

import { Icon } from "@/components/provided";

export function AudioPlayerJumpBackwardButton() {
  return (
    <AudioPlayerJumpButton jumpTimeInSeconds={-10}>
      <Icon name="gobackward.10" color="white" size={48} />
    </AudioPlayerJumpButton>
  );
}

export function AudioPlayerJumpForwardButton() {
  return (
    <AudioPlayerJumpButton jumpTimeInSeconds={10}>
      <Icon name="goforward.10" color="white" size={48} />
    </AudioPlayerJumpButton>
  );
}

function AudioPlayerJumpButton(
  props: PropsWithChildren<{
    jumpTimeInSeconds: number;
  }>,
) {
  return (
    <Pressable onPress={() => TrackPlayer.seekBy(props.jumpTimeInSeconds)}>
      {props.children}
    </Pressable>
  );
}
