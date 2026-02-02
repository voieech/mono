import { Fragment } from "react";
import { Pressable, View } from "react-native";

import { ThemedText, Icon } from "@/components";
import { SettingsPageLayout } from "@/components-page/(tabs)/profile/settings/SettingsPageLayout";
import { Colors } from "@/constants";
import { useSettingContext } from "@/context";
import { linguiMsgToString } from "@/utils";

export default function SettingsContentLanguage() {
  const settingContext = useSettingContext();
  return (
    <SettingsPageLayout>
      <View
        style={{
          paddingVertical: 8,
          paddingHorizontal: 16,
          backgroundColor: Colors.black,
          borderRadius: 16,
        }}
      >
        <ThemedText type="sm-normal" colorType="subtext">
          {linguiMsgToString(
            settingContext.settings.contentLanguage.description,
          )}
        </ThemedText>
        <View
          style={{
            backgroundColor: Colors.neutral500,
            height: 0.5,
            marginTop: 8,
            marginBottom: 16,
          }}
        />
        {settingContext.settings.contentLanguage.options.map(
          (option, index) => (
            <Fragment key={option.value}>
              {index !== 0 && (
                <View
                  style={{
                    backgroundColor: Colors.neutral600,
                    height: 0.5,
                    marginVertical: 12,
                  }}
                />
              )}
              <Pressable
                onPress={() => {
                  settingContext.updateSetting("contentLanguage", [
                    option.value,
                  ]);
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <ThemedText
                    style={{
                      flexShrink: 1,
                    }}
                  >
                    {linguiMsgToString(option.name)}
                  </ThemedText>
                  <View>
                    {settingContext
                      .getSetting("contentLanguage")
                      .includes(option.value) && (
                      <Icon
                        name="checkmark"
                        color={Colors.green600}
                        size={16}
                      />
                    )}
                  </View>
                </View>
              </Pressable>
            </Fragment>
          ),
        )}
      </View>
    </SettingsPageLayout>
  );
}
