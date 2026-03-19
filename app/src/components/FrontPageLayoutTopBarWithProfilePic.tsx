import { PropsWithChildren } from "react";
import { View } from "react-native";

import { ProfilePicButton } from "./ProfilePicButton";

export function FrontPageLayoutTopBarWithProfilePic(props: PropsWithChildren) {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingBottom: 8,
        flexDirection: "row",
        columnGap: 12,
      }}
    >
      <ProfilePicButton />
      {props.children}
    </View>
  );
}
