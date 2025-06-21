import { Link } from "expo-router";
import { Switch } from "react-native";

import {
  ParallaxScrollViewContainer,
  ThemedText,
  Icon,
  Collapsible,
  ThemedView,
} from "@/components";
import { useAppDebuggingSurfaceContext } from "@/context";

export default function Settings() {
  const appDebuggingSurfaceContext = useAppDebuggingSurfaceContext();
  return (
    <ParallaxScrollViewContainer
      headerImage={
        <Icon
          size={360}
          color="#D0D0D0"
          name="gear"
          style={{
            bottom: -120,
            left: -80,
            position: "absolute",
          }}
        />
      }
      innerContentStyle={{
        padding: 32,
        gap: 16,
      }}
    >
      <ThemedText type="title">Settings</ThemedText>
      <Collapsible title="Audio Playback">
        <ThemedText>Default audio playback speed: {1}</ThemedText>
      </Collapsible>
      {__DEV__ && (
        <Collapsible title="Internal" openByDefault>
          <Link
            href={{
              pathname: "/_sitemap",
            }}
          >
            <ThemedText type="link">Sitemap</ThemedText>
          </Link>
          <Link
            href={{
              pathname: "/+not-found",
              params: {},
            }}
          >
            <ThemedText type="link">Not Found</ThemedText>
          </Link>
          <ThemedView
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
            }}
          >
            <ThemedText>Show Debugging Surfaces</ThemedText>
            <ThemedView>
              <Switch
                value={appDebuggingSurfaceContext.showDebuggingSurfaces}
                onValueChange={
                  appDebuggingSurfaceContext.setShowDebuggingSurfaces
                }
                thumbColor="#f4f3f4"
                trackColor={{
                  false: "#ccc",
                  true: "#16a34a",
                }}
              />
            </ThemedView>
          </ThemedView>
        </Collapsible>
      )}
    </ParallaxScrollViewContainer>
  );
}
