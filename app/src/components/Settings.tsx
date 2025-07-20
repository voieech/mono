import { useEffect, useState, type PropsWithChildren } from "react";

import { SettingContext } from "@/context";
import {
  settings,
  defaultSettingState,
  settingsInLocalStorage,
  type SettingState,
  posthog,
} from "@/utils";

export function SettingsProvider(props: PropsWithChildren) {
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);
  const [settingState, setSettingState] =
    useState<SettingState>(defaultSettingState);

  useEffect(() => {
    settingsInLocalStorage.read().then((settings) => {
      setSettingState(settings);
      setIsSettingsLoaded(true);
    });
  }, [setSettingState, setIsSettingsLoaded]);

  // Dont return context and its children until settings data is loaded to
  // prevent showing wrong settings and re-rendering again after settings loads.
  if (!isSettingsLoaded) {
    return null;
  }

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
