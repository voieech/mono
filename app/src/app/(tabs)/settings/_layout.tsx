import { useLingui } from "@lingui/react/macro";
import { Stack } from "expo-router";

export default function SettingsLayout() {
  const { t } = useLingui();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Settings",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="audio-playback"
        options={{
          title: t`Audio Playback`,
        }}
      />
      <Stack.Screen
        name="content-language"
        options={{
          title: t`Content Language`,
        }}
      />
      <Stack.Screen
        name="personalisation"
        options={{
          title: t`Personalisation`,
        }}
      />
      <Stack.Screen
        name="app-details"
        options={{
          title: t`App Details`,
        }}
      />
      <Stack.Screen
        name="internal"
        options={{
          title: "Internal",
        }}
      />
    </Stack>
  );
}
