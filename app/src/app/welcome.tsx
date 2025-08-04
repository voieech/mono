import { Image } from "expo-image";
import { Button, Dimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText, ThemedView } from "@/components";
import { useThemeColor } from "@/hooks";
import { seeIntroSetting } from "@/utils";

type WelcomeProps = {
  setShowIntro: (val: boolean) => void;
};

export default function Welcome({ setShowIntro }: WelcomeProps) {
  const backgroundColor = useThemeColor("background");
  const { width, height } = Dimensions.get("window");
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <ScrollView
        style={{ flex: 1, backgroundColor }}
        horizontal={true}
        scrollEventThrottle={16}
        pagingEnabled={true}
      >
        <ThemedView style={{ height, width }}>
          <ThemedView
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 30,
            }}
          >
            <Image
              // @todo replace absolute image path
              source={require("@/assets/images/logo.png")}
              style={{
                height: "100%",
                width: "100%",
                maxHeight: 108,
              }}
            />
            <ThemedText
              style={{
                fontSize: 30,
                fontWeight: "bold",
                paddingTop: 30,
              }}
            >
              Welcome to Voieech
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 20,
                textAlign: "center",
                paddingTop: 10,
              }}
            >
              Where we bring voices to text
            </ThemedText>
            <ThemedView style={{ paddingTop: 20 }}>
              <Button
                onPress={() => {
                  seeIntroSetting.update(false);
                  setShowIntro(false);
                }}
                title="Continue"
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
