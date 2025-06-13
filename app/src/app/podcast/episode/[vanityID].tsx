import { Image } from "expo-image";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { AudioPlayer } from "@/components/AudioPlayer/AudioPlayer";
import { apiBaseUrl } from "@/constants/Api";

export default function PodcastEpisode() {
  const router = useRouter();
  const vanityID = useLocalSearchParams<{ vanityID: string }>().vanityID;

  const {
    isPending,
    isError,
    data: episode,
    error,
  } = useQuery({
    queryKey: ["episode", vanityID],
    async queryFn() {
      const res = await fetch(`${apiBaseUrl}/v1/podcast/episode/${vanityID}`);

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
    return <FullScreenLoader />;
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
        // Replace this with the episode image if available
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={{
            height: 178,
            width: 290,
            bottom: 0,
            left: 0,
            position: "absolute",
          }}
        />
      }
    >
      <Stack.Screen options={{ title: "Podcast Episode" }} />

      <ThemedView>
        <ThemedView
          style={{
            gap: 8,
            marginBottom: 8,
          }}
        >
          <ThemedText type="subtitle">{episode.title}</ThemedText>
          <ThemedText>{episode.description}</ThemedText>
        </ThemedView>

        <ThemedView
          style={{
            gap: 8,
            marginBottom: 8,
          }}
        >
          <AudioPlayer
            url={episode.audio_public_url}
            title={
              episode.episodeNumber
                ? `EP ${episode.episode_number}: ${episode.title}`
                : episode.title
            }
            audioLength={episode.audio_length}
            // @todo Only set this if it is a custom made track by someone else
            // artist={}
          />
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}
