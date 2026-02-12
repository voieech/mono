import { msg } from "@lingui/core/macro";
import { useLingui, Trans } from "@lingui/react/macro";
import { nativeApplicationVersion, nativeBuildVersion } from "expo-application";
import { getLocales, getCalendars } from "expo-localization";
import * as ExpoUpdates from "expo-updates";
import { useState } from "react";
import { View, Pressable, TouchableOpacity } from "react-native";

import { ThemedText, CopyOnPress, VerticalDivider, Icon } from "@/components";
import { SettingsPageLayout } from "@/components-page/(tabs)/profile/settings/SettingsPageLayout";
import { Colors } from "@/constants";
import { posthog, toast, clearCache } from "@/utils";

export default function AppDetails() {
  const posthogDistinctID = posthog.getDistinctId();
  const { t } = useLingui();

  return (
    <SettingsPageLayout>
      <View
        style={{
          rowGap: 16,
        }}
      >
        <View
          style={{
            rowGap: 4,
          }}
        >
          <ThemedText>
            <Trans>App Version</Trans>
          </ThemedText>
          <View
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor: Colors.black,
              borderRadius: 16,
              rowGap: 4,
            }}
          >
            <ThemedText>
              <Trans>Native app version</Trans>
            </ThemedText>
            <ThemedText>{nativeApplicationVersion}</ThemedText>
            <ThemedText>
              <Trans>Native build version</Trans>
            </ThemedText>
            <ThemedText>{nativeBuildVersion}</ThemedText>
          </View>
        </View>
        <View
          style={{
            rowGap: 4,
          }}
        >
          <ThemedText>Posthog Distinct ID</ThemedText>
          <CopyOnPress
            text={posthogDistinctID}
            toastMessageToShowOnCopy={msg`PostHog ID copied`}
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
        <View
          style={{
            rowGap: 4,
          }}
        >
          <ThemedText>
            <Trans>App cache</Trans>
          </ThemedText>
          <Pressable
            onPress={() => {
              clearCache();
              toast(t`Cache will be cleared`);
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                columnGap: 12,
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: Colors.black,
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 16,
              }}
            >
              <ThemedText>
                <Trans>Press to clear cache</Trans>
              </ThemedText>
              <Icon
                name="chevron.right"
                size={20}
                weight="medium"
                color={Colors.neutral400}
              />
            </View>
          </Pressable>
          <ThemedText
            type="sm-normal"
            colorType="subtext"
            style={{
              paddingTop: 8,
              paddingHorizontal: 16,
              marginTop: -4,
            }}
          >
            <Trans>Please restart app after clearing cache.</Trans>
          </ThemedText>
        </View>
        <View
          style={{
            rowGap: 4,
          }}
        >
          <ThemedText>
            <Trans>Updates</Trans>
          </ThemedText>
          <AppUpdatesInfo />
        </View>
        <View
          style={{
            rowGap: 4,
          }}
        >
          <ThemedText>
            <Trans>Debugging Data</Trans>
          </ThemedText>
          <DebuggingInfo />
        </View>
      </View>
    </SettingsPageLayout>
  );
}

function AppUpdatesInfo() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get only expo updates data for display without things like constants and etc.
  const data = { ...ExpoUpdates };
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
  const expoUpdatesDataJsonString = JSON.stringify(data, null, 2);

  return (
    <View
      style={{
        padding: 16,
        backgroundColor: Colors.black,
        borderRadius: 16,
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
        onPress={() => {
          setIsExpanded((value) => !value);
        }}
        activeOpacity={0.8}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            columnGap: 12,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ThemedText>Expand details</ThemedText>
          <Icon
            name="chevron.right"
            size={20}
            weight="medium"
            color={Colors.neutral400}
            style={{
              transform: [{ rotate: isExpanded ? "90deg" : "0deg" }],
            }}
          />
        </View>
      </TouchableOpacity>
      {isExpanded && (
        <View>
          <VerticalDivider />
          <CopyOnPress
            text={expoUpdatesDataJsonString}
            toastMessageToShowOnCopy={msg`Updates data copied`}
          >
            <ThemedText>{expoUpdatesDataJsonString}</ThemedText>
          </CopyOnPress>
        </View>
      )}
    </View>
  );
}

// @todo Use the support form link to submit via google form, or support full data dump via file export and ask user to email us
function DebuggingInfo() {
  const [isExpanded, setIsExpanded] = useState(false);
  const deviceLocale = getLocales()[0]!;
  const deviceCalendar = getCalendars()[0];
  const debuggingDataString = `deviceLocale: ${JSON.stringify(deviceLocale, null, 2)}\ndeviceCalendar: ${JSON.stringify(deviceCalendar, null, 2)}`;

  return (
    <View
      style={{
        padding: 16,
        backgroundColor: Colors.black,
        borderRadius: 16,
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
        onPress={() => {
          setIsExpanded((value) => !value);
        }}
        activeOpacity={0.8}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            columnGap: 12,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <ThemedText>Expand details</ThemedText>
          <Icon
            name="chevron.right"
            size={20}
            weight="medium"
            color={Colors.neutral400}
            style={{
              transform: [{ rotate: isExpanded ? "90deg" : "0deg" }],
            }}
          />
        </View>
      </TouchableOpacity>
      {isExpanded && (
        <View>
          <VerticalDivider />
          <CopyOnPress
            text={debuggingDataString}
            toastMessageToShowOnCopy={msg`Debugging Data copied`}
          >
            <ThemedText>{debuggingDataString}</ThemedText>
          </CopyOnPress>
        </View>
      )}
    </View>
  );
}
