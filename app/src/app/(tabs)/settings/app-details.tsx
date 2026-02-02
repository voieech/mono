import { nativeApplicationVersion, nativeBuildVersion } from "expo-application";
import * as ExpoUpdates from "expo-updates";
import { View } from "react-native";

import { ThemedText, CopyOnPress } from "@/components";
import { SettingsPageLayout } from "@/components-page/(tabs)/settings/SettingsPageLayout";
import { Colors } from "@/constants";
import { posthog, toast } from "@/utils";

export default function AppDetails() {
  const posthogDistinctID = posthog.getDistinctId();
  return (
    <SettingsPageLayout>
      <View
        style={{
          rowGap: 16,
        }}
      >
        <View>
          <ThemedText>App Version</ThemedText>
          <View
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor: Colors.black,
              borderRadius: 16,
            }}
          >
            <ThemedText>
              Native app version: {nativeApplicationVersion}
            </ThemedText>
            <ThemedText>Native build version: {nativeBuildVersion}</ThemedText>
            <ThemedText>
              Updates: {JSON.stringify(getExpoUpdatesData(), null, 2)}
            </ThemedText>
          </View>
        </View>
        <View>
          <ThemedText>Posthog Distinct ID</ThemedText>
          <CopyOnPress
            text={posthogDistinctID}
            onCopy={() => toast("PostHog ID copied")}
          >
            <View
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: Colors.black,
                borderRadius: 16,
              }}
            >
              <ThemedText>{posthogDistinctID}</ThemedText>
            </View>
          </CopyOnPress>
        </View>
      </View>
    </SettingsPageLayout>
  );
}

/**
 * Get only expo updates data for display without things like constants and etc.
 */
function getExpoUpdatesData() {
  const data = { ...ExpoUpdates };

  // @ts-expect-error
  delete data.localAssets;
  // @ts-expect-error
  delete data.manifest;
  // @ts-expect-error
  delete data.UpdateCheckResultNotAvailableReason;
  // @ts-expect-error
  delete data.UpdatesCheckAutomaticallyValue;
  // @ts-expect-error
  delete data.UpdatesLogEntryCode;
  // @ts-expect-error
  delete data.UpdatesLogEntryLevel;
  // @ts-expect-error
  delete data.UpdateInfoType;

  return data as typeof ExpoUpdates;
}
