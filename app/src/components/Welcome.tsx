import { PropsWithChildren, useEffect, useState } from "react";

import { WelcomeContext } from "@/context";
import { welcomeSettings, WelcomeSettingState } from "@/utils";

export function WelcomeProvider(props: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenWelcome, setHasSeenWelcome] = useState<
    Partial<WelcomeSettingState>
  >({});

  useEffect(() => {
    welcomeSettings.read().then((settings) => {
      setHasSeenWelcome(settings);
      setIsLoading(false);
    });
  }, [setIsLoading, setHasSeenWelcome]);

  /**
   * Don't return context and it's children until setting data is loaded to prevent showing
   * wrong settings and re-rendering again after settings loads.
   */
  if (isLoading) {
    return null;
  }

  return (
    <WelcomeContext
      value={{
        hasSeenWelcome,
        markWelcomeSeen() {
          const newWelcomeSettings = { lastSeenISO: new Date().toISOString() };
          welcomeSettings.update(newWelcomeSettings);
          setHasSeenWelcome(newWelcomeSettings);
        },
      }}
    >
      {props.children}
    </WelcomeContext>
  );
}
