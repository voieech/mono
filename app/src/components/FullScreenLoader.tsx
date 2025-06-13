import { Image } from "expo-image";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export function FullScreenLoader(props: { loadingMessage?: string }) {
  const loadingMessage = props.loadingMessage ?? "...loading...";
  return (
    <ThemedView
      style={{
        padding: "10%",
      }}
    >
      <Image
        source={loadingImageSource}
        style={{
          height: "100%",
          resizeMode: "contain",
        }}
        alt="Loading Image"
      />
      <ThemedText type="title">{loadingMessage}</ThemedText>
    </ThemedView>
  );
}

// Generate 0-2 to randomly pick one of the gifs
const loadingImageSource = [
  require("@/assets/images/loading/1.webp"),
  require("@/assets/images/loading/2.gif"),
  require("@/assets/images/loading/3.gif"),
][Math.trunc(Math.random() * 3)];
