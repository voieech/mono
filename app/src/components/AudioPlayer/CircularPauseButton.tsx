import { Pressable, View } from "react-native";

import { Icon } from "@/components/provided";
import { ThemeColors } from "@/constants";

export function CircularPauseButton(props: {
  innerIconSize: number;
  outerBackgroundSize: number;
  onPress: () => unknown;
}) {
  return (
    <Pressable onPress={props.onPress}>
      <View
        style={{
          justifyContent: "center",
        }}
      >
        <View
          style={{
            padding: props.outerBackgroundSize,
            backgroundColor: ThemeColors.dark.text,
            borderRadius: "50%",
          }}
        >
          <Icon name="pause.fill" color="black" size={props.innerIconSize} />
        </View>
      </View>
    </Pressable>
  );
}
