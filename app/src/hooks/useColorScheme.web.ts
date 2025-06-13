import { useEffect, useState } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
import { isThemeFixed, DefaultTheme } from "@/constants/FixedTheme";

/**
 * To support static rendering, this value needs to be re-calculated on the
 * client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (isThemeFixed) {
    return DefaultTheme;
  }

  if (hasHydrated) {
    return colorScheme;
  }

  return DefaultTheme;
}
