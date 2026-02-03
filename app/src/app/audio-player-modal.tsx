import { Trans } from "@lingui/react/macro";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  SafeScrollViewContainer,
  ThemedView,
  ThemedText,
  Icon,
  AudioPlayer,
  CommonModal,
} from "@/components";
import { Colors } from "@/constants";
import { useExperimentalSurfaceContext } from "@/context";
import { useActiveTrackWithMetadata } from "@/TrackPlayer";

export default function AudioPlayerModal() {
  const windowDimensions = useWindowDimensions();
  const activeTrack = useActiveTrackWithMetadata();
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
              color={Colors.white}
            />
          </Pressable>
          <ThemedText
            numberOfLines={1}
            style={{
              textAlign: "center",
              width: windowDimensions.width * 0.6,
            }}
          >
            {activeTrack?.artist ?? ""}
          </ThemedText>
          <MoreMenuButtonAndModal activeTrackArtist={activeTrack?.artist} />
        </ThemedView>
        <AudioPlayer />
      </GestureHandlerRootView>
    </SafeScrollViewContainer>
  );
}

function MoreMenuButtonAndModal(props: { activeTrackArtist?: string }) {
  const { activeTrackArtist } = props;
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Pressable onPress={() => setModalVisible(true)}>
        <Icon name="ellipsis" color={Colors.white} />
      </Pressable>
      <CommonModal
        modalVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        {activeTrackArtist !== undefined && (
          <>
            <ThemedText type="lg-normal">
              <Trans>Track made by</Trans>
            </ThemedText>
            <ThemedText>{activeTrackArtist}</ThemedText>
          </>
        )}
      </CommonModal>
    </>
  );
}
