import { Image } from "expo-image";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import {
  ParallaxScrollViewContainer,
  FullScreenLoader,
  ThemedView,
  ThemedText,
} from "@/components";
import { apiBaseUrl } from "@/constants";
import type { Channel, Episode } from "dto";

export default function PodcastChannel() {
  const router = useRouter();
  const channelID = useLocalSearchParams<{ channelID: string }>().channelID;

  const podcastChannelQuery = useQuery({
    queryKey: ["podcast", "channel", channelID],
    async queryFn() {
      const res = await fetch(`${apiBaseUrl}/v1/podcast/channel/${channelID}`);

      if (!res.ok) {
        if (res.status === 404) {
          router.replace("/+not-found");
        }

        const defaultErrorMessage = `Failed to load channel: ${channelID}`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        throw new Error(errorMessage);
      }

      return (await res.json()) as Channel;
    },
  });

  const podcastChannelEpisodesQuery = useQuery({
    queryKey: ["podcast", "channel-episodes", channelID],
    async queryFn() {
      const res = await fetch(
        `${apiBaseUrl}/v1/podcast/channel/episodes/${channelID}`
      );

      if (!res.ok) {
        if (res.status === 404) {
          router.replace("/+not-found");
        }

        const defaultErrorMessage = `Failed to load channel episodes: ${channelID}`;
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        throw new Error(errorMessage);
      }

      const episodes = (await res.json()) as Array<Episode>;

      // Cache data so these dont need to be re queried again on navigate
      for (const episode of episodes) {
        // queryClient.setQueryData(
        //   ["podcast-episode", "vanityID", episode.vanity_id],
        //   episode,
        // );
      }

      return episodes;
    },
  });

  if (podcastChannelQuery.isPending) {
    return <FullScreenLoader />;
  }

  if (podcastChannelQuery.isError || podcastChannelQuery.data === undefined) {
    return (
      <ThemedView>
        <ThemedText>Error: {podcastChannelQuery.error.message}</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ParallaxScrollViewContainer
      headerHeightUseWidth={true}
      headerImage={
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
            source={podcastChannelQuery.data.img_url}
            style={{
              aspectRatio: 1,
            }}
            contentFit="contain"
          />
        </ThemedView>
      }
    >
      <ThemedText type="title">{podcastChannelQuery.data.name}</ThemedText>
      <ThemedText>{podcastChannelQuery.data.description}</ThemedText>
      {!podcastChannelEpisodesQuery.isLoading &&
        !podcastChannelEpisodesQuery.isError &&
        podcastChannelEpisodesQuery.data !== undefined && (
          <>
            <ThemedText
              style={{
                paddingTop: 20,
                paddingBottom: 8,
                fontSize: 20,
              }}
              type="subtitle"
            >
              Featured
            </ThemedText>
            {podcastChannelEpisodesQuery.data.map((episode) => (
              <Link
                key={episode.id}
                href={{
                  pathname: "/podcast/episode/[vanityID]",
                  params: {
                    vanityID: episode.vanity_id,
                  },
                }}
                style={{
                  marginBottom: 16,
                }}
              >
                <ThemedView
                  style={{
                    padding: 16,
                    borderRadius: 16,
                    backgroundColor: "#3f3f46",
                  }}
                >
                  {/* @todo Add episode image */}
                  <ThemedText>{episode.created_at.split("T")[0]}</ThemedText>
                  <ThemedText numberOfLines={3}>{episode.title}</ThemedText>
                  <ThemedText>
                    {Math.trunc(episode.audio_length / 60)} mins
                  </ThemedText>
                </ThemedView>
              </Link>
            ))}
          </>
        )}
    </ParallaxScrollViewContainer>
  );
}
