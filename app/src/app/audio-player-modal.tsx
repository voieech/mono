import { router } from "expo-router";
import { Pressable, useWindowDimensions } from "react-native";
import { useActiveTrack } from "react-native-track-player";

import {
  SafeScrollViewContainer,
  ThemedView,
  ThemedText,
  IconSymbol,
  AudioPlayer,
} from "@/components";

export default function AudioPlayerModal() {
  const windowDimensions = useWindowDimensions();
  const activeTrack = useActiveTrack();
  return (
    <SafeScrollViewContainer>
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.dismissTo("..");
            }
          }}
        >
          <IconSymbol name="arrow.down" color="white" />
        </Pressable>
        <ThemedText
          style={{
            textAlign: "center",
            width: windowDimensions.width * 0.6,
          }}
          numberOfLines={1}
        >
          {activeTrack?.artist}
        </ThemedText>
        <IconSymbol name="dot.square" color="white" />
      </ThemedView>
      <AudioPlayer />
    </SafeScrollViewContainer>
  );
}
