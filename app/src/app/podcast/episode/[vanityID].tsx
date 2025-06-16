import { Image } from "expo-image";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import {
  ParallaxScrollViewContainer,
  FullScreenLoader,
  ThemedView,
  ThemedText,
  AudioPlayer,
} from "@/components";
import { apiBaseUrl } from "@/constants";
import { Episode } from "dto";

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

      return (await res.json()) as Episode;
    },
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
    <ParallaxScrollViewContainer
      headerHeightUseWidth={true}
      headerImage={
        episode.img_url !== null && (
          <ThemedView
            style={{
              // Set a width that is as wide as most devices, then let maxWidth
              // constrain it to the "screen - horizontal padding"
              width: 500,
              maxWidth: "100%",
              alignSelf: "center",

              paddingBottom: 16,
            }}
          >
            <Image
              source={episode.img_url}
              style={{
                aspectRatio: 1,
              }}
              contentFit="contain"
            />
          </ThemedView>
        )
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
              episode.episode_number
                ? `EP ${episode.episode_number}: ${episode.title}`
                : episode.title
            }
            audioLength={episode.audio_length}
            // @todo Only set this if it is a custom made track by someone else
            // artist={}
          />
        </ThemedView>
      </ThemedView>
    </ParallaxScrollViewContainer>
  );
}
