import PostHog from "posthog-react-native";

export const posthog = new PostHog("phc_2c404JOxNanNDgJNdagtfwqc95BNVTIJVQLsMB75uh5", {
  disabled: __DEV__,
  captureAppLifecycleEvents: true,
});
