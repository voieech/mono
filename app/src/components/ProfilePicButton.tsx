import { Image } from "expo-image";
import { useRouter, Link } from "expo-router";
import { View } from "react-native";

import { Colors } from "@/constants";
import { useAuthContext } from "@/context";

import { Icon } from "./provided";

export function ProfilePicButton() {
  const router = useRouter();
  const authContext = useAuthContext();
  const imageSize = 32;
  return (
    <Link
      href={{
        pathname: "/profile/profile-page",
      }}
      onLongPress={() => {
        if (__DEV__) {
          router.push("/profile/settings/internal");
        }
      }}
    >
      <View
        style={{
          width: imageSize,
          height: imageSize,
          borderRadius: imageSize,
          backgroundColor: Colors.neutral700,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {authContext.authData?.userData?.profilePictureUrl != null ? (
          <Image
            source={authContext.authData.userData.profilePictureUrl}
            style={{
              width: imageSize,
              height: imageSize,
              borderRadius: imageSize,
            }}
          />
        ) : (
          <Icon name="person" size={imageSize * 0.5} color={Colors.gray300} />
        )}
      </View>
    </Link>
  );
}
