import PostHog from "posthog-react-native";

import { envVar } from "./envVar";

export const posthog = new PostHog(envVar.posthogApiKey, {
  disabled: __DEV__,
  captureAppLifecycleEvents: true,
});
