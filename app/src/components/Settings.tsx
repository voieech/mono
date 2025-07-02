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

          // Call the onChange callback, the types are widened to be `any` here
          // since the types can be generic on the extended Setting interfaces
          // e.g. a string literal type is used
          settings[setting]?.onChange?.(
            settingState[setting] as any,
            value as any
          );
        },
      }}
    >
      {props.children}
    </SettingContext>
  );
}
