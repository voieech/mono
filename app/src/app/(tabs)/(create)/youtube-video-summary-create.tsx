import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { router } from "expo-router";
import { useState } from "react";
import { View, Pressable, TextInput, useWindowDimensions } from "react-native";

import {
  SafeAreaViewContainer,
  ScrollViewContainer,
  ThemedText,
  FullScreenLoader,
} from "@/components";
import { Colors } from "@/constants";
import { useSettingContext } from "@/context";
import {
  useBottomTabOverflow,
  useSaveContentPreferenceSelectionMutation,
} from "@/hooks";

export default function YoutubeVideoSummaryCreate() {
  const windowDimensions = useWindowDimensions();
  const bottomOverflow = useBottomTabOverflow();
  const padding = 16;
  const floatingButtonPaddingBottom =
    (bottomOverflow > padding ? bottomOverflow : padding) + 16;

  const submitYoutubeVideoLinkMutation =
    useSaveContentPreferenceSelectionMutation();

  const _settingContext = useSettingContext();
  const [youtubeVideoLink, setYoutubeVideoLink] = useState("");
  const isYoutubeVideoLinkEntered = youtubeVideoLink !== "";

  async function submitYoutubeLink() {
    if (!isYoutubeVideoLinkEntered) {
      return;
    }

    // await submitYoutubeVideoLinkMutation.mutateAsync(youtubeVideoLink);
    router.back();
  }

  if (submitYoutubeVideoLinkMutation.isPending) {
    return <FullScreenLoader loadingMessage={msg`Saving`} />;
  }

  return (
    <SafeAreaViewContainer>
      <ScrollViewContainer>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingVertical: 32,
          }}
        >
          <View
            style={{
              marginBottom: 32,
            }}
          >
            <ThemedText
              type="xl-bold"
              style={{
                paddingBottom: 8,
              }}
            >
              <Trans>Youtube Video Summary Creator</Trans>
            </ThemedText>
            <ThemedText>
              <Trans>
                We will help you summarise your youtube video and create a audio
                podcast.
              </Trans>
            </ThemedText>
          </View>
          <View>
            <ThemedText
              style={{
                paddingBottom: 8,
              }}
            >
              <Trans>Please paste your Youtube link</Trans>
            </ThemedText>
            <TextInput
              placeholder="Youtube link"
              defaultValue={youtubeVideoLink}
              placeholderTextColor={Colors.neutral800}
              onChangeText={(s) => setYoutubeVideoLink(s)}
              onSubmitEditing={() => submitYoutubeLink()}
              style={{
                padding: 8,
                borderRadius: 8,
                fontSize: 20,
                backgroundColor: Colors.neutral300,
                color: Colors.sky700,
              }}
            />
          </View>
        </View>
      </ScrollViewContainer>
      <View
        style={{
          flex: 1,
          position: "absolute",
          bottom: floatingButtonPaddingBottom,
          width: "100%",
          paddingHorizontal: windowDimensions.width * 0.1,
        }}
      >
        <Pressable
          style={{
            backgroundColor: isYoutubeVideoLinkEntered
              ? Colors.blue600
              : Colors.gray400,
            paddingVertical: 8,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={submitYoutubeLink}
          disabled={
            isYoutubeVideoLinkEntered ||
            submitYoutubeVideoLinkMutation.isPending
          }
        >
          <ThemedText type="lg-light">
            <Trans>Create</Trans>
          </ThemedText>
        </Pressable>
      </View>
    </SafeAreaViewContainer>
  );
}
