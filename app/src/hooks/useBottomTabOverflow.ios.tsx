import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

// The hook throws when there is no context, i.e. this hook is used in a
// component that isnt in a bottom tab navigator. Instead of throwing,
// default to 0
export function useBottomTabOverflow() {
  try {
    return useBottomTabBarHeight();
  } catch {
    return 0;
  }
}
