import { Trans, Plural } from "@lingui/react/macro";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, useWindowDimensions, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TrackPlayer from "react-native-track-player";

import {
  SafeScrollViewContainer,
  ThemedView,
  ThemedText,
  Icon,
} from "@/components";
import { useExperimentalSurfaceContext } from "@/context";
import { usePlayerQueue } from "@/hooks";

export default function TrackQueueModal() {
  const windowDimensions = useWindowDimensions();
  const queue = usePlayerQueue();
  const queueLength = queue.length;
  const useCardPlayerInsteadOfModal =
    useExperimentalSurfaceContext().getShowExperimentalSurface(
      "use-card-player-instead-of-modal",
    );
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
            flex: 1,
          }}
        >
          <ThemedView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingBottom: 16,
              flex: 1,
            }}
          >
            <Pressable
              onPress={() => router.dismissTo(router.canGoBack() ? ".." : "/")}
            >
              <Icon
                name={
                  useCardPlayerInsteadOfModal ? "chevron.left" : "chevron.down"
                }
                color="white"
              />
            </Pressable>
            <ThemedText
              style={{
                textAlign: "center",
                width: windowDimensions.width * 0.6,
              }}
            >
              <Plural
                value={queueLength}
                _0="Player Queue"
                other="Player Queue (#)"
              />
            </ThemedText>
            <Pressable
              onPress={() => {
                TrackPlayer.removeUpcomingTracks();
              }}
            >
              <Icon name="trash" color="white" />
            </Pressable>
          </ThemedView>
          {queue.length === 0 && (
            <ThemedView
              style={{
                flex: 1,
              }}
            >
              <ThemedText
                style={{
                  textAlign: "center",
                }}
              >
                <Trans>Nothing left in Queue!</Trans>
                {/* @todo Show a graphic + a button to get random reccomendation to start playing */}
              </ThemedText>
            </ThemedView>
          )}
          {queue.map((track) => (
            <View
              key={track.id}
              style={{
                marginBottom: 8,
              }}
            >
              <Pressable
                onPress={() => {
                  // @todo
                }}
              >
                <ThemedView
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    borderRadius: 16,
                  }}
                >
                  <Image
                    source={track.episode.img_url}
                    style={{
                      width: "100%",
                      height: "100%",
                      maxWidth: 128,
                      borderTopLeftRadius: 16,
                      borderBottomLeftRadius: 16,
                    }}
                    contentFit="cover"
                  />
                  <ThemedView
                    style={{
                      flex: 1,
                      borderTopRightRadius: 16,
                      borderBottomRightRadius: 16,
                      padding: 12,
                      backgroundColor: "#3f3f46",
                    }}
                  >
                    <ThemedText numberOfLines={3}>
                      {track.episode.title}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
              </Pressable>
            </View>
          ))}
        </ThemedView>
      </GestureHandlerRootView>
    </SafeScrollViewContainer>
  );
}
