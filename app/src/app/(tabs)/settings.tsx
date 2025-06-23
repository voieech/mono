import { Link } from "expo-router";
import { Switch, useWindowDimensions } from "react-native";

import type { ExperimentalSurfaceName } from "@/utils";

import {
  ParallaxScrollViewContainer,
  ThemedText,
  Icon,
  Collapsible,
  ThemedView,
} from "@/components";
import {
  useAppDebuggingSurfaceContext,
  useExperimentalSurfaceContext,
} from "@/context";

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
      {/* @todo Show if featureFlag is on for current user OR __DEV__ */}
      {__DEV__ && (
        <Collapsible title="Internal" openByDefault>
          <ThemedView
            style={{
              rowGap: 8,
            }}
          >
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
            <SwitchSettingRow
              settingTitle="Show Debugging Surfaces"
              switchValue={appDebuggingSurfaceContext.showDebuggingSurfaces}
              onValueChange={
                appDebuggingSurfaceContext.setShowDebuggingSurfaces
              }
            />
            <ExperimentalSurfaceSettingRow
              settingTitle="Use 'card' player instead of 'modal'"
              experimentalSurfaceName="use-card-player-instead-of-modal"
            />
            <ExperimentalSurfaceSettingRow
              settingTitle="Show all other generic experimental surfaces"
              experimentalSurfaceName="default"
            />
          </ThemedView>
        </Collapsible>
      )}
    </ParallaxScrollViewContainer>
  );
}

function ExperimentalSurfaceSettingRow(props: {
  settingTitle: string;
  experimentalSurfaceName: ExperimentalSurfaceName;
}) {
  const experimentalSurfaceContext = useExperimentalSurfaceContext();
  return (
    <SwitchSettingRow
      settingTitle={props.settingTitle}
      switchValue={experimentalSurfaceContext.getShowExperimentalSurface(
        props.experimentalSurfaceName
      )}
      onValueChange={(value) =>
        experimentalSurfaceContext.setShowExperimentalSurface(
          props.experimentalSurfaceName,
          value
        )
      }
    />
  );
}

function SwitchSettingRow(props: {
  settingTitle: string;
  switchValue: boolean;
  onValueChange: (newValue: boolean) => any;
}) {
  const windowDimensions = useWindowDimensions();
  return (
    <ThemedView
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
      }}
    >
      <ThemedText
        style={{
          width: windowDimensions.width * 0.6,
        }}
      >
        {props.settingTitle}
      </ThemedText>
      <ThemedView>
        <Switch
          value={props.switchValue}
          onValueChange={props.onValueChange}
          thumbColor="#f4f3f4"
          trackColor={{
            false: "#ccc",
            true: "#16a34a",
          }}
        />
      </ThemedView>
    </ThemedView>
  );
}
