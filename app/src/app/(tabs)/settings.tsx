import {
  ParallaxScrollViewContainer,
  ThemedText,
  IconSymbol,
  Collapsible,
} from "@/components";

export default function Settings() {
  return (
    <ParallaxScrollViewContainer
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
    </ParallaxScrollViewContainer>
  );
}
