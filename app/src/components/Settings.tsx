import { useState, type PropsWithChildren } from "react";

import { settings, SettingContext, type SettingState } from "@/context";

export function SettingsProvider(props: PropsWithChildren) {
  const [settingState, setSettingState] = useState<SettingState>({
    externalMediaControls: "jump-time",
    defaultPlaybackSpeed: "1",
  });
  return (
    <SettingContext
      value={{
        settings,
        settingState,
        getSetting(setting) {
          return settingState[setting];
        },
        updateSetting(setting, value) {
          setSettingState((state) => ({
            ...state,
            [setting]: value,
          }));
        },
      }}
    >
      {props.children}
    </SettingContext>
  );
}
