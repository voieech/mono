declare module "react-native-config" {
  export const Config: NativeConfig;
  export default Config;

  export interface NativeConfig {
    POSTHOG_API_KEY: string;
  }
}
