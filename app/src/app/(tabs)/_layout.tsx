import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Platform, View } from "react-native";

import {
  Icon,
  TabBarBackground,
  ThemedView,
  PlayerOverlay,
} from "@/components";
import { Colors } from "@/constants";
import { useTheme } from "@/hooks";

export default function TabLayout() {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[theme].tint,
          // tabBarActiveBackgroundColor: "grey",
          // tabBarIconStyle: {
          //   backgroundColor: "yellow",
          // },
          // tabBarLabelStyle: {
          //   backgroundColor: "blue",
          // },
          // tabBarItemStyle: {
          //   backgroundColor: "green",
          //   borderRadius: 16,
          // },
          // tabBarItemStyle: {
          //   backgroundColor: "green",
          //   borderRadius: 16,
          //   opacity: 20,
          // },
          // tabBarStyle: {
          //   ...Platform.select({
          //     ios: {
          //       // Use a transparent background on iOS to show the blur effect
          //       position: "absolute",
          //     },
          //     default: {},
          //   }),
          //   backgroundColor: "transparent",
          //   opacity: 80,
          // },

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
        tabBar={(props) => {
          // @todo 49 and 32 are the hardcoded values
          // 40 is the midpoint between the 2
          // const tabBarHeight = 49 + props.insets.bottom;
          // const tabBarHeight = 32 + props.insets.bottom;
          const tabBarHeight = 40 + props.insets.bottom;

          return (
            <ThemedView>
              <PlayerOverlay tabBarHeight={tabBarHeight} />
              <BottomTabBar
                {...props}
                // Custom tab bar height using the same formula as the library
                style={{
                  height: tabBarHeight,
                }}
              />
            </ThemedView>
          );
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            title: "Explore",
            tabBarIcon: ({ color, size }) => (
              <Icon size={size} name="magnifyingglass" color={color} />
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
              <Icon size={size} name="person" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Icon size={size} name="gear" color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
