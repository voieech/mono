import { useLingui } from "@lingui/react/macro";
import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function SearchLayout() {
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
          title: t`Search`,
          headerShown: false,
        }}
      />
    </Stack>
  );
}
