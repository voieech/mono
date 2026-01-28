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
    useState<Partial<SettingState>>(defaultSettingState);

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
          return settingState[setting] ?? defaultSettingState[setting];
        },
        updateSetting(settingName, newSettingValue) {
          const oldSettingValue = settingState[settingName] as any;

          const setting = settings[settingName];

          // Call the beforeChange callback if available to process/transform
          // the values before saving. The types are widened to be `any` here
          // since the types can be generic on the extended Setting interfaces
          // e.g. a string literal type is used
          const processedNewValue =
            setting.beforeChange?.(
              // @ts-expect-error Unable to easily narrow the generic type down
              newSettingValue as any,
              oldSettingValue,
            ) ?? newSettingValue;

          const newSetting = {
            ...settingState,
            [settingName]: processedNewValue,
          };
          setSettingState(newSetting);
          settingsInLocalStorage.update(newSetting);

          // Call the onChange callback, the types are widened to be `any` here
          // since the types can be generic on the extended Setting interfaces
          // e.g. a string literal type is used
          setting.onChange?.(
            // @ts-expect-error Unable to easily narrow the generic type down
            newSettingValue as any,
            oldSettingValue,
          );

          posthog.capture("setting_update", {
            setting: settingName,
            oldValue: oldSettingValue,
            newValue: newSettingValue,
          });
        },
      }}
    >
      {props.children}
    </SettingContext>
  );
}
