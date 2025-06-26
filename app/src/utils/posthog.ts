import PostHog from "posthog-react-native";
import Config from "react-native-config";

export const posthog = new PostHog(Config.POSTHOG_API_KEY, {
  disabled: __DEV__,
  captureAppLifecycleEvents: true,
});
