import type { ExternalPathString } from "expo-router";

import { useLingui, Trans } from "@lingui/react/macro";
import { useCallback } from "react";
import { View, Pressable, Image } from "react-native";

import {
  ParallaxScrollViewContainer,
  ThemedView,
  ThemedText,
  Icon,
  Collapsible,
  InAppBrowserLink,
} from "@/components";
import { Colors } from "@/constants";
import { useAuthContext } from "@/context";
import { getUserFullName } from "@/utils";

export default function Profile() {
  const supportLink = "https://forms.gle/hsQdT47mnb9zmbFE7";
  const authContext = useAuthContext();
  const { t } = useLingui();

  const formatDate = useCallback(
    function (dateString?: string) {
      const notApplicableString = t`Not Available`;
      if (dateString === undefined) {
        return notApplicableString;
      }
      try {
        return new Date(dateString).toLocaleDateString();
      } catch {
        return notApplicableString;
      }
    },
    [t],
  );

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
          {authContext.authData?.userData?.profilePictureUrl != null ? (
            <Image
              source={{ uri: authContext.authData.userData.profilePictureUrl }}
              style={{ width: 80, height: 80, borderRadius: 40 }}
            />
          ) : (
            <Icon name="person" size={40} color={Colors.gray300} />
          )}
        </View>
        <ThemedText type="lg-light">
          {getUserFullName(
            authContext.authData?.userData?.firstName,
            authContext.authData?.userData?.lastName,
          )}
        </ThemedText>
        {authContext.authData?.userData?.email !== undefined && (
          <ThemedText type="sm-normal" colorType="subtext">
            {authContext.authData?.userData?.email}
          </ThemedText>
        )}
      </View>
      {authContext.isAuthenticated && (
        <>
          <Collapsible
            title={t`Account Information`}
            expandedViewStyle={{
              paddingTop: 16,
              rowGap: 16,
              paddingBottom: 32,
            }}
          >
            <ProfileRow
              label={t`Name`}
              value={getUserFullName(
                authContext.authData?.userData?.firstName,
                authContext.authData?.userData?.lastName,
              )}
            />
            <ProfileRow
              label={t`Email`}
              value={authContext.authData?.userData?.email}
            />
            <ProfileRow
              label={t`Member Since`}
              value={formatDate(authContext.authData?.userData?.createdAt)}
            />
            <ProfileRow
              label={t`Email Verified?`}
              value={
                authContext.authData?.userData?.emailVerified ? t`Yes` : t`No`
              }
            />
          </Collapsible>

          {/* @todo Add actionable component when ready */}
          <Collapsible
            title={t`Preferences`}
            expandedViewStyle={{
              paddingTop: 16,
              rowGap: 16,
              paddingBottom: 32,
            }}
          >
            <ProfileActionRow
              label={t`Edit Profile`}
              icon="gear"
              onPress={() => console.log("Edit Profile")}
            />
            <ProfileActionRow
              label={t`Change Password`}
              icon="gear"
              onPress={() => console.log("Change Password")}
            />
            <ProfileActionRow
              label={t`Notifications`}
              icon="gear"
              onPress={() => console.log("Notifications")}
            />
          </Collapsible>
        </>
      )}
      <Collapsible
        title={t`About`}
        expandedViewStyle={{
          paddingTop: 16,
          rowGap: 16,
          paddingBottom: 32,
        }}
      >
        {/* @todo Add links */}
        <ProfileRowLink
          label={t`Privacy Policy`}
          href="https://voieech.com/privacy-policy.html"
          icon="gear"
        />
        <ProfileRowLink
          label={t`Terms of Service`}
          href="https://voieech.com/terms-and-conditions.html"
          icon="gear"
        />
        <ProfileRowLink
          label={t`Help & Support`}
          href={supportLink}
          icon="gear"
        />
      </Collapsible>
      <Pressable
        style={{
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 16,
          alignItems: "center",
          backgroundColor: authContext.isAuthenticated
            ? Colors.red500
            : Colors.green600,
        }}
        onPress={
          authContext.isAuthenticated ? authContext.logout : authContext.login
        }
      >
        <ThemedText>
          {authContext.isAuthenticated ? (
            <Trans>Sign Out</Trans>
          ) : (
            <Trans>Sign In</Trans>
          )}
        </ThemedText>
      </Pressable>
    </ParallaxScrollViewContainer>
  );
}

function ProfileRow(props: { label: string; value?: string }) {
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
        {props.value ?? <Trans>Not Available</Trans>}
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

function ProfileRowLink(props: {
  label: string;
  href: ExternalPathString;
  icon:
    | "gear"
    | "person"
    | "magnifyingglass"
    | "chevron.right"
    | "chevron.left"
    | "checkmark";
}) {
  return (
    <InAppBrowserLink href={props.href}>
      <ThemedView
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: Colors.black,
          borderRadius: 16,
        }}
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
      </ThemedView>
    </InAppBrowserLink>
  );
}
