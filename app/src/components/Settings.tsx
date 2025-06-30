import { useState, type PropsWithChildren } from "react";

import { SettingContext } from "@/context";
import { settings, type SettingState } from "@/utils";

export function SettingsProvider(props: PropsWithChildren) {
  const [settingState, setSettingState] = useState<SettingState>({
    externalMediaControls: "jump-time",
    defaultPlaybackSpeed: "1",
  });
  return (
    <SettingContext
      value={{
        settings,
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
