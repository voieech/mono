import { useLingui } from "@lingui/react/macro";
import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function HomeLayout() {
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
          title: t`Home`,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="featured-channels"
        options={{
          title: t`Featured Channels`,
          headerShown: false,
        }}
      />

      {/*
        These title have no effect since the headers are not shown, but just
        them adding here instead of leaving up to the individual page route to
        deal with setting it as headers might be shown in the future.
      */}
      <Stack.Screen
        name="podcast/channel/[channelID]"
        options={{
          title: t`Podcast Channel`,
        }}
      />
      <Stack.Screen
        name="podcast/episode/[vanityID]"
        options={{
          title: t`Podcast Episode`,
        }}
      />
    </Stack>
  );
}
