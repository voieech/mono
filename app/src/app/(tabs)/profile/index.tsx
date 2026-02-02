import type { Href } from "expo-router";

import { useLingui, Trans } from "@lingui/react/macro";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useFeatureFlag } from "posthog-react-native";
import { useCallback, useState } from "react";
import { View, Pressable, TouchableOpacity } from "react-native";

import {
  ParallaxScrollViewContainer,
  ThemedText,
  ThemedLink,
  Icon,
  VerticalDivider,
  InAppBrowserLink,
  VerticalSpacer,
} from "@/components";
import { Colors } from "@/constants";
import { useAuthContext } from "@/context";
import { envVar, getUserFullName } from "@/utils";

export default function ProfilePage() {
  const authContext = useAuthContext();
  const { t } = useLingui();

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
      }}
    >
      <View>
        <ThemedText type="lg-light">
          <Trans>Profile</Trans>
        </ThemedText>
        <VerticalSpacer height={4} />
        <ProfileInformationCard />
        <VerticalSpacer />
        <Pressable
          style={{
            marginBottom: 8,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 16,
            alignItems: "center",
            backgroundColor: authContext.isAuthenticated
              ? Colors.red500
              : Colors.green600,
          }}
          onPress={
            authContext.isAuthenticated
              ? authContext.logout
              : () => authContext.login()
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
      </View>
      <VerticalSpacer />
      <SettingsSection />
      <VerticalSpacer />
      <View
        style={{
          rowGap: 6,
        }}
      >
        <ThemedText type="lg-light">
          <Trans>About</Trans>
        </ThemedText>
        <ProfileRowLink label={t`Help & Support`} href={envVar.supportLink} />
        <ProfileRowLink
          label={t`Privacy Policy`}
          href="https://voieech.com/privacy-policy.html"
        />
        <ProfileRowLink
          label={t`Terms of Service`}
          href="https://voieech.com/terms-and-conditions.html"
        />
      </View>
    </ParallaxScrollViewContainer>
  );
}

function ProfileInformationCard() {
  const [cardInfoModalIsOpen, setCardInfoModalIsOpen] = useState(false);
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
    <View
      style={{
        padding: 16,
        backgroundColor: Colors.black,
        borderRadius: 16,
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
        onPress={() => setCardInfoModalIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            columnGap: 12,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              columnGap: 12,
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                backgroundColor: Colors.neutral700,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {authContext.authData?.userData?.profilePictureUrl != null ? (
                <Image
                  source={authContext.authData.userData.profilePictureUrl}
                  style={{ width: 40, height: 40, borderRadius: 40 }}
                />
              ) : (
                <Icon name="person" size={20} color={Colors.gray300} />
              )}
            </View>
            <View
              style={{
                flexDirection: "column",
              }}
            >
              <ThemedText>
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
          </View>
          {authContext.isAuthenticated && (
            <Icon
              name="chevron.right"
              size={20}
              weight="medium"
              color={Colors.neutral400}
              style={{
                transform: [{ rotate: cardInfoModalIsOpen ? "90deg" : "0deg" }],
              }}
            />
          )}
        </View>
      </TouchableOpacity>
      {cardInfoModalIsOpen && (
        <View>
          <VerticalDivider />
          <ThemedText type="lg-thin">
            <Trans>Account Information</Trans>
          </ThemedText>
          <VerticalSpacer height={4} />
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
        </View>
      )}
    </View>
  );
}

function ProfileRow(props: { label: string; value?: string }) {
  return (
    <View
      style={{
        paddingVertical: 8,
      }}
    >
      <ThemedText type="base-normal">{props.label}</ThemedText>
      <ThemedText
        type="sm-normal"
        colorType="subtext"
        style={{
          paddingTop: 2,
        }}
      >
        {props.value ?? <Trans>Not Available</Trans>}
      </ThemedText>
    </View>
  );
}

function SettingsSection() {
  const isInternalUser = useFeatureFlag("internal");
  const authContext = useAuthContext();
  const { t } = useLingui();

  return (
    <View>
      <ThemedText
        type="lg-light"
        style={{
          paddingBottom: 8,
        }}
      >
        <Trans>Settings</Trans>
      </ThemedText>
      <View
        style={{
          flexDirection: "column",
          rowGap: 8,
        }}
      >
        {(__DEV__ || isInternalUser) && authContext.isAuthenticated && (
          <SettingsPageLink
            setting={t`Edit Profile`}
            href={{
              pathname: "/",
            }}
          />
        )}
        {(__DEV__ || isInternalUser) && authContext.isAuthenticated && (
          <SettingsPageLink
            setting={t`Notifications`}
            href={{
              pathname: "/",
            }}
          />
        )}
        <SettingsPageLink
          setting={t`Audio Playback`}
          href={{
            pathname: "/profile/settings/audio-playback",
          }}
        />
        <SettingsPageLink
          setting={t`Content Language`}
          href={{
            pathname: "/profile/settings/content-language",
          }}
        />
        {(__DEV__ || isInternalUser) && (
          <SettingsPageLink
            setting={t`Personalisation`}
            href={{
              pathname: "/profile/settings/personalisation",
            }}
          />
        )}
        <SettingsPageLink
          setting={t`App Details`}
          href={{
            pathname: "/profile/settings/app-details",
          }}
        />
        {(__DEV__ || isInternalUser) && (
          <SettingsPageLink
            setting={t`Internal`}
            href={{
              pathname: "/profile/settings/internal",
            }}
          />
        )}
      </View>
    </View>
  );
}

function SettingsPageLink(props: {
  setting: string;
  href: Href;
  icon?:
    | "gear"
    | "person"
    | "magnifyingglass"
    | "chevron.right"
    | "chevron.left"
    | "checkmark";
}) {
  return (
    <Link href={props.href}>
      <View
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
          {/* <Icon name={props.icon} size={20} color={Colors.gray400} /> */}
          <ThemedText>{props.setting}</ThemedText>
        </View>
        <Icon name="chevron.right" size={20} color={Colors.gray400} />
      </View>
    </Link>
  );
}

function ProfileRowLink(props: { label: string; href: string }) {
  return (
    <InAppBrowserLink href={props.href}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 8,
          paddingHorizontal: 16,
          backgroundColor: Colors.black,
          borderRadius: 16,
        }}
      >
        <ThemedLink>{props.label}</ThemedLink>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Icon name="safari" size={20} color={Colors.gray300} />
          <Icon name="chevron.right" size={20} color={Colors.gray300} />
        </View>
      </View>
    </InAppBrowserLink>
  );
}
