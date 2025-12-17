import { useLingui, Trans } from "@lingui/react/macro";
import { nativeApplicationVersion, nativeBuildVersion } from "expo-application";
import { getLocales, getCalendars } from "expo-localization";
import { Link } from "expo-router";
import * as ExpoUpdates from "expo-updates";
import { useFeatureFlag } from "posthog-react-native";
import { Fragment } from "react";
import { Pressable, Switch, useWindowDimensions, View } from "react-native";
import Toast from "react-native-root-toast";

import type { ExperimentalSurfaceName } from "@/utils";

import {
  ParallaxScrollViewContainer,
  OldThemedText,
  Icon,
  Collapsible,
  ThemedView,
  CopyOnPress,
  PlaybackRateButton,
} from "@/components";
import {
  useSettingContext,
  useAppDebuggingSurfaceContext,
  useExperimentalSurfaceContext,
} from "@/context";
import { posthog, linguiMsgToString } from "@/utils";

export default function Settings() {
  const settingContext = useSettingContext();
  const appDebuggingSurfaceContext = useAppDebuggingSurfaceContext();
  const isInternalUser = useFeatureFlag("internal");
  const deviceLocale = getLocales()[0]!;
  const deviceCalendar = getCalendars()[0];
  const posthogDistinctID = posthog.getDistinctId();
  const { t } = useLingui();
  return (
    <ParallaxScrollViewContainer
      headerImage={
        <Icon
          size={360}
          color="#D0D0D0"
          name="gear"
          style={{
            bottom: -120,
            left: -80,
            position: "absolute",
          }}
        />
      }
      innerContentStyle={{
        padding: 32,
        gap: 16,
      }}
    >
      <OldThemedText type="title">
        <Trans>Settings</Trans>
      </OldThemedText>

      <Collapsible
        title={t`Audio Playback`}
        expandedViewStyle={{
          rowGap: 16,
          paddingBottom: 32,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",

            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: "black",
            borderRadius: 16,
          }}
        >
          <OldThemedText>
            <Trans>Default audio playback rate</Trans>
          </OldThemedText>
          <View
            style={{
              paddingVertical: 2,
              paddingHorizontal: 8,
              backgroundColor: "#999",
              borderRadius: 8,
            }}
          >
            <PlaybackRateButton fontSize={18} />
          </View>
        </View>
        <View
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: "black",
            borderRadius: 16,
          }}
        >
          <OldThemedText type="semiBold">
            {linguiMsgToString(
              settingContext.settings.externalMediaControls.name,
            )}
          </OldThemedText>
          <OldThemedText
            style={{
              fontSize: 14,
              color: "#999",
              lineHeight: 20,
            }}
          >
            {linguiMsgToString(
              settingContext.settings.externalMediaControls.description,
            )}
          </OldThemedText>
          <View
            style={{
              backgroundColor: "#777",
              height: 0.5,
              marginTop: 8,
              marginBottom: 16,
            }}
          />
          {settingContext.settings.externalMediaControls.options.map(
            (option, index) => (
              <Fragment key={option.value}>
                {index !== 0 && (
                  <View
                    style={{
                      backgroundColor: "#444",
                      height: 0.5,
                      marginVertical: 8,
                    }}
                  />
                )}
                <Pressable
                  onPress={() => {
                    settingContext.updateSetting(
                      "externalMediaControls",
                      option.value,
                    );
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <OldThemedText
                      style={{
                        flexShrink: 1,
                      }}
                    >
                      {linguiMsgToString(option.name)}
                    </OldThemedText>
                    <View>
                      {option.value ===
                        settingContext.getSetting("externalMediaControls") && (
                        <Icon name="checkmark" color="#16a34a" />
                      )}
                    </View>
                  </View>
                </Pressable>
              </Fragment>
            ),
          )}
        </View>
        <SwitchSettingRow
          settingTitle={linguiMsgToString(
            settingContext.settings.rewindToStartOnSkipPrevious.name,
          )}
          description={linguiMsgToString(
            settingContext.settings.rewindToStartOnSkipPrevious.description,
          )}
          switchValue={settingContext.getSetting("rewindToStartOnSkipPrevious")}
          onValueChange={(value) =>
            settingContext.updateSetting("rewindToStartOnSkipPrevious", value)
          }
        />
      </Collapsible>
      <Collapsible
        title={t`Content Language`}
        expandedViewStyle={{
          paddingTop: 16,
          rowGap: 16,
          paddingBottom: 32,
        }}
      >
        <View
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: "black",
            borderRadius: 16,
          }}
        >
          <OldThemedText
            style={{
              fontSize: 14,
              color: "#999",
              lineHeight: 20,
            }}
          >
            {linguiMsgToString(
              settingContext.settings.contentLanguage.description,
            )}
          </OldThemedText>
          <View
            style={{
              backgroundColor: "#777",
              height: 0.5,
              marginTop: 8,
              marginBottom: 16,
            }}
          />
          {settingContext.settings.contentLanguage.options.map(
            (option, index) => (
              <Fragment key={option.value}>
                {index !== 0 && (
                  <View
                    style={{
                      backgroundColor: "#444",
                      height: 0.5,
                      marginVertical: 12,
                    }}
                  />
                )}
                <Pressable
                  onPress={() => {
                    settingContext.updateSetting("contentLanguage", [
                      option.value,
                    ]);
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <OldThemedText
                      style={{
                        flexShrink: 1,
                      }}
                    >
                      {linguiMsgToString(option.name)}
                    </OldThemedText>
                    <View>
                      {settingContext
                        .getSetting("contentLanguage")
                        .includes(option.value) && (
                        <Icon name="checkmark" color="#16a34a" size={16} />
                      )}
                    </View>
                  </View>
                </Pressable>
              </Fragment>
            ),
          )}
        </View>
      </Collapsible>
      {(__DEV__ || isInternalUser) && (
        <Collapsible
          title={t`Personalisation`}
          expandedViewStyle={{
            paddingTop: 16,
            rowGap: 16,
            paddingBottom: 32,
          }}
        >
          <Link
            href={{
              pathname: "/(onboarding)/default-content-preference-selection",
            }}
          >
            <View
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: "black",
                borderRadius: 16,
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "center",
                width: "100%",
              }}
            >
              <OldThemedText>Customise content preferences</OldThemedText>
              <Icon name="chevron.right" color="white" />
            </View>
          </Link>
        </Collapsible>
      )}
      <Collapsible
        title={t`Details`}
        expandedViewStyle={{
          paddingTop: 16,
          rowGap: 16,
          paddingBottom: 32,
        }}
      >
        <View>
          <OldThemedText type="semiBold">App Version</OldThemedText>
          <View
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor: "black",
              borderRadius: 16,
            }}
          >
            <OldThemedText>
              Native app version: {nativeApplicationVersion}
            </OldThemedText>
            <OldThemedText>
              Native build version: {nativeBuildVersion}
            </OldThemedText>
            <OldThemedText>
              Updates: {JSON.stringify(getExpoUpdatesData(), null, 2)}
            </OldThemedText>
          </View>
        </View>
        <View>
          <OldThemedText type="semiBold">Posthog Distinct ID</OldThemedText>
          <CopyOnPress
            text={posthogDistinctID}
            onCopy={() => {
              Toast.show("PostHog ID copied", {
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
                opacity: 1,
              });
            }}
          >
            <View
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: "black",
                borderRadius: 16,
              }}
            >
              <OldThemedText>{posthogDistinctID}</OldThemedText>
            </View>
          </CopyOnPress>
        </View>
      </Collapsible>
      {(__DEV__ || isInternalUser) && (
        <Collapsible title="Internal" openByDefault={__DEV__}>
          <ThemedView
            style={{
              rowGap: 8,
            }}
          >
            <Link
              href={{
                pathname: "/_sitemap",
              }}
            >
              <OldThemedText type="link">Sitemap</OldThemedText>
            </Link>
            <Link
              href={{
                pathname: "/+not-found",
                params: {},
              }}
            >
              <OldThemedText type="link">Not Found</OldThemedText>
            </Link>
            <Link
              href={{
                pathname: "/themed-text-test",
              }}
            >
              <OldThemedText type="link">Themed Text Test</OldThemedText>
            </Link>
            <SwitchSettingRow
              settingTitle="Show Debugging Surfaces"
              description="Show internal visual debugging surfaces"
              switchValue={appDebuggingSurfaceContext.showDebuggingSurfaces}
              onValueChange={
                appDebuggingSurfaceContext.setShowDebuggingSurfaces
              }
            />
            <SwitchSettingRow
              settingTitle={linguiMsgToString(
                settingContext.settings.lastOnboardingTime.name,
              )}
              description={
                settingContext.settings.lastOnboardingTime.description +
                (settingContext.getSetting("lastOnboardingTime") === ""
                  ? ""
                  : ` The last onboarding time is ${settingContext.getSetting("lastOnboardingTime")}`)
              }
              switchValue={
                settingContext.getSetting("lastOnboardingTime") === ""
              }
              onValueChange={(reset) => {
                if (reset) {
                  settingContext.updateSetting("lastOnboardingTime", "");
                } else {
                  settingContext.updateSetting(
                    "lastOnboardingTime",
                    new Date().toISOString(),
                  );
                }
              }}
            />
            <ExperimentalSurfaceSettingRow
              settingTitle="Use 'interval' instead of 'loop' for useProgress"
              description="Choose the type of useProgress hook implementation"
              experimentalSurfaceName="use-interval-for-useProgress"
            />
            <ExperimentalSurfaceSettingRow
              settingTitle="Use 'card' player instead of 'modal'"
              description="There is a bug on IOS where modal route gets warped with stack route in home page when switching between audio player modal and a route quickly"
              experimentalSurfaceName="use-card-player-instead-of-modal"
            />
            <ExperimentalSurfaceSettingRow
              settingTitle="Show all other generic experimental surfaces"
              description="For every surface that didnt specify a custom experiment name"
              experimentalSurfaceName="default"
            />
            <OldThemedText
              type="semiBold"
              style={{
                paddingVertical: 4,
              }}
            >
              Debugging Data
            </OldThemedText>
            <View
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: "black",
                borderRadius: 16,
                rowGap: 16,
              }}
            >
              <View>
                <OldThemedText
                  type="semiBold"
                  style={{
                    paddingBottom: 4,
                  }}
                >
                  Expo Updates data
                </OldThemedText>
                <OldThemedText>
                  Latest Context:{" "}
                  {JSON.stringify(ExpoUpdates.latestContext, null, 2)}
                </OldThemedText>
                <OldThemedText>
                  Update Manifest:{" "}
                  {JSON.stringify(ExpoUpdates.manifest, null, 2)}
                </OldThemedText>
              </View>
              <View>
                <OldThemedText
                  type="semiBold"
                  style={{
                    paddingBottom: 4,
                  }}
                >
                  Device i18n data
                </OldThemedText>
                <OldThemedText>
                  deviceLocale: {JSON.stringify(deviceLocale, null, 2)}
                </OldThemedText>
                <OldThemedText>
                  deviceCalendar: {JSON.stringify(deviceCalendar, null, 2)}
                </OldThemedText>
              </View>
            </View>
          </ThemedView>
        </Collapsible>
      )}
    </ParallaxScrollViewContainer>
  );
}

function ExperimentalSurfaceSettingRow(props: {
  settingTitle: string;
  description?: string;
  showDescriptionInsideRow?: boolean;
  experimentalSurfaceName: ExperimentalSurfaceName;
}) {
  const experimentalSurfaceContext = useExperimentalSurfaceContext();
  return (
    <SwitchSettingRow
      settingTitle={props.settingTitle}
      description={props.description}
      showDescriptionInsideRow={props.showDescriptionInsideRow}
      switchValue={experimentalSurfaceContext.getShowExperimentalSurface(
        props.experimentalSurfaceName,
      )}
      onValueChange={(value) =>
        experimentalSurfaceContext.setShowExperimentalSurface(
          props.experimentalSurfaceName,
          value,
        )
      }
    />
  );
}

function SwitchSettingRow(props: {
  settingTitle: string;
  description?: string;
  showDescriptionInsideRow?: boolean;
  switchValue: boolean;
  onValueChange: (newValue: boolean) => any;
}) {
  const windowDimensions = useWindowDimensions();
  return (
    <>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          columnGap: 16,

          paddingVertical: 8,
          paddingHorizontal: 16,
          backgroundColor: "black",
          borderRadius: 16,
        }}
      >
        <View
          style={{
            flexBasis: windowDimensions.width * 0.5,
            flexGrow: 1,
          }}
        >
          <OldThemedText>{props.settingTitle}</OldThemedText>
          {props.description !== undefined &&
            props.showDescriptionInsideRow && (
              <OldThemedText
                style={{
                  fontSize: 12,
                  color: "#999",
                }}
              >
                {props.description}
              </OldThemedText>
            )}
        </View>
        <View
          style={{
            flexBasis: windowDimensions.width * 0.2,
          }}
        >
          <Switch
            value={props.switchValue}
            onValueChange={props.onValueChange}
            thumbColor="#f4f3f4"
            trackColor={{
              false: "#ccc",
              true: "#16a34a",
            }}
          />
        </View>
      </View>
      {props.description !== undefined && !props.showDescriptionInsideRow && (
        <OldThemedText
          style={{
            paddingHorizontal: 16,
            marginTop: -4,
            paddingBottom: 16,
            fontSize: 14,
            color: "#999",
          }}
        >
          {props.description}
        </OldThemedText>
      )}
    </>
  );
}

/**
 * Get only expo updates data for display without things like constants and etc.
 */
function getExpoUpdatesData() {
  const data = { ...ExpoUpdates };

  // @ts-expect-error
  delete data.localAssets;
  // @ts-expect-error
  delete data.manifest;
  // @ts-expect-error
  delete data.UpdateCheckResultNotAvailableReason;
  // @ts-expect-error
  delete data.UpdatesCheckAutomaticallyValue;
  // @ts-expect-error
  delete data.UpdatesLogEntryCode;
  // @ts-expect-error
  delete data.UpdatesLogEntryLevel;
  // @ts-expect-error
  delete data.UpdateInfoType;

  return data as typeof ExpoUpdates;
}
