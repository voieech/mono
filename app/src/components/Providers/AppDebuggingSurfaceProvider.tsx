import { type PropsWithChildren, useState } from "react";

import { AppDebuggingSurfaceContext } from "@/context";

export function AppDebuggingSurfaceProvider(props: PropsWithChildren) {
  const [showDebuggingSurfaces, setShowDebuggingSurfaces] = useState(__DEV__);
  return (
    <AppDebuggingSurfaceContext
      value={{
        showDebuggingSurfaces,
        setShowDebuggingSurfaces,
      }}
    >
      {props.children}
    </AppDebuggingSurfaceContext>
  );
}
