import { View, Text, Pressable, useWindowDimensions } from "react-native";
import TrackPlayer, {
  State as PlayerState,
  usePlaybackState,
  useProgress,
  useActiveTrack,
} from "react-native-track-player";

import { IconSymbol } from "@/components/provided";

export function PlayerOverlay(props: { tabBarHeight: number }) {
  const { width } = useWindowDimensions();
  const track = useActiveTrack();
  const playerState = usePlaybackState().state;

  // Only if there is no active track do we disable the overlay
  if (track === undefined) {
    return null;
  }

  return (
    // @todo open full player on pressing
    <View
      style={{
        flex: 1,
        padding: 8,

        // Hover over the bottom nav tab bar
        position: "absolute",
        bottom: props.tabBarHeight,
        left: 0,
        width,
      }}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 8,
          backgroundColor: "#3f3f46",
          borderRadius: 8,
        }}
      >
        <View
          style={{
            flex: 1,
            paddingVertical: 10,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
          }}
        >
          <View
            style={{
              // Only allow words section to be at most 75% of device width
              maxWidth: width - width * 0.25,
            }}
          >
            <Text
              style={{
                color: "white",
              }}
              numberOfLines={1}
            >
              {track.title}
            </Text>
            <Text
              style={{
                color: "white",
              }}
              numberOfLines={1}
            >
              {track.artist}
            </Text>
          </View>
          <View
            style={{
              paddingRight: 8,
            }}
          >
            <Pressable
              onPress={async () => {
                if (playerState === PlayerState.Playing) {
                  await TrackPlayer.pause();
                  return;
                }
                if (playerState === PlayerState.Paused) {
                  await TrackPlayer.play();
                  return;
                }
              }}
            >
              {playerState === PlayerState.Playing ? (
                <IconSymbol
                  name="pause.fill"
                  color="white"
                  style={{
                    height: "100%",
                  }}
                />
              ) : playerState === PlayerState.Paused ? (
                <IconSymbol
                  name="play.fill"
                  color="white"
                  style={{
                    height: "100%",
                  }}
                />
              ) : (
                <IconSymbol
                  name="circle.dotted.circle"
                  color="white"
                  style={{
                    height: "100%",
                  }}
                />
              )}
            </Pressable>
          </View>
        </View>
        <View
          style={{
            height: 2,
            backgroundColor: "#71717b",
            width: "100%",
          }}
        >
          <MiniProgessBar />
        </View>
      </View>
    </View>
  );
}

function MiniProgessBar() {
  // Get progress at a higher frequency to show a smoother moving progress bar
  const progress = useProgress(100);
  const progressBarPercentage = (progress.position / progress.duration) * 100;
  return (
    <View
      style={{
        height: 2,
        backgroundColor: "#d4d4d8",
        width: `${progressBarPercentage}%`,
      }}
    />
  );
}
