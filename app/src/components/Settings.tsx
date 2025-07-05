import { useState, type PropsWithChildren } from "react";

import { SettingContext } from "@/context";
import {
  settings,
  defaultSettingState,
  type SettingState,
  posthog,
} from "@/utils";

export function SettingsProvider(props: PropsWithChildren) {
  const [settingState, setSettingState] =
    useState<SettingState>(defaultSettingState);
  return (
    <SettingContext
      value={{
        settings,
        getSetting(setting) {
          return settingState[setting];
        },
        updateSetting(setting, newValue) {
          const oldValue = settingState[setting] as any;

          setSettingState((state) => ({
            ...state,
            [setting]: newValue,
          }));

          // Call the onChange callback, the types are widened to be `any` here
          // since the types can be generic on the extended Setting interfaces
          // e.g. a string literal type is used
          settings[setting]?.onChange?.(newValue as any, oldValue);

          posthog.capture("setting_update", {
            setting,
            oldValue,
            newValue,
          });
        },
      }}
    >
      {props.children}
    </SettingContext>
  );
}
