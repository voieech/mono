import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { IconSymbol, TabBarBackground } from "@/components";
import { useTheme } from "@/hooks";
import { Colors } from "@/constants";

export default function TabLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tint,
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="magnifyingglass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="personalisation"
        options={{
          // @todo Temporarily hide this until this is available
          href: null,

          title: "For You",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="person" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <IconSymbol size={size} name="gear" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
