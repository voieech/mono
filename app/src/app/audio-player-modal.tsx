import { Trans } from "@lingui/react/macro";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  SafeScrollViewContainer,
  ThemedView,
  ThemedText,
  ThemedLink,
  Icon,
  AudioPlayer,
  CommonModal,
  VerticalSpacer,
  InAppBrowserLink,
} from "@/components";
import { Colors } from "@/constants";
import { useExperimentalSurfaceContext } from "@/context";
import { useActiveTrackWithMetadata } from "@/TrackPlayer";
import { supportFormLinkPrefillContent } from "@/utils";

export default function AudioPlayerModal() {
  const windowDimensions = useWindowDimensions();
  const activeTrack = useActiveTrackWithMetadata();
  const useCardPlayerInsteadOfModal =
    useExperimentalSurfaceContext().getShowExperimentalSurface(
      "use-card-player-instead-of-modal",
    );

  if (activeTrack === undefined) {
    return null;
  }

  return (
    <SafeScrollViewContainer
      // Custom pull down to close implementation because of the bug "multiple
      // native modal UI overlayed causes crashes".
      // This triggers close when pulled down for more than -40 pixels.
      onScroll={(event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY < -40) {
          router.back();
        }
      }}
    >
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
          <MoreMenuButtonAndModal
            trackID={activeTrack.id}
            activeTrackArtist={activeTrack?.artist}
          />
        </ThemedView>
        <AudioPlayer />
      </GestureHandlerRootView>
    </SafeScrollViewContainer>
  );
}

function MoreMenuButtonAndModal(props: {
  trackID: string;
  activeTrackArtist?: string;
}) {
  const { activeTrackArtist } = props;
  const [modalVisible, setModalVisible] = useState(false);
  const supportFormLink = supportFormLinkPrefillContent(
    `PLEASE DO NOT REMOVE THE PREFILLED AUDIO TRACK ID!\n\nI would like to report audio track "${props.trackID}"\n\nBecause ...`,
  );
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
            <VerticalSpacer />
          </>
        )}
        <InAppBrowserLink href={supportFormLink}>
          <ThemedLink>
            <Trans>Report Audio Track</Trans>
          </ThemedLink>
        </InAppBrowserLink>
      </CommonModal>
    </>
  );
}
