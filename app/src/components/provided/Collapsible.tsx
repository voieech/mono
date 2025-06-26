import { PropsWithChildren, useState } from "react";
import { TouchableOpacity, useColorScheme } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants";

import { Icon } from "./Icon";

export function Collapsible({
  children,
  title,
  openByDefault,
}: PropsWithChildren & {
  title: string;
  openByDefault?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(openByDefault ?? false);
  const theme = useColorScheme() ?? "light";

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
          color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? "90deg" : "0deg" }] }}
        />

        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && (
        <ThemedView
          style={{
            paddingTop: 6,
            paddingLeft: 24,
          }}
        >
          {children}
        </ThemedView>
      )}
    </ThemedView>
  );
}
