import { Pressable, View } from "react-native";

import { Icon } from "@/components/provided";
import { Colors } from "@/constants";

export function CircularPlayButton(props: {
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
          <Icon name="play.fill" color="black" size={props.innerIconSize} />
        </View>
      </View>
    </Pressable>
  );
}
