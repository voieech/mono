import { Image } from "expo-image";
import { View, Dimensions, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components";
import { seeIntroSetting } from "@/utils";

export default function Welcome(props: { onReload: (val: boolean) => void }) {
  const width = Dimensions.get("window").width;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
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
                <ThemedText type="default">
                  Where we bring voices to text
                </ThemedText>
              </View>
            </View>
            <Pressable
              onPress={() => {
                seeIntroSetting.update({
                  lastSeenISO: new Date().toISOString(),
                  showIntro: false,
                });
                props.onReload(true);
              }}
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
              <ThemedText type="title" style={{ padding: 15 }}>
                Start
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
