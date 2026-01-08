import { useLingui } from "@lingui/react/macro";
import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function CreateLayout() {
  const { t } = useLingui();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: t`Create`,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="youtube-video-summary-create"
        options={{
          title: t`Youtube Video Summary Create`,
          headerShown: false,
        }}
      />
    </Stack>
  );
}
