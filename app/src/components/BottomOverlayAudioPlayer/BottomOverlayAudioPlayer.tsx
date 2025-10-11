import { useRouter } from "expo-router";
import { useRef } from "react";
import { Pressable, View, Text, useWindowDimensions } from "react-native";
import {
  State as PlayerState,
  usePlaybackState,
} from "react-native-track-player";

import { Icon } from "@/components/provided";
import { useTrackPlayer, useExperimentalSurfaceContext } from "@/context";
import { useActiveTrackWithMetadata } from "@/hooks";

import { BottomOverlayAudioPlayerProgessBar } from "./BottomOverlayAudioPlayerProgessBar";

export function BottomOverlayAudioPlayer(props: { tabBarHeight: number }) {
  const startY = useRef(0);
  const { width } = useWindowDimensions();
  const trackPlayer = useTrackPlayer();
  const activeTrack = useActiveTrackWithMetadata();
  const playerState = usePlaybackState().state;
  const router = useRouter();
  const useCardPlayerInsteadOfModal =
    useExperimentalSurfaceContext().getShowExperimentalSurface(
      "use-card-player-instead-of-modal",
    );

  // Only if there is no active track do we disable the overlay
  if (activeTrack === undefined) {
    return null;
  }

  return (
    <Pressable
      onPress={() => {
        router.push("/audio-player-modal");
      }}
      // Use these to implement open modal on swipe up
      onPressIn={(evt) => (startY.current = evt.nativeEvent.pageY)}
      onPressOut={(evt) => {
        // Disable when using card/page style UI for audio player
        if (useCardPlayerInsteadOfModal) {
          return;
        }

        // Small threshold since the overlay is small, so we can detect any
        // swipe ups as a swipe up motion
        const swipeUpPixelTriggerThreshold = 1;
        const endY = evt.nativeEvent.pageY;
        const swipePixelDelta = startY.current - endY;
        if (swipePixelDelta > swipeUpPixelTriggerThreshold) {
          router.push("/audio-player-modal");
        }
      }}
    >
      {/*
        @todo
        Alternative modal implementation instead of relying on router modal
        the problem with this is that using "SafeScrollViewContainer" in another
        "SafeScrollViewContainer" will cause the safe area view to not work, and
        we would also need to implement our own gesture control for closing the
        modal, but the end state would probably be better since it will avoid
        the modal switching bug.
      */}
      {/* <SafeScrollViewContainer>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <AudioPlayerModal onClose={() => setModalVisible(false)} />
        </Modal>
      </SafeScrollViewContainer> */}

      <View
        style={{
          flex: 1,
          padding: 8,

          // Hover over the bottom nav tab bar
          position: "absolute",
          bottom: props.tabBarHeight,
          left: 0,
          width,
        }}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: 8,
            backgroundColor: "#3f3f46",
            borderRadius: 8,
          }}
        >
          <View
            style={{
              flex: 1,
              paddingVertical: 10,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                // Only allow words section to be at most 75% of device width
                maxWidth: width - width * 0.25,
              }}
            >
              <Text
                style={{
                  color: "white",
                }}
                numberOfLines={1}
              >
                {activeTrack.title}
              </Text>
              <Text
                style={{
                  color: "white",
                }}
                numberOfLines={1}
              >
                {activeTrack.artist}
              </Text>
            </View>
            <View
              style={{
                paddingRight: 8,
              }}
            >
              {/*
                Even if player is not paused, i.e. it is loading or whatever show the
                play symbol to prevent fast flashing when changing from loading (or
                any other) state to paused state.
              */}
              {playerState === PlayerState.Playing ? (
                <Pressable onPress={trackPlayer.pause}>
                  <Icon
                    name="pause.fill"
                    color="white"
                    size={24}
                    style={{
                      height: "100%",
                    }}
                  />
                </Pressable>
              ) : (
                <Pressable onPress={trackPlayer.play}>
                  <Icon
                    name="play.fill"
                    color="white"
                    size={24}
                    style={{
                      height: "100%",
                    }}
                  />
                </Pressable>
              )}
            </View>
          </View>
          <View
            style={{
              height: 2,
              backgroundColor: "#71717b",
              width: "100%",
            }}
          >
            <BottomOverlayAudioPlayerProgessBar />
          </View>
        </View>
      </View>
    </Pressable>
  );
}
