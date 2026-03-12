import { msg } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import * as Notifications from "expo-notifications";
import { useRef, useEffect } from "react";
import { AppState, Pressable, View } from "react-native";

import { postTestPushNotification } from "@/api";
import {
  ThemedText,
  ThemedView,
  Icon,
  VerticalSpacer,
  CopyOnPress,
  OpenNativeSettingsAppButton,
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

  const syncPushNotificationData = useRef(() =>
    notificationContext.syncPushNotificationData(),
  );

  useEffect(() => {
    syncPushNotificationData.current();
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
        syncPushNotificationData.current();
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  async function requestNotificationPermission() {
    await Notifications.requestPermissionsAsync();
    syncPushNotificationData.current();
  }

  async function requestPushNotificationTest() {
    if (notificationContext.pushTokens === undefined) {
      return;
    }
    await postTestPushNotification(notificationContext.pushTokens);
    toast(msg`Test requested, look out for incoming push notifications!`);
  }

  return (
    <SettingsPageLayout>
      <View
        style={{
          flexDirection: "column",
          rowGap: 8,
        }}
      >
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
        <VerticalSpacer />
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
        <OpenNativeSettingsAppButton
          buttonStyle={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: Colors.black,
            borderRadius: 10,
          }}
        >
          <ThemedText>
            <Trans>Open Notification Settings</Trans>
          </ThemedText>
        </OpenNativeSettingsAppButton>
        {notificationContext.pushTokens?.expoToken !== undefined && (
          <View
            style={{
              flexDirection: "column",
              rowGap: 8,
            }}
          >
            <VerticalSpacer />
            <View>
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
            <View>
              <Pressable onPress={requestPushNotificationTest}>
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
                    <Trans>Test Push Notification</Trans>
                  </ThemedText>
                  <Icon name="chevron.right" size={20} color={Colors.gray400} />
                </View>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </SettingsPageLayout>
  );
}
