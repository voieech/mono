import { Link } from "expo-router";
import { View } from "react-native";

import type { ExperimentalSurfaceName } from "@/utils";

import { ThemedLink } from "@/components";
import { SettingsPageLayout } from "@/components-page/(tabs)/profile/settings/SettingsPageLayout";
import { SwitchSettingRow } from "@/components-page/(tabs)/profile/settings/SwitchSettingRow";
import {
  useSettingContext,
  useAppDebuggingSurfaceContext,
  useExperimentalSurfaceContext,
} from "@/context";
import { linguiMsgToString } from "@/utils";

export default function SettingsInternal() {
  const settingContext = useSettingContext();
  const appDebuggingSurfaceContext = useAppDebuggingSurfaceContext();
  return (
    <SettingsPageLayout>
      <View
        style={{
          rowGap: 16,
        }}
      >
        <Link
          href={{
            pathname: "/_sitemap",
          }}
        >
          <ThemedLink>Sitemap</ThemedLink>
        </Link>
        <Link
          href={{
            pathname: "/+not-found",
            params: {},
          }}
        >
          <ThemedLink>Not Found</ThemedLink>
        </Link>
        <Link
          href={{
            pathname: "/themed-text-test",
          }}
        >
          <ThemedLink>Themed Text Test</ThemedLink>
        </Link>
        <SwitchSettingRow
          settingTitle="Show Debugging Surfaces"
          description="Show internal visual debugging surfaces"
          switchValue={appDebuggingSurfaceContext.showDebuggingSurfaces}
          onValueChange={appDebuggingSurfaceContext.setShowDebuggingSurfaces}
        />
        <SwitchSettingRow
          settingTitle={linguiMsgToString(
            settingContext.settings.lastOnboardingTime.name,
          )}
          description={
            settingContext.settings.lastOnboardingTime.description +
            (settingContext.getSetting("lastOnboardingTime") === ""
              ? ""
              : ` The last onboarding time is ${settingContext.getSetting("lastOnboardingTime")}`)
          }
          switchValue={settingContext.getSetting("lastOnboardingTime") === ""}
          onValueChange={(reset) => {
            if (reset) {
              settingContext.updateSetting("lastOnboardingTime", "");
            } else {
              settingContext.updateSetting(
                "lastOnboardingTime",
                new Date().toISOString(),
              );
            }
          }}
        />
        <ExperimentalSurfaceSettingRow
          settingTitle="Use 'interval' instead of 'loop' for useProgress"
          description="Choose the type of useProgress hook implementation"
          experimentalSurfaceName="use-interval-for-useProgress"
        />
        <ExperimentalSurfaceSettingRow
          settingTitle="Use 'card' player instead of 'modal'"
          description="There is a bug on IOS where modal route gets warped with stack route in home page when switching between audio player modal and a route quickly"
          experimentalSurfaceName="use-card-player-instead-of-modal"
        />
        <ExperimentalSurfaceSettingRow
          settingTitle="Show all other generic experimental surfaces"
          description="For every surface that didnt specify a custom experiment name"
          experimentalSurfaceName="default"
        />
      </View>
    </SettingsPageLayout>
  );
}

function ExperimentalSurfaceSettingRow(props: {
  settingTitle: string;
  description?: string;
  showDescriptionInsideRow?: boolean;
  experimentalSurfaceName: ExperimentalSurfaceName;
}) {
  const experimentalSurfaceContext = useExperimentalSurfaceContext();
  return (
    <SwitchSettingRow
      settingTitle={props.settingTitle}
      description={props.description}
      showDescriptionInsideRow={props.showDescriptionInsideRow}
      switchValue={experimentalSurfaceContext.getShowExperimentalSurface(
        props.experimentalSurfaceName,
      )}
      onValueChange={(value) =>
        experimentalSurfaceContext.setShowExperimentalSurface(
          props.experimentalSurfaceName,
          value,
        )
      }
    />
  );
}
