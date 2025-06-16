import { PropsWithChildren, useState } from "react";
import { TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "./IconSymbol";
import { Colors } from "@/constants";
import { useColorScheme } from "react-native";

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
        <IconSymbol
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
            marginTop: 6,
            marginLeft: 24,
          }}
        >
          {children}
        </ThemedView>
      )}
    </ThemedView>
  );
}
