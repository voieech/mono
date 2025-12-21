import { Pressable, View } from "react-native";

import { Icon } from "@/components/provided";
import { Colors } from "@/constants";

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
            backgroundColor: Colors.neutral50,
            borderRadius: "50%",
          }}
        >
          <Icon name="pause.fill" color="black" size={props.innerIconSize} />
        </View>
      </View>
    </Pressable>
  );
}
