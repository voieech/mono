import { Trans } from "@lingui/react/macro";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  useWindowDimensions,
  Modal,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  SafeScrollViewContainer,
  ThemedView,
  OldThemedText,
  Icon,
  AudioPlayer,
} from "@/components";
import { useExperimentalSurfaceContext } from "@/context";
import { useActiveTrackWithMetadata } from "@/TrackPlayer";

export default function AudioPlayerModal() {
  const windowDimensions = useWindowDimensions();
  const activeTrack = useActiveTrackWithMetadata();
  const [modalVisible, setModalVisible] = useState(false);
  const useCardPlayerInsteadOfModal =
    useExperimentalSurfaceContext().getShowExperimentalSurface(
      "use-card-player-instead-of-modal",
    );
  const activeTrackArtist = activeTrack?.artist;
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
            <Icon
              name={
                useCardPlayerInsteadOfModal ? "chevron.left" : "chevron.down"
              }
              color="white"
            />
          </Pressable>
          <OldThemedText
            style={{
              textAlign: "center",
              width: windowDimensions.width * 0.6,
            }}
            numberOfLines={1}
          >
            {activeTrackArtist}
          </OldThemedText>
          <Pressable onPress={() => setModalVisible(true)}>
            <Icon name="ellipsis" color="white" />
          </Pressable>
        </ThemedView>
        <AudioPlayer />
      </GestureHandlerRootView>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: "white",
              borderRadius: 20,
              padding: 35,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text
              style={{
                marginBottom: 15,
                textAlign: "center",
              }}
            >
              <Trans>Made by {activeTrackArtist}</Trans>
            </Text>
            <Pressable
              style={{
                borderRadius: 20,
                padding: 10,
                elevation: 2,
                backgroundColor: "#2196F3",
              }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                <Trans>close</Trans>
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeScrollViewContainer>
  );
}
