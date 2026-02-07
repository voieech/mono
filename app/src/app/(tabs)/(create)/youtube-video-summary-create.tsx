import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import { useState } from "react";
import { View, Pressable, TextInput } from "react-native";

import {
  SafeScrollViewContainer,
  ThemedText,
  FullScreenLoader,
  VerticalSpacer,
} from "@/components";
import { Colors } from "@/constants";
import {
  useYoutubeVideoOEmbedMetadataQuery,
  useCreateYoutubeVideoSummaryMutation,
} from "@/hooks";
import { toast } from "@/utils";

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
  const createYoutubeVideoSummaryMutation =
    useCreateYoutubeVideoSummaryMutation();

  const [youtubeVideoLink, setYoutubeVideoLink] = useState("");

  const isYoutubeVideoLinkEntered = youtubeVideoLink !== "";
  const youtubeVideoID = validateAndExtractYoutubeUrlVideoID(youtubeVideoLink);
  const isYoutubeVideoIDValid = youtubeVideoID !== undefined;

  async function submitYoutubeLink() {
    if (!isYoutubeVideoLinkEntered || !isYoutubeVideoIDValid) {
      return;
    }

    await createYoutubeVideoSummaryMutation.mutateAsync(youtubeVideoID);

    setYoutubeVideoLink("");

    toast(msg`Submitted!`);
  }

  if (createYoutubeVideoSummaryMutation.isPending) {
    return <FullScreenLoader loadingMessage={msg`Saving`} />;
  }

  return (
    <SafeScrollViewContainer>
      <View
        style={{
          paddingHorizontal: 24,
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
        <VerticalSpacer />
        <View
          style={{
            alignItems: "flex-end",
          }}
        >
          {youtubeVideoLink === "" ? (
            <Pressable
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: Colors.blue600,
              }}
              onPress={() =>
                Clipboard.getStringAsync().then((text) =>
                  setYoutubeVideoLink(text),
                )
              }
            >
              <ThemedText>
                <Trans>Paste from clipboard</Trans>
              </ThemedText>
            </Pressable>
          ) : (
            <Pressable
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: Colors.neutral600,
              }}
              onPress={() => setYoutubeVideoLink("")}
            >
              <ThemedText>
                <Trans>Clear</Trans>
              </ThemedText>
            </Pressable>
          )}
        </View>
        {isYoutubeVideoIDValid && (
          <YoutubeVideoPreview youtubeVideoID={youtubeVideoID} />
        )}
        {isYoutubeVideoIDValid && (
          <Pressable
            style={{
              backgroundColor: Colors.blue600,
              marginTop: 24,
              paddingVertical: 8,
              borderRadius: 8,
              alignItems: "center",
            }}
            onPress={submitYoutubeLink}
            disabled={createYoutubeVideoSummaryMutation.isPending}
          >
            <ThemedText type="lg-light">
              <Trans>Create</Trans>
            </ThemedText>
          </Pressable>
        )}
      </View>
    </SafeScrollViewContainer>
  );
}

function YoutubeVideoPreview(props: {
  /**
   * This should already be validated
   */
  youtubeVideoID: string;
}) {
  const youtubeVideoOEmbedMetadataQuery = useYoutubeVideoOEmbedMetadataQuery(
    props.youtubeVideoID,
  );

  if (youtubeVideoOEmbedMetadataQuery.isLoading) {
    return (
      <ThemedText>
        <Trans>... loading video ...</Trans>
      </ThemedText>
    );
  }

  if (
    youtubeVideoOEmbedMetadataQuery.isError ||
    youtubeVideoOEmbedMetadataQuery.data === undefined
  ) {
    return (
      <ThemedText
        customColors={{
          dark: Colors.red500,
        }}
      >
        <Trans>Failed to load video!</Trans>
      </ThemedText>
    );
  }

  const youtubeVideoTitle = youtubeVideoOEmbedMetadataQuery.data.title;
  const youtubeVideoCreatorName =
    youtubeVideoOEmbedMetadataQuery.data.author_name;

  /**
   * There is 2 ways to get the video thumbnail. Either hardcoding to the URL
   * and getting a fixed 16/9 aspect ratio image or a dynamic one from the
   * OEmbed metadata, which uses a downscaled and resized 4/3 aspect ratio,
   * which will always include upper and bottom black bars in the image.
   *
   * Temporarily using hardcoded one with this boolean flag to not have the bars
   */
  const useHardcodedThumbnailInsteadOfOEmbedThumbnail = true;

  return (
    <View>
      <VerticalSpacer />
      {useHardcodedThumbnailInsteadOfOEmbedThumbnail ? (
        <Image
          source={`https://img.youtube.com/vi/${props.youtubeVideoID}/mqdefault.jpg`}
          style={{
            width: "100%",
            aspectRatio: 16 / 9,
          }}
          contentFit="contain"
        />
      ) : (
        <Image
          source={youtubeVideoOEmbedMetadataQuery.data.thumbnail_url}
          style={{
            width: "100%",
            aspectRatio:
              youtubeVideoOEmbedMetadataQuery.data.thumbnail_width /
              youtubeVideoOEmbedMetadataQuery.data.thumbnail_height,
          }}
          contentFit="contain"
        />
      )}
      <VerticalSpacer />
      <ThemedText type="lg-light">{youtubeVideoTitle}</ThemedText>
      <VerticalSpacer />
      <ThemedText type="sm-normal" colorType="subtext">
        {youtubeVideoCreatorName}
      </ThemedText>
    </View>
  );
}
