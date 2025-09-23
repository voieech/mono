import { getLocales } from "expo-localization";

export const getDeviceLanguage = () => getLocales()[0]?.languageCode ?? "en";
