import { Trans } from "@lingui/react/macro";
import { Link } from "expo-router";
import { useFeatureFlag } from "posthog-react-native";

import { ParallaxScrollViewContainer, ThemedText, Icon } from "@/components";
import { Colors } from "@/constants";

export default function Settings() {
  const isInternalUser = useFeatureFlag("internal");
  return (
    <ParallaxScrollViewContainer
      headerImage={
        <Icon
          size={360}
          color={Colors.gray300}
          name="gear"
          style={{
            bottom: -120,
            left: -80,
            position: "absolute",
          }}
        />
      }
      innerContentStyle={{
        padding: 32,
        gap: 16,
      }}
    >
      <ThemedText type="xl-bold">
        <Trans>Settings</Trans>
      </ThemedText>

      <Link
        href={{
          pathname: "/settings/audio-playback",
        }}
      >
        <ThemedText>Audio Playback</ThemedText>
      </Link>

      <Link
        href={{
          pathname: "/settings/content-language",
        }}
      >
        <ThemedText>Content Language</ThemedText>
      </Link>

      {(__DEV__ || isInternalUser) && (
        <Link
          href={{
            pathname: "/settings/personalisation",
          }}
        >
          <ThemedText>Personalisation</ThemedText>
        </Link>
      )}

      <Link
        href={{
          pathname: "/settings/app-details",
        }}
      >
        <ThemedText>App Details</ThemedText>
      </Link>

      {(__DEV__ || isInternalUser) && (
        <Link
          href={{
            pathname: "/settings/internal",
          }}
        >
          <ThemedText>Internal</ThemedText>
        </Link>
      )}
    </ParallaxScrollViewContainer>
  );
}
