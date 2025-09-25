import { Trans } from "@lingui/react/macro";
import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView, ThemedText } from "@/components";

export default function NotFoundScreen() {
  return (
    <ThemedView
      style={{
        flex: 1,
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          padding: 32,
          justifyContent: "center",
        }}
      >
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <ThemedText
          type="title"
          style={{
            paddingBottom: 16,
          }}
        >
          Oops Sorry!
        </ThemedText>
        <ThemedText>
          <Trans>
            We can&apos;t find what you want, here&apos;s is a drawing of us
            being very sorry and sad...
          </Trans>
        </ThemedText>
        <Image
          source={require("@/assets/images/404.png")}
          style={{
            width: "100%",
            aspectRatio: 1,
          }}
          alt="Not Found Image"
        />
        <Link
          href="/"
          style={{
            marginTop: 15,
            paddingVertical: 15,
          }}
          replace
        >
          <ThemedText type="link" style={{ fontSize: 24 }}>
            <Trans>Go back Home</Trans>
          </ThemedText>
        </Link>
      </SafeAreaView>
    </ThemedView>
  );
}
