import { Trans } from "@lingui/react/macro";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { View } from "react-native";

import {
  FullScreenSigninWall,
  SafeScrollViewContainer,
  ThemedView,
  ThemedText,
  InAppBrowserLink,
} from "@/components";
import { Colors } from "@/constants";
import { envVar } from "@/utils";

export default function CreateTabHomeScreen() {
  return (
    <>
      <FullScreenSigninWall />
      <SafeScrollViewContainer>
        <ThemedView
          style={{
            flexDirection: "column",
            rowGap: 4,
            paddingBottom: 40,
          }}
        >
          <ThemedText type="lg-normal">
            <Trans>Create your own content</Trans>
          </ThemedText>
          <ThemedText type="base-light">
            <Trans>
              Pick a content source to start creating content in your own style!
            </Trans>
          </ThemedText>
        </ThemedView>
        <ThemedView
          style={{
            flexDirection: "column",
            rowGap: 24,
          }}
        >
          <Link
            href={{
              pathname: "/(tabs)/(create)/youtube-video-summary-create",
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
                source={require("@/assets/images/content-sources/youtube.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: 128,
                  borderTopLeftRadius: 16,
                  borderBottomLeftRadius: 16,
                  backgroundColor: Colors.white,
                }}
                contentFit="cover"
              />
              <ThemedView
                style={{
                  flex: 1,
                  borderTopRightRadius: 16,
                  borderBottomRightRadius: 16,
                  paddingVertical: 24,
                  paddingHorizontal: 16,
                  rowGap: 8,
                  backgroundColor: Colors.neutral800,
                }}
              >
                <ThemedText type="lg-normal">
                  <Trans>YouTube</Trans>
                </ThemedText>
                <ThemedText numberOfLines={3}>
                  <Trans>
                    Summarise a YouTube video into a podcast episode.
                  </Trans>
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </Link>
          <InAppBrowserLink href={envVar.contentSourceFeedbackLink}>
            <ThemedView
              style={{
                flex: 1,
                flexDirection: "row",
                borderRadius: 16,
              }}
            >
              <Image
                source={require("@/assets/images/content-sources/coming-soon.jpg")}
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: 128,
                  borderTopLeftRadius: 16,
                  borderBottomLeftRadius: 16,
                  backgroundColor: Colors.white,
                }}
                contentFit="cover"
              />
              <ThemedView
                style={{
                  flex: 1,
                  borderTopRightRadius: 16,
                  borderBottomRightRadius: 16,
                  paddingVertical: 24,
                  paddingHorizontal: 16,
                  rowGap: 8,
                  backgroundColor: Colors.neutral800,
                }}
              >
                <ThemedText type="lg-normal">
                  <Trans>Want more?</Trans>
                </ThemedText>
                <ThemedText numberOfLines={3}>
                  <Trans>
                    Tell us what other content sources you would like us to add!
                  </Trans>
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </InAppBrowserLink>
        </ThemedView>
        <View
          style={{
            paddingBottom: 64,
          }}
        />
      </SafeScrollViewContainer>
    </>
  );
}
