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
        alignItems: "center",

        // @todo Add some shadow
        // backgroundColor: "black",
        // boxShadow: "0px 6px 12px rgba(255, 255, 255, 0.2)",
        // // Ensures shadow paints OVER the content below
        // zIndex: 10,
      }}
    >
      <ProfilePicButton />
      {props.children}
    </View>
  );
}
