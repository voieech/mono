import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import * as Notifications from "expo-notifications";
import { useRef, useEffect } from "react";
import { AppState, Platform, Pressable, View, Linking } from "react-native";

import {
  ThemedText,
  ThemedView,
  Icon,
  VerticalSpacer,
  CopyOnPress,
} from "@/components";
import { SettingsPageLayout } from "@/components-page/(tabs)/profile/settings/SettingsPageLayout";
import { Colors } from "@/constants";
import { useNotification } from "@/context";
import { toast } from "@/utils";

export default function SettingsNotification() {
  const notificationContext = useNotification();
  const isNotificationEnabled =
    notificationContext.notificationPermissionsStatus?.granted ?? false;
  const canAskUserForNotificationPermissionAgain =
    notificationContext.notificationPermissionsStatus?.canAskAgain ?? false;

  const syncPushNotifications = useRef(() =>
    notificationContext.syncPushNotificationData(),
  );

  useEffect(() => {
    syncPushNotifications.current();
  }, []);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // Subscribe to app state change to trigger re syncing of notification
    // data when transitioning from background to foreground, since user could
    // potentially turned on or off notifications in settings page before
    // navigating back, and we want to show the update immediately instead of
    // waiting for next app start to show the change.
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        syncPushNotifications.current();
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  async function requestNotificationPermission() {
    await Notifications.requestPermissionsAsync();
    await notificationContext.syncPushNotificationData();
  }

  return (
    <SettingsPageLayout>
      <View
        style={{
          flexDirection: "column",
          rowGap: 8,
        }}
      >
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 12,
              paddingHorizontal: 16,
              backgroundColor: Colors.black,
              borderRadius: 16,
            }}
          >
            <ThemedText>
              <Trans>Is notifications enabled?</Trans>
            </ThemedText>
            <ThemedView
              style={{
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 8,
                backgroundColor: isNotificationEnabled
                  ? Colors.green600
                  : Colors.neutral300,
              }}
            >
              <ThemedText
                customColors={{
                  dark: isNotificationEnabled ? Colors.white : Colors.black,
                }}
              >
                {isNotificationEnabled ? <Trans>Yes</Trans> : <Trans>No</Trans>}
              </ThemedText>
            </ThemedView>
          </View>
        </View>
        {!isNotificationEnabled && canAskUserForNotificationPermissionAgain && (
          <Pressable onPress={requestNotificationPermission}>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 16,
                backgroundColor: Colors.black,
                borderRadius: 10,
              }}
            >
              <ThemedText>
                <Trans>Enable Notifications</Trans>
              </ThemedText>
              <Icon name="chevron.right" size={20} color={Colors.gray400} />
            </View>
          </Pressable>
        )}
        <OpenNotificationSettings />
        {notificationContext.pushTokens?.expoToken !== undefined && (
          <View>
            <VerticalSpacer />
            <ThemedText
              style={{
                paddingBottom: 8,
              }}
            >
              <Trans>Expo Notification Token</Trans>
            </ThemedText>
            <CopyOnPress
              text={notificationContext.pushTokens.expoToken}
              onCopy={() => toast(msg`Copied to clipboard`)}
            >
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: Colors.black,
                  borderRadius: 10,
                }}
              >
                <ThemedText type="sm-light">
                  {notificationContext.pushTokens.expoToken}
                </ThemedText>
                <Icon
                  name="square.on.square"
                  size={20}
                  color={Colors.gray400}
                />
              </View>
            </CopyOnPress>
          </View>
        )}
      </View>
    </SettingsPageLayout>
  );
}

const OpenNotificationSettings = () => {
  return (
    <Pressable
      onPress={() => {
        switch (Platform.OS) {
          case "ios": {
            Linking.openSettings();
            return;
          }
          case "android": {
            Linking.sendIntent("android.settings.APP_NOTIFICATION_SETTINGS", [
              {
                key: "android.provider.extra.APP_PACKAGE",
                value: "com.voieechapp",
              },
            ]);
            return;
          }
          default:
            console.error("Invalid Platform for settings");
        }
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: Colors.black,
          borderRadius: 10,
        }}
      >
        <ThemedText>
          <Trans>Open Notification Settings</Trans>
        </ThemedText>
        <Icon name="chevron.right" size={20} color={Colors.gray400} />
      </View>
    </Pressable>
  );
};
