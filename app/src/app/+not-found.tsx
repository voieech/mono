import { Image } from "expo-image";
import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "OOPS!" }} />
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle">Oops sorry this does not exist!</ThemedText>
        <Image
          source={require("@/assets/images/404.svg")}
          style={styles.notFoundImage}
          alt="Not Found Image"
        />
        <Link href="/" style={styles.link} replace>
          <ThemedText type="link">Go back home</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  notFoundImage: {
    height: "50%",
    resizeMode: "contain",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
