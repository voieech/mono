import { Trans } from "@lingui/react/macro";
import { Fragment } from "react";
import { Pressable, View } from "react-native";

import { ThemedText, Icon, PlaybackRateButton } from "@/components";
import { SettingsPageLayout } from "@/components-page/(tabs)/settings/SettingsPageLayout";
import { SwitchSettingRow } from "@/components-page/(tabs)/settings/SwitchSettingRow";
import { Colors } from "@/constants";
import { useSettingContext } from "@/context";
import { linguiMsgToString } from "@/utils";

export default function SettingsAudioPlayback() {
  const settingContext = useSettingContext();
  return (
    <SettingsPageLayout>
      <View
        style={{
          rowGap: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",

            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: Colors.black,
            borderRadius: 16,
          }}
        >
          <ThemedText>
            <Trans>Default audio playback rate</Trans>
          </ThemedText>
          <View
            style={{
              paddingVertical: 2,
              paddingHorizontal: 8,
              backgroundColor: Colors.neutral600,
              borderRadius: 8,
            }}
          >
            <PlaybackRateButton fontSize={18} />
          </View>
        </View>
        <View
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: Colors.black,
            borderRadius: 16,
          }}
        >
          <ThemedText>
            {linguiMsgToString(
              settingContext.settings.externalMediaControls.name,
            )}
          </ThemedText>
          <ThemedText type="sm-light" colorType="subtext">
            {linguiMsgToString(
              settingContext.settings.externalMediaControls.description,
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
          {settingContext.settings.externalMediaControls.options.map(
            (option, index) => (
              <Fragment key={option.value}>
                {index !== 0 && (
                  <View
                    style={{
                      backgroundColor: Colors.neutral600,
                      height: 0.5,
                      marginVertical: 8,
                    }}
                  />
                )}
                <Pressable
                  onPress={() => {
                    settingContext.updateSetting(
                      "externalMediaControls",
                      option.value,
                    );
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
                      {option.value ===
                        settingContext.getSetting("externalMediaControls") && (
                        <Icon name="checkmark" color={Colors.green600} />
                      )}
                    </View>
                  </View>
                </Pressable>
              </Fragment>
            ),
          )}
        </View>
        <SwitchSettingRow
          settingTitle={linguiMsgToString(
            settingContext.settings.rewindToStartOnSkipPrevious.name,
          )}
          description={linguiMsgToString(
            settingContext.settings.rewindToStartOnSkipPrevious.description,
          )}
          switchValue={settingContext.getSetting("rewindToStartOnSkipPrevious")}
          onValueChange={(value) =>
            settingContext.updateSetting("rewindToStartOnSkipPrevious", value)
          }
        />
      </View>
    </SettingsPageLayout>
  );
}
