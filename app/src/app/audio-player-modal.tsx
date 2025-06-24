import { router } from "expo-router";
import { Pressable, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
      {/*
        Need to wrap again even though root layout wraps it because on android
        modal's it doesnt inherit from root layout and acts as an independent
        component tree, so it needs this extra wrapping. It is also ok to have
        duplicate wrappings as it will just be ignored on IOS/etc...
      */}
      <GestureHandlerRootView
        style={{
          flex: 1,
        }}
      >
        <ThemedView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            onPress={() => router.dismissTo(router.canGoBack() ? ".." : "/")}
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
          <Pressable
            onPress={() => {
              //
            }}
          >
            <Icon name="ellipsis" color="white" />
          </Pressable>
        </ThemedView>
        <AudioPlayer />
      </GestureHandlerRootView>
    </SafeScrollViewContainer>
  );
}
