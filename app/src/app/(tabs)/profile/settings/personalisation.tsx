import { Trans } from "@lingui/react/macro";
import { Link } from "expo-router";
import { View } from "react-native";

import { ThemedText, Icon } from "@/components";
import { SettingsPageLayout } from "@/components-page/(tabs)/profile/settings/SettingsPageLayout";
import { Colors } from "@/constants";
import { useAuthContext } from "@/context";

export default function SettingsPersonalisation() {
  const authContext = useAuthContext();
  return (
    <SettingsPageLayout>
      <View
        style={{
          rowGap: 16,
        }}
      >
        {!authContext.isAuthenticated ? (
          <Link
            href={{
              pathname: "/(tabs)/profile",
            }}
          >
            <View
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: Colors.black,
                borderRadius: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "center",
                width: "100%",
              }}
            >
              <ThemedText>
                <Trans>Sign in to Personalise!</Trans>
              </ThemedText>
              <Icon name="chevron.right" color={Colors.white} />
            </View>
          </Link>
        ) : (
          <Link
            href={{
              pathname: "/(onboarding)/default-content-preference-selection",
            }}
          >
            <View
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: Colors.black,
                borderRadius: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "center",
                width: "100%",
              }}
            >
              <ThemedText>
                <Trans>Customise content preferences</Trans>
              </ThemedText>
              <Icon name="chevron.right" color={Colors.white} />
            </View>
          </Link>
        )}
      </View>
    </SettingsPageLayout>
  );
}
