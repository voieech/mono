import { useLingui } from "@lingui/react/macro";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { useFeatureFlag } from "posthog-react-native";
import { Platform, View } from "react-native";

import {
  Icon,
  TabBarBackground,
  ThemedView,
  BottomOverlayAudioPlayer,
} from "@/components";
import { Colors } from "@/constants";
import { useTheme } from "@/hooks";

export default function TabLayout() {
  const isInternalUser = useFeatureFlag("internal");
  const theme = useTheme();
  const { t } = useLingui();
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
          // The player overlay needs to float on top of the tab bar, which
          // means it needs to know the height of the tab bar to do that.
          // The height of the tab bar is dynamically set internally if it is
          // not supplied depending on things like device type, rotation, etc...
          // The recommended way of getting the actual tab bar height is to use
          // the provided hook, but since the hook cannot be used outside of the
          // context provider, this does not work, since we need to get the
          // height of the tab bar before the tab bar is created.
          // So looking through the tab bar implementation, it seems like there
          // is 2 hardcoded height values, 49 and 32. So the easiest solution is
          // to just find the midpoint between the 2 hardcoded values (40) and
          // use this as the hardcoded height value for both the tab bar and the
          // player overlay's buffer, and do away with relying on the dynamic
          // tab bar height that is only available after component creation.
          const tabBarHeight = 40 + props.insets.bottom;

          return (
            <ThemedView>
              <BottomOverlayAudioPlayer tabBarHeight={tabBarHeight} />
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
            title: t`Explore`,
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

            title: t`For You`,
            tabBarIcon: ({ color, size }) => (
              <Icon size={size} name="person" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: t`Settings`,
            tabBarIcon: ({ color, size }) => (
              <Icon size={size} name="gear" color={color} />
            ),
          }}
        />
        {(__DEV__ || isInternalUser) && (
          <Tabs.Screen
            name="profile"
            options={{
              title: t`Me`,
              tabBarIcon: ({ color, size }) => (
                <Icon size={size} name="person" color={color} />
              ),
            }}
          />
        )}
      </Tabs>
    </View>
  );
}
