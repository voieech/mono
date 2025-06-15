import { Collapsible } from "@/components/Collapsible";
import { ParallaxScrollView } from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerImage={
        <IconSymbol
          size={360}
          color="#D0D0D0"
          name="gear"
          style={{
            bottom: -120,
            left: -80,
            position: "absolute",
          }}
        />
      }
      innerContentStyle={{
        padding: 32,
        gap: 16,
      }}
    >
      <ThemedText type="title">Settings</ThemedText>
      <Collapsible title="Audio Playback">
        <ThemedText>Default audio playback speed: {1}</ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}
