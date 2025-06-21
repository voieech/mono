import { Pressable } from "react-native";

import { IconSymbol } from "@/components/provided";

export function PauseButton(props: { size: number; onPress: () => unknown }) {
  return (
    <Pressable onPress={props.onPress}>
      <IconSymbol
        name="pause.fill"
        color="white"
        size={props.size}
        style={{
          height: "100%",
        }}
      />
    </Pressable>
  );
}
