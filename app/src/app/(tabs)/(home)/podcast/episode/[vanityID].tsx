import { Trans } from "@lingui/react/macro";
import { Image } from "expo-image";
import { useLocalSearchParams, Redirect } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";
import RNTPTrackPlayer, {
  State as PlayerState,
  usePlaybackState,
} from "react-native-track-player";

import {
  ParallaxScrollViewContainer,
  SafeScrollViewContainer,
  FullScreenLoader,
  ThemedView,
  ThemedText,
  CircularPlayButton,
  CircularPauseButton,
} from "@/components";
import { NotFoundError } from "@/errors";
import { usePodcastEpisode, useActiveTrackWithMetadata } from "@/hooks";
import { createTrackWithMetadata, TrackPlayer } from "@/utils";

export default function PodcastEpisode() {
  const vanityID = useLocalSearchParams<{ vanityID: string }>().vanityID;

  const {
    isPending,
    isError,
    data: episode,
    error,
  } = usePodcastEpisode(vanityID);

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
      await RNTPTrackPlayer.load(
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
          locale: episode.language,
        }),
      );

      await TrackPlayer.play();
    },
    [episode, isCurrentEpisodeTheActiveTrack],
  );

  const playerState = usePlaybackState().state;

  if (isPending) {
    return <FullScreenLoader />;
  }

  if (isError || episode === undefined) {
    if (error instanceof NotFoundError) {
      return <Redirect href="/+not-found" />;
    }

    return (
      <SafeScrollViewContainer>
        <ThemedText>Error: {error?.message}</ThemedText>
      </SafeScrollViewContainer>
    );
  }

  const episodeSeasonNumber = episode.season_number;
  const episodeNumber = episode.episode_number;
  const episodeLengthInMins = Math.trunc(episode.audio_length / 60);

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
          alignItems: "center",
        }}
      >
        <ThemedText
          style={{
            fontSize: 14,
            lineHeight: 20,
          }}
        >
          <Trans>
            Season {episodeSeasonNumber}, Episode {episodeNumber}
          </Trans>
          {"\n"}
          {episode.created_at.split("T")[0]}
          {"\n"}
          <Trans>{episodeLengthInMins} mins</Trans>
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
