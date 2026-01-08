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

/**
 * Validates a YouTube URL and optionally returns the Video ID.
 * Matches: youtube.com, youtu.be, m.youtube.com, and youtube.com
 */
function validateAndExtractYoutubeUrlVideoID(url: string) {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})(?:\S+)?$/,
  );
  // match[1] contains the first capturing group: the 11-character ID
  return match === null ? undefined : match[1];
}

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
  const youtubeVideoID = validateAndExtractYoutubeUrlVideoID(youtubeVideoLink);
  const isYoutubeVideoIDValid = youtubeVideoID !== undefined;

  async function submitYoutubeLink() {
    if (!isYoutubeVideoLinkEntered || !isYoutubeVideoIDValid) {
      return;
    }

    // await submitYoutubeVideoLinkMutation.mutateAsync(youtubeVideoID);
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
            {isYoutubeVideoLinkEntered && !isYoutubeVideoIDValid && (
              <ThemedText
                style={{
                  padding: 4,
                  color: Colors.red400,
                  textAlign: "right",
                }}
              >
                <Trans>Invalid Youtube link</Trans>
              </ThemedText>
            )}
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
            backgroundColor: isYoutubeVideoIDValid
              ? Colors.blue600
              : Colors.gray400,
            paddingVertical: 8,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={submitYoutubeLink}
          disabled={
            !isYoutubeVideoIDValid || submitYoutubeVideoLinkMutation.isPending
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
