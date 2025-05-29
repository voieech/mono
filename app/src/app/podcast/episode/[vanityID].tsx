import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AudioPlayerWithRNTP } from "@/components/AudioPlayerWithRNTP";

export default function Episode() {
  const router = useRouter();

  const apiBaseUrl = "https://api.voieech.com";
  const vanityID = useLocalSearchParams<{ vanityID: string }>().vanityID;
  const i18n = { locale: { value: "en" } };

  const {
    isPending,
    isError,
    data: episode,
    error,
  } = useQuery({
    queryKey: ["episode", vanityID, i18n.locale],
    async queryFn() {
      const res = await fetch(
        `${apiBaseUrl}/v1/episode/${vanityID}?lang=${i18n.locale.value}`
      );

      if (!res.ok) {
        if (res.status === 404) {
          router.replace("/+not-found");
        }

        const defaultErrorMessage = `Failed to load episode: ${vanityID}`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        throw new Error(errorMessage);
      }

      // return (await res.json()) as Episode;
      return await res.json();
    },
    retry: false,
  });

  if (isPending) {
    return (
      <ThemedView style={styles.container}>
        <Image
          source={loadingImageSource}
          style={styles.loadingImage}
          alt="Loading Image"
        />
        <ThemedText type="title">...loading...</ThemedText>
      </ThemedView>
    );
  }

  if (isError || episode === undefined) {
    return (
      <ThemedView>
        <ThemedText>Error: {error?.message}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        // @todo
        // 1. Replace this with the episode image?
        // 2. And only include this if the episode have an image, else just show
        // the text stuff...
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <Stack.Screen options={{ title: "Podcast Episode" }} />

      <ThemedView>
        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">{episode.title}</ThemedText>
          <ThemedText>{episode.description}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.stepContainer}>
          <ThemedText type="subtitle">Player</ThemedText>
          <AudioPlayerWithRNTP
            url={episode.audioPublicUrl}
            title={
              episode.episodeNumber
                ? `EP ${episode.episodeNumber}: ${episode.title}`
                : episode.title
            }
            audioLength={episode.audioLength}
            // @todo Only set this if it is a custom made track by someone else
            // artist={}
          />
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

// Generate 0-2 to randomly pick one of the gifs
const loadingImageSource = [
  require("@/assets/images/loading/1.webp"),
  require("@/assets/images/loading/2.gif"),
  require("@/assets/images/loading/3.gif"),
][Math.trunc(Math.random() * 3)];

const styles = StyleSheet.create({
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  container: {
    padding: "10%",
  },
  loadingImage: {
    height: "100%",
    resizeMode: "contain",
  },
});
