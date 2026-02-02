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
        name="settings/audio-playback"
        options={{
          title: t`Audio Playback`,
          headerBackTitle: t`Back`,
        }}
      />
      <Stack.Screen
        name="settings/content-language"
        options={{
          title: t`Content Language`,
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
