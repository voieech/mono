import type { Episode } from "dto";

import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";
import TrackPlayer, {
  State as PlayerState,
  usePlaybackState,
} from "react-native-track-player";

import {
  ParallaxScrollViewContainer,
  FullScreenLoader,
  ThemedView,
  ThemedText,
  CircularPlayButton,
  CircularPauseButton,
} from "@/components";
import { apiBaseUrl } from "@/constants";
import { useActiveTrackWithMetadata } from "@/hooks";
import { createTrackWithMetadata } from "@/utils";

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

  const activeTrack = useActiveTrackWithMetadata();

  // Making the assumption that titles are unique
  const isCurrentEpisodeTheActiveTrack =
    episode !== undefined &&
    activeTrack !== undefined &&
    episode.id === activeTrack.id;

  const playEpisode = useCallback(
    async function () {
      // Should not happen since UI wont be shown until episode is loaded
      if (episode === undefined) {
        return;
      }

      // If current episode is the active track, just continue playing
      if (isCurrentEpisodeTheActiveTrack) {
        await TrackPlayer.play();
        return;
      }

      // If there is a track queue already, replace the current track with this,
      // else, create a new queue and add this as the new current active track.
      await TrackPlayer.load(
        createTrackWithMetadata({
          trackType: "podcast_episode",
          id: episode.id,
          episode,

          // Artist is always voieech for pre-generated podcasts, will be
          // different if it is user generated content in the future.
          artist: "voieech.com",
          url: episode.audio_public_url,
          title: episode.title,
          duration: episode.audio_length,
          artwork: episode.img_url,
        })
      );

      await TrackPlayer.play();
    },
    [episode, isCurrentEpisodeTheActiveTrack]
  );

  const playerState = usePlaybackState().state;

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
      }
    >
      <ThemedText type="subtitle">{episode.title}</ThemedText>
      {/* @todo Add link back to the channel page */}
      <ThemedView
        style={{
          paddingVertical: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "center",
        }}
      >
        <ThemedText
          style={{
            fontSize: 14,
            lineHeight: 20,
          }}
        >
          Season {episode.season_number}, Episode {episode.episode_number}
          {"\n"}
          {episode.created_at.split("T")[0]}
          {"\n"}
          {Math.trunc(episode.audio_length / 60)} mins
        </ThemedText>
        {/*
          Even if player is not paused, i.e. it is loading or whatever show the
          play symbol to prevent fast flashing when changing from loading (or
          any other) state to paused state.
        */}
        {isCurrentEpisodeTheActiveTrack &&
        playerState === PlayerState.Playing ? (
          <CircularPauseButton
            onPress={TrackPlayer.pause}
            innerIconSize={24}
            outerBackgroundSize={8}
          />
        ) : (
          <CircularPlayButton
            onPress={playEpisode}
            innerIconSize={24}
            outerBackgroundSize={8}
          />
        )}
      </ThemedView>
      <View
        style={{
          borderTopColor: "#777",
          borderTopWidth: 0.5,
          paddingBottom: 20,
        }}
      />
      <ThemedText>{episode.description}</ThemedText>
    </ParallaxScrollViewContainer>
  );
}
