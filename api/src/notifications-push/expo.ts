import { Expo } from "expo-server-sdk";

if (process.env["EXPO_PUSH_NOTIFICATIONS_ACCESS_TOKEN"] === undefined) {
  throw new Error(
    `process.env.EXPO_PUSH_NOTIFICATIONS_ACCESS_TOKEN is undefined`,
  );
}

export const expo = new Expo({
  accessToken: process.env["EXPO_PUSH_NOTIFICATIONS_ACCESS_TOKEN"],
});
