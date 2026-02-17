import type { PropsWithChildren } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Trans } from "@lingui/react/macro";
import { Pressable, Platform, Linking, View } from "react-native";

import { Colors } from "@/constants";

import { Icon } from "./provided";
import { ThemedText } from "./ThemedComponents";

export function OpenNativeSettingsAppButton(
  props: PropsWithChildren<{ buttonStyle: StyleProp<ViewStyle> }>,
) {
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
        style={[
          {
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
          props.buttonStyle,
        ]}
      >
        {props.children ?? (
          <ThemedText>
            {(() => {
              switch (Platform.OS) {
                case "ios": {
                  return <Trans>Open iOS Settings</Trans>;
                }
                case "android": {
                  return <Trans>Open Android Settings</Trans>;
                }
                default: {
                  return <Trans>Open Settings</Trans>;
                }
              }
            })()}
          </ThemedText>
        )}
        <Icon name="chevron.right" size={20} color={Colors.gray400} />
      </View>
    </Pressable>
  );
}
