import { useLingui } from "@lingui/react/macro";
import { Stack } from "expo-router";

export default function ProfileLayout() {
  const { t } = useLingui();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: t`Profile`,
        }}
      />
      <Stack.Screen
        name="profile-page"
        options={{
          title: t`Profile`,
          headerBackTitle: t`Back`,
        }}
      />
      <Stack.Screen
        name="subscriptions"
        options={{
          title: t`Subscriptions`,
          headerBackTitle: t`Back`,
        }}
      />
      <Stack.Screen
        name="history"
        options={{
          title: t`History`,
          headerBackTitle: t`Back`,
        }}
      />
      <Stack.Screen
        name="likes"
        options={{
          title: t`Likes`,
          headerBackTitle: t`Back`,
        }}
      />
      <Stack.Screen
        name="contact-form"
        options={{
          title: t`Contact Us`,
          headerBackTitle: t`Back`,
        }}
      />
      <Stack.Screen
        name="settings/notifications"
        options={{
          title: t`Notifications`,
          headerBackTitle: t`Back`,
        }}
      />
      <Stack.Screen
        name="settings/audio-playback"
        options={{
          title: t`Audio Playback`,
          headerBackTitle: t`Back`,
        }}
      />
      <Stack.Screen
        name="settings/language"
        options={{
          title: t`Language`,
          headerBackTitle: t`Back`,
        }}
      />
      <Stack.Screen
        name="settings/personalisation"
        options={{
          title: t`Personalisation`,
          headerBackTitle: t`Back`,
        }}
      />
      <Stack.Screen
        name="settings/app-details"
        options={{
          title: t`App Details`,
          headerBackTitle: t`Back`,
        }}
      />
      <Stack.Screen
        name="settings/internal"
        options={{
          title: "Internal",
          headerBackTitle: t`Back`,
        }}
      />
    </Stack>
  );
}
