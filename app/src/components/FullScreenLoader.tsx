import type { MessageDescriptor } from "@lingui/core";

import { Image } from "expo-image";
import { useEffect, useState } from "react";

import { ThemedText } from "@/components/NewThemedText";
import { ThemedView } from "@/components/ThemedView";
import { linguiMsgToString } from "@/utils";

export function FullScreenLoader(props: {
  /**
   * Allow users to set a delay in ms before loader is shown to improve
   * UX and perceived performance, by not flashing the loader momentarily
   * especially if the loader is only displayed for a short period of time, for
   * e.g. if your API call is very fast.
   *
   * Defaults to 500ms if not set.
   */
  delayInMsBeforeShowingLoader?: number;

  /**
   * Custom loading message to override the default loading message
   */
  loadingMessage?: MessageDescriptor | string;
}) {
  const loadingMessage = props.loadingMessage ?? "...loading...";

  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setShowLoader(true),
      props.delayInMsBeforeShowingLoader ?? 500,
    );
    return () => clearTimeout(timer);
  }, [props.delayInMsBeforeShowingLoader]);

  if (!showLoader) {
    return null;
  }

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
      <ThemedText type="xl-bold">
        {linguiMsgToString(loadingMessage)}
      </ThemedText>
    </ThemedView>
  );
}

// Generate 0-2 to randomly pick one of the gifs
const loadingImageSource = [
  require("@/assets/images/loading/1.webp"),
  require("@/assets/images/loading/2.gif"),
  require("@/assets/images/loading/3.gif"),
][Math.trunc(Math.random() * 3)];
