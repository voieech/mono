import { Pressable } from "react-native";

import { IconSymbol } from "@/components/provided";

export function PlayButton(props: { size: number; onPress: () => unknown }) {
  return (
    <Pressable onPress={props.onPress}>
      <IconSymbol
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
