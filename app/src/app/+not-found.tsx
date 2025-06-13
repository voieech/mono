import { Image } from "expo-image";
import { Link, Stack } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "OOPS!" }} />
      <ThemedView
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <ThemedText type="subtitle">Oops sorry this does not exist!</ThemedText>
        <Image
          source={require("@/assets/images/404.svg")}
          style={{
            height: "50%",
            resizeMode: "contain",
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
          <ThemedText type="link">Go back home</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}
