import { Image } from "expo-image";
import { View, Pressable, ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components";
import { useSettingContext } from "@/context";

export default function Welcome() {
  const windowDimensions = useWindowDimensions();
  const settingContext = useSettingContext();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "black",
      }}
    >
      <ScrollView
        style={{ flex: 1 }}
        horizontal={true}
        // scrollEventThrottle={16}
        // pagingEnabled={true}
        scrollEnabled={false} // disabled scolling for now until more pages are added into welcome screen
      >
        <View
          style={{
            width: windowDimensions.width,
          }}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: 24,
              paddingBottom: 24,
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                rowGap: 8,
              }}
            >
              <Image
                source={require("@/assets/images/logo.png")}
                style={{
                  height: "100%",
                  width: "100%",
                  maxHeight: 108,
                }}
              />
              <ThemedText type="subtitle">
                Your Hyper Personalized Podcasts
              </ThemedText>
            </View>
            <Pressable
              onPress={() =>
                settingContext.updateSetting(
                  "lastOnboardingTime",
                  new Date().toISOString(),
                )
              }
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
                backgroundColor: "#00BFFF",
                borderWidth: 2,
                borderRadius: 20,
                alignItems: "center",
              })}
            >
              <ThemedText type="subtitle" style={{ padding: 15 }}>
                Start listening
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
