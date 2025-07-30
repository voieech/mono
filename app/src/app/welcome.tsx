import { Image } from "expo-image";
import { Dimensions, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText, ThemedView } from "@/components";
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
        <ThemedView style={{ width }}>
          <ThemedView
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 30,
              backgroundColor: "black",
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
            <ThemedView
              style={{
                backgroundColor: "black",
                position: "absolute",
                bottom: 100,
              }}
            >
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
                    borderWidth: 3,
                    borderColor: "yellow",
                    borderRadius: 30,
                  },
                ]}
              >
                <ThemedText
                  style={{
                    color: "yellow",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 26,
                    padding: 15,
                  }}
                >
                  Start
                </ThemedText>
              </Pressable>
              {/* <Button color={"yellow"} title="Start" /> */}
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
