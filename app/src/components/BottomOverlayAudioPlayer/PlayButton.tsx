import { Pressable } from "react-native";

import { Icon } from "@/components/provided";

export function PlayButton(props: { size: number; onPress: () => unknown }) {
  return (
    <Pressable onPress={props.onPress}>
      <Icon
        name="play.fill"
        color="white"
        size={props.size}
        style={{
          height: "100%",
        }}
      />
    </Pressable>
  );
}
