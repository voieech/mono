import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="default-content-preference-selection"
        options={{
          title: "Default Content Preference Selection",
        }}
      />
    </Stack>
  );
}
