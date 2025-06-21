import { Pressable, View } from "react-native";

import { IconSymbol } from "@/components/provided";
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
            backgroundColor: Colors.dark.text,
            borderRadius: "50%",
          }}
        >
          <IconSymbol
            name="play.fill"
            color="black"
            size={props.innerIconSize}
          />
        </View>
      </View>
    </Pressable>
  );
}
