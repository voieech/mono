import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function TabTwoScreen() {
  return (
    <SafeAreaView>
      <ThemedView
        style={{
          flexDirection: "column",
          gap: 16,
        }}
      >
        <ThemedText type="title">Explore</ThemedText>
        <ThemedText>This is the for you page</ThemedText>
      </ThemedView>
    </SafeAreaView>
  );
}
