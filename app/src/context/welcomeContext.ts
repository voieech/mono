import { createContext, useContext } from "react";

import { WelcomeSettingState } from "@/utils";

export const WelcomeContext = createContext<{
  hasSeenWelcome: WelcomeSettingState;
  markWelcomeSeen: () => void;
}>({
  hasSeenWelcome: {},
  markWelcomeSeen: () => {},
});

export const useWelcomeContext = () => useContext(WelcomeContext);
