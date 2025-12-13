import { Trans } from "@lingui/react/macro";
import { View, Pressable } from "react-native";

import {
  ParallaxScrollViewContainer,
  ThemedText,
  Icon,
  Collapsible,
  useAuth,
} from "@/components";

export default function Profile() {
  const { user, login, logout } = useAuth();
  return (
    // @ Todo add user image if any or remove
    <ParallaxScrollViewContainer
      headerImage={
        <Icon
          size={360}
          color="#D0D0D0"
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
      <ThemedText type="title">
        <Trans>Profile</Trans>
      </ThemedText>

      {/* Profile Header */}
      <View
        style={{
          paddingVertical: 16,
          paddingHorizontal: 16,
          backgroundColor: "black",
          borderRadius: 16,
          alignItems: "center",
          gap: 12,
        }}
      >
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "#333",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="person" size={40} color="#999" />
        </View>
        <ThemedText type="defaultSemiBold" style={{ fontSize: 18 }}>
          {user?.name || "Guest User"}
        </ThemedText>
        <ThemedText style={{ fontSize: 14, color: "#999" }}>
          {user?.email || "Not logged in"}
        </ThemedText>
      </View>

      <Collapsible
        title="Account Information"
        expandedViewStyle={{
          paddingTop: 16,
          rowGap: 16,
          paddingBottom: 32,
        }}
      >
        <ProfileRow label="ID" value={user?.id ?? "000000000"} />
        <ProfileRow label="Username" value={user?.username ?? "Guest User"} />

        <ProfileRow label="Phone" value={user?.phone ?? "N/A"} />

        <ProfileRow
          label="Member Since"
          value={user?.memberSince ?? new Date().toLocaleDateString()}
        />
      </Collapsible>

      {/* @ Todo create actionable item */}
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

      {/* @ Todo create actionable item */}
      <Collapsible
        title="About"
        expandedViewStyle={{
          paddingTop: 16,
          rowGap: 16,
          paddingBottom: 32,
        }}
      >
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

      {/* Sign Out Button */}
      {user ? (
        <Pressable
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: "#991b1b",
            borderRadius: 16,
            alignItems: "center",
          }}
          onPress={logout}
        >
          <ThemedText type="defaultSemiBold" style={{ color: "#fff" }}>
            <Trans>Sign Out</Trans>
          </ThemedText>
        </Pressable>
      ) : (
        <Pressable
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: "#16a34a",
            borderRadius: 16,
            alignItems: "center",
          }}
          onPress={login}
        >
          <ThemedText type="defaultSemiBold" style={{ color: "#fff" }}>
            <Trans>Sign In</Trans>
          </ThemedText>
        </Pressable>
      )}
    </ParallaxScrollViewContainer>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: "black",
        borderRadius: 16,
      }}
    >
      <ThemedText type="defaultSemiBold">{label}</ThemedText>
      <ThemedText style={{ fontSize: 14, color: "#999", marginTop: 4 }}>
        {value}
      </ThemedText>
    </View>
  );
}

function ProfileActionRow({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon:
    | "gear"
    | "person"
    | "magnifyingglass"
    | "chevron.right"
    | "chevron.left";
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
        backgroundColor: "black",
        borderRadius: 16,
      }}
      onPress={onPress}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Icon name={icon} size={20} color="#999" />
        <ThemedText>{label}</ThemedText>
      </View>
      <Icon name="chevron.right" size={20} color="#999" />
    </Pressable>
  );
}
