import type { ExternalPathString } from "expo-router";
import type { PropsWithChildren } from "react";

import { Link } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

/**
 * Wrapper around `expo-router` library's `Link` component, to open given link
 * in the in app modal browser instead of the external system browser.
 */
export function InAppBrowserLink(
  props: PropsWithChildren<{ href: ExternalPathString }>,
) {
  return (
    <Link
      href={props.href}
      onPress={async (e: any) => {
        // Allow default behaviour to continue for web platform
        if (Platform.OS === "web") {
          return;
        }

        // Prevent default behavior of opening system browser, and open in
        // in-app modal browser instead
        e.preventDefault();
        await WebBrowser.openBrowserAsync(props.href);
      }}
    >
      {props.children}
    </Link>
  );
}
