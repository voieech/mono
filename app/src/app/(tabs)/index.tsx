import { Image } from "expo-image";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { HelloWave } from "@/components/HelloWave";
import { ParallaxScrollView } from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { apiBaseUrl } from "@/constants/Api";
import { Channel, Episode } from "dto";

export default function HomeScreen() {
  const featuredChannelsQuery = useQuery({
    queryKey: ["podcast", "featured-channels"],
    async queryFn() {
      // ?lang=${i18n.locale.value}
      const res = await fetch(
        `${apiBaseUrl}/v1/landing-page/featured-channels/`
      );

      if (!res.ok) {
        const defaultErrorMessage = "Failed to load featured channels";
        const errorMessage = await res
          .json()
          .then((data) => data.error ?? defaultErrorMessage)
          .catch(() => defaultErrorMessage);
        throw new Error(errorMessage);
      }

      const channels = (await res.json()) as Array<Channel>;

      // Cache data so these dont need to be re queried again on navigate
      for (const channel of channels) {
        // queryClient.setQueryData(["podcast-channel", channel.id], channel);
      }

      return channels;
    },
    retry: false,
  });

  const featuredEpisodesQuery = useQuery({
    queryKey: ["podcast", "featured-episodes"],
    async queryFn() {
      // ?lang=${i18n.locale.value}
      const res = await fetch(
        `${apiBaseUrl}/v1/landing-page/featured-episodes/`
      );

      if (!res.ok) {
        const defaultErrorMessage = "Failed to load featured episodes";
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
        //   episode
        // );
      }

      return episodes;
    },
    retry: false,
  });

  return (
    <ParallaxScrollView
      headerImage={
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
      <ThemedView
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      {featuredChannelsQuery.data !== undefined && (
        <ThemedView
          style={{
            gap: 8,
            marginBottom: 8,
          }}
        >
          <ThemedText type="subtitle">Featured Channels</ThemedText>
          {featuredChannelsQuery.data.map((channel) => (
            <Link key={channel.id} href={`/podcast/channel/${channel.id}`}>
              <ThemedView
                style={{
                  borderRadius: 16,
                  flex: 1,
                  flexDirection: "row",
                }}
              >
                <Image
                  source={channel.img_url}
                  style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: 128,
                    borderTopLeftRadius: 16,
                    borderBottomLeftRadius: 16,
                  }}
                  contentFit="contain"
                />
                <ThemedView
                  style={{
                    padding: 16,
                    backgroundColor: "#3f3f46",
                  }}
                >
                  <ThemedText
                    style={{
                      paddingBottom: 2,
                      fontSize: 24,
                    }}
                  >
                    {channel.name}
                  </ThemedText>
                  <ThemedText
                    style={{
                      paddingBottom: 4,
                      fontSize: 12,
                    }}
                  >
                    {channel.description}
                  </ThemedText>
                  <ThemedText
                    style={{
                      fontSize: 12,
                    }}
                  >
                    {channel.category}, {channel.subcategory}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </Link>
          ))}
        </ThemedView>
      )}
      {featuredEpisodesQuery.data !== undefined && (
        <ThemedView
          style={{
            gap: 8,
            marginBottom: 8,
          }}
        >
          <ThemedText type="subtitle">Featured Episodes</ThemedText>
          {featuredEpisodesQuery.data.map((episode) => (
            <Link
              key={episode.id}
              href={`/podcast/episode/${episode.vanity_id}`}
            >
              <ThemedView
                style={{
                  backgroundColor: "#3f3f46",
                  borderRadius: 16,
                  flex: 1,
                  flexDirection: "row",
                  display: "flex",
                }}
              >
                {episode.img_url !== null && (
                  <Image
                    source={episode.img_url}
                    style={{
                      width: "100%",
                      height: "100%",
                      maxWidth: 128,
                      borderTopLeftRadius: 16,
                      borderBottomLeftRadius: 16,
                    }}
                    contentFit="contain"
                  />
                )}

                <ThemedView
                  style={{
                    padding: 16,
                    backgroundColor: "inherit",
                  }}
                >
                  <ThemedText
                    style={{
                      paddingBottom: 2,
                    }}
                    numberOfLines={2}
                  >
                    {episode.title}
                  </ThemedText>
                  <ThemedText
                    style={{
                      fontSize: 12,
                    }}
                  >
                    {episode.created_at.split("T")[0]}
                    {"\n"}
                    {Math.trunc(episode.audio_length / 60)} mins
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </Link>
          ))}
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}
