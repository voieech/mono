import { Trans } from "@lingui/react/macro";
import { View, Pressable, Image } from "react-native";

import {
  ParallaxScrollViewContainer,
  ThemedText,
  Icon,
  Collapsible,
} from "@/components";
import { Colors } from "@/constants";
import { useAuthContext } from "@/context";

export default function Profile() {
  const authContext = useAuthContext();
  return (
    <ParallaxScrollViewContainer
      headerImage={
        <Icon
          size={360}
          color={Colors.gray300}
          name="person"
          style={{
            bottom: -120,
            left: -80,
            position: "absolute",
          }}
        />
      }
      innerContentStyle={{
        padding: 32,
        gap: 16,
      }}
    >
      <ThemedText type="xl-bold">
        <Trans>Profile</Trans>
      </ThemedText>
      <View
        style={{
          paddingVertical: 16,
          paddingHorizontal: 16,
          backgroundColor: Colors.black,
          borderRadius: 16,
          alignItems: "center",
          gap: 12,
        }}
      >
        {authContext.authData?.userData?.profilePictureUrl != null ? (
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: Colors.neutral700,
            }}
          >
            {/* TODO: Add Image component when ready */}
            <Image
              source={{ uri: authContext.authData.userData.profilePictureUrl }}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
          </View>
        ) : (
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: Colors.neutral700,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="person" size={40} color={Colors.gray300} />
          </View>
        )}
        <ThemedText type="lg-light">
          {getUserFullName(
            authContext.authData?.userData?.firstName,
            authContext.authData?.userData?.lastName,
          )}
        </ThemedText>
        <ThemedText type="sm-normal" colorType="subtext">
          {authContext.authData?.userData?.email || "Not logged in"}
        </ThemedText>
        {authContext.authData?.userData?.emailVerified === true && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              paddingHorizontal: 8,
              paddingVertical: 4,
              backgroundColor: Colors.white,
              borderRadius: 8,
            }}
          >
            <Icon name="checkmark" size={14} color={Colors.green600} />
            <ThemedText
              type="sm-normal"
              style={{
                color: Colors.green600,
              }}
            >
              Verified
            </ThemedText>
          </View>
        )}
      </View>
      <Collapsible
        title="Account Information"
        expandedViewStyle={{
          paddingTop: 16,
          rowGap: 16,
          paddingBottom: 32,
        }}
      >
        <ProfileRow
          label="Name"
          value={getUserFullName(
            authContext.authData?.userData?.firstName,
            authContext.authData?.userData?.lastName,
          )}
        />
        <ProfileRow
          label="Email"
          value={authContext.authData?.userData?.email || "N/A"}
        />
        <ProfileRow
          label="Email Verified"
          value={authContext.authData?.userData?.emailVerified ? "Yes" : "No"}
        />
        <ProfileRow
          label="Member Since"
          value={formatDate(authContext.authData?.userData?.createdAt)}
        />
      </Collapsible>
      {/* TODO: Add actionable component when ready */}
      <Collapsible
        title="Preferences"
        expandedViewStyle={{
          paddingTop: 16,
          rowGap: 16,
          paddingBottom: 32,
        }}
      >
        <ProfileActionRow
          label="Edit Profile"
          icon="gear"
          onPress={() => console.log("Edit Profile")}
        />
        <ProfileActionRow
          label="Change Password"
          icon="gear"
          onPress={() => console.log("Change Password")}
        />
        <ProfileActionRow
          label="Notifications"
          icon="gear"
          onPress={() => console.log("Notifications")}
        />
      </Collapsible>
      {/* TODO: Add actionable component when ready */}
      <Collapsible
        title="About"
        expandedViewStyle={{
          paddingTop: 16,
          rowGap: 16,
          paddingBottom: 32,
        }}
      >
        {/* @todo Add links */}
        <ProfileActionRow
          label="Privacy Policy"
          icon="gear"
          onPress={() => console.log("Privacy Policy")}
        />
        <ProfileActionRow
          label="Terms of Service"
          icon="gear"
          onPress={() => console.log("Terms of Service")}
        />
        <ProfileActionRow
          label="Help & Support"
          icon="gear"
          onPress={() => console.log("Help & Support")}
        />
      </Collapsible>
      {/* @todo Change to use isAuthenticated instead */}
      {authContext.authData?.userData === undefined ? (
        <Pressable
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: Colors.green600,
            borderRadius: 16,
            alignItems: "center",
          }}
          onPress={authContext.login}
        >
          <ThemedText>
            <Trans>Sign In</Trans>
          </ThemedText>
        </Pressable>
      ) : (
        <Pressable
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: Colors.red500,
            borderRadius: 16,
            alignItems: "center",
          }}
          onPress={authContext.logout}
        >
          <ThemedText>
            <Trans>Sign Out</Trans>
          </ThemedText>
        </Pressable>
      )}
    </ParallaxScrollViewContainer>
  );
}

function ProfileRow(props: { label: string; value: string }) {
  return (
    <View
      style={{
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: Colors.black,
        borderRadius: 16,
      }}
    >
      <ThemedText type="base-semibold">{props.label}</ThemedText>
      <ThemedText
        type="sm-normal"
        colorType="subtext"
        style={{
          marginTop: 4,
        }}
      >
        {props.value}
      </ThemedText>
    </View>
  );
}

function ProfileActionRow(props: {
  label: string;
  icon:
    | "gear"
    | "person"
    | "magnifyingglass"
    | "chevron.right"
    | "chevron.left"
    | "checkmark";
  onPress: () => void;
}) {
  return (
    <Pressable
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: Colors.black,
        borderRadius: 16,
      }}
      onPress={props.onPress}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Icon name={props.icon} size={20} color={Colors.gray400} />
        <ThemedText>{props.label}</ThemedText>
      </View>
      <Icon name="chevron.right" size={20} color={Colors.gray400} />
    </Pressable>
  );
}

/**
 * Will return guest user name if name not available
 */
function getUserFullName(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
) {
  if (firstName != null && lastName != null) {
    return `${firstName} ${lastName}`;
  }

  if (firstName != null) {
    return firstName;
  }

  if (lastName != null) {
    return lastName;
  }

  // @todo Add in localisation
  return "Guest User";
}

function formatDate(dateString?: string) {
  // @todo Add in localisation
  const notApplicableString = "N/A";

  if (dateString === undefined) {
    return notApplicableString;
  }
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return notApplicableString;
  }
}
