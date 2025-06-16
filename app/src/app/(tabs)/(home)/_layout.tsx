import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Home",
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
        options={{ title: "Podcast Channel" }}
      />
      <Stack.Screen
        name="podcast/episode/[vanityID]"
        options={{ title: "Podcast Episode" }}
      />
    </Stack>
  );
}
