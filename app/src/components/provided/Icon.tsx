// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { type StyleProp, type TextStyle } from "react-native";

import type { ColorValues } from "@/constants";

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 * - Use this <https://hotpot.ai/free-icons> to find matching icons between them
 */
const SfSymbolsToMaterialIconsMapping = {
  magnifyingglass: "search",
  person: "person",
  gear: "settings",
  "pause.fill": "pause",
  "play.fill": "play-arrow",
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.left": "chevron-left",
  "chevron.right": "chevron-right",
  "chevron.down": "keyboard-arrow-down",
  ellipsis: "more-horiz",
  "goforward.10": "forward-10",
  "gobackward.10": "replay-10",
  "forward.end.fill": "skip-next",
  "backward.end.fill": "skip-previous",
  "square.and.arrow.up": "share",
  shuffle: "shuffle",
  repeat: "repeat",
  "repeat.1": "repeat-one",
  checkmark: "check",
  heart: "favorite-border",
  "heart.fill": "favorite",
  "hand.thumbsup.fill": "thumb-up",
  "hand.thumbsdown.fill": "thumb-down",
  trash: "delete-forever",
  "list.dash": "playlist-play",
  plus: "add",

  // Using satisfies and partial to ensure that users can only use icons after
  // they added the SF->MI mapping here.
} satisfies Partial<
  Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>
>;

type IconSymbolName = keyof typeof SfSymbolsToMaterialIconsMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on
 * Android and web. This ensures a consistent look across platforms, and optimal
 * resource usage. Icon `name`s are based on SF Symbols and require manual
 * mapping to Material Icons defined above.
 */
export function Icon({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: ColorValues;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={SfSymbolsToMaterialIconsMapping[name]}
      style={style}
    />
  );
}
