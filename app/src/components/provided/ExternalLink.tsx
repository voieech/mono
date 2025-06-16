import type { ComponentProps } from "react";
import { Href, Link } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { Platform } from "react-native";

export function ExternalLink({
  href,
  ...rest
}: Omit<ComponentProps<typeof Link>, "href"> & {
  href: Href & string;
}) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (Platform.OS !== "web") {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href);
        }
      }}
    />
  );
}
