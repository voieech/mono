import type { PropsWithChildren } from "react";

import { ScrollViewContainer, VerticalSpacer } from "@/components";

export function SettingsPageLayout(props: PropsWithChildren) {
  return (
    <ScrollViewContainer>
      {props.children}
      <VerticalSpacer height={32} />
    </ScrollViewContainer>
  );
}
