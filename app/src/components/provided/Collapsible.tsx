import { PropsWithChildren, useState } from "react";
import { TouchableOpacity, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants";
import { useTheme } from "@/hooks";

import { Icon } from "./Icon";

export function Collapsible(
  props: PropsWithChildren<{
    title: string;
    openByDefault?: boolean;
    expandedViewStyle?: ViewStyle;
  }>,
) {
  const [isOpen, setIsOpen] = useState(props.openByDefault ?? false);
  const theme = useTheme();

  return (
    <ThemedView>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}
      >
        <Icon
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme === "light" ? Colors.gray500 : Colors.neutral500}
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
        />
        <ThemedText type="base-semibold">{props.title}</ThemedText>
      </TouchableOpacity>
      {isOpen && (
        <ThemedView
          style={[
            {
              paddingTop: 6,
              paddingLeft: 24,
            },
            props.expandedViewStyle,
          ]}
        >
          {props.children}
        </ThemedView>
      )}
    </ThemedView>
  );
}
