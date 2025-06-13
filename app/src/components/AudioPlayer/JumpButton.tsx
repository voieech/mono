import { ImageSource, Image } from "expo-image";
import { View, Pressable } from "react-native";

export function JumpButton(props: {
  onPress: () => void;
  imageSource: ImageSource;
}) {
  return (
    <View
      style={{
        width: 40,
        height: 40,
      }}
    >
      <Pressable onPress={props.onPress}>
        <Image
          source={props.imageSource}
          style={{
            width: "100%",
            height: "100%",
          }}
          contentFit="contain"
        />
      </Pressable>
    </View>
  );
}
