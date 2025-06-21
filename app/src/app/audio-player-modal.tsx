import { router } from "expo-router";
import { Pressable, useWindowDimensions } from "react-native";

import {
  SafeScrollViewContainer,
  ThemedView,
  ThemedText,
  Icon,
  AudioPlayer,
} from "@/components";
import { useActiveTrackWithMetadata } from "@/hooks";

export default function AudioPlayerModal() {
  const windowDimensions = useWindowDimensions();
  const activeTrack = useActiveTrackWithMetadata();
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
          <Icon name="chevron.down" color="white" />
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
        <Icon name="ellipsis" color="white" />
      </ThemedView>
      <AudioPlayer />
    </SafeScrollViewContainer>
  );
}
