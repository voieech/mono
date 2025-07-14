import { useEffect, useState, type PropsWithChildren } from "react";

import { SettingContext } from "@/context";
import {
  settings,
  defaultSettingState,
  settingsInLocalStorage,
  type SettingState,
  posthog,
  localStorage,
} from "@/utils";

export function SettingsProvider(props: PropsWithChildren) {
  const [settingState, setSettingState] =
    useState<SettingState>(defaultSettingState);

  useEffect(() => {
    settingsInLocalStorage.read().then(async ([err, data]) => {
      if (err !== null) {
        // Only on first use, since setting data not in local storage yet, we
        // will write the default settings in
        if (err.name === localStorage.notFoundErrorName) {
          await settingsInLocalStorage.resetToDefault();
        }
        return;
      }

      setSettingState(data);
    });
  }, [setSettingState]);

  return (
    <SettingContext
      value={{
        settings,
        getSetting(setting) {
          return settingState[setting];
        },
        updateSetting(setting, newValue) {
          const oldValue = settingState[setting] as any;

          const newSetting = {
            ...settingState,
            [setting]: newValue,
          };
          setSettingState(newSetting);
          settingsInLocalStorage.update(newSetting);

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
