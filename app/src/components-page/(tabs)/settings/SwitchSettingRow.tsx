import { Switch, useWindowDimensions, View } from "react-native";

import { ThemedText } from "@/components";
import { Colors } from "@/constants";

export function SwitchSettingRow(props: {
  settingTitle: string;
  description?: string;
  showDescriptionInsideRow?: boolean;
  switchValue: boolean;
  onValueChange: (newValue: boolean) => any;
}) {
  const windowDimensions = useWindowDimensions();
  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          columnGap: 16,

          paddingVertical: 8,
          paddingHorizontal: 16,
          backgroundColor: Colors.black,
          borderRadius: 16,
        }}
      >
        <View
          style={{
            flexBasis: windowDimensions.width * 0.5,
            flexGrow: 1,
          }}
        >
          <ThemedText>{props.settingTitle}</ThemedText>
          {props.description !== undefined &&
            props.showDescriptionInsideRow && (
              <ThemedText type="sm-normal" colorType="subtext">
                {props.description}
              </ThemedText>
            )}
        </View>
        <View
          style={{
            flexBasis: windowDimensions.width * 0.2,
          }}
        >
          <Switch
            value={props.switchValue}
            onValueChange={props.onValueChange}
            thumbColor={Colors.white}
            trackColor={{
              false: Colors.neutral500,
              true: Colors.green600,
            }}
          />
        </View>
      </View>
      {props.description !== undefined && !props.showDescriptionInsideRow && (
        <ThemedText
          type="sm-normal"
          colorType="subtext"
          style={{
            paddingHorizontal: 16,
            marginTop: -4,
            paddingBottom: 16,
          }}
        >
          {props.description}
        </ThemedText>
      )}
    </>
  );
}
