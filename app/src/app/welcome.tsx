import { Image } from "expo-image";
import { View, Dimensions, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components";
import { useSettingContext } from "@/context";

export default function Welcome() {
  const settingContext = useSettingContext();
  const width = Dimensions.get("window").width;
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
        <View style={{ width }}>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 30,
              paddingBottom: 24,
            }}
          >
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
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
              <View style={{ backgroundColor: "black", alignItems: "center" }}>
                <ThemedText type="title">Welcome to Voieech</ThemedText>
                <ThemedText type="default" style={{ textAlign: "center" }}>
                  Enjoy a hyper-personalized podcast, tailored to you
                </ThemedText>
              </View>
            </View>
            <Pressable
              onPress={() =>
                settingContext.updateSetting(
                  "lastOnboardingTime",
                  new Date().toISOString(),
                )
              }
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.5 : 1,
                },
                {
                  backgroundColor: "#00BFFF",
                  borderWidth: 2,
                  borderRadius: 20,
                  alignItems: "center",
                },
              ]}
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
