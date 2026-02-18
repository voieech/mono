import { Trans } from "@lingui/react/macro";
import { Image } from "expo-image";
import { useRef, useState, Fragment, PropsWithChildren } from "react";
import {
  View,
  Pressable,
  ScrollView,
  useWindowDimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ScrollViewContainer,
  ThemedText,
  Icon,
  OpenNativeSettingsAppButton,
} from "@/components";
import { Colors } from "@/constants";
import { useSettingContext } from "@/context";
import { useThemeColor } from "@/hooks";
import { linguiMsgToString } from "@/utils";

// const welcomePages = [WelcomePage1, WelcomePage2, WelcomePage3];
const welcomePages = [WelcomePage1, WelcomePage2];

export default function Welcome() {
  const backgroundColor = useThemeColor("background");
  const windowDimensions = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [currentPageXWidth, setCurrentPageXWidth] = useState(0);

  // Scroll to a page index (0 based index) directly
  // function scrollToPage(pageIndex: number) {
  //   scrollRef.current?.scrollTo({
  //     // Calculate position based on page width
  //     x: windowDimensions.width * pageIndex,
  //     y: 0,
  //     animated: true,
  //   });
  // }

  function scrollToNext() {
    scrollRef.current?.scrollTo({
      x: currentPageXWidth + windowDimensions.width,
      y: 0,
      animated: true,
    });
  }

  function scrollToPrevious() {
    scrollRef.current?.scrollTo({
      // Using max 0 to prevent scrolling past start page
      x: Math.max(0, currentPageXWidth - windowDimensions.width),
      y: 0,
      animated: true,
    });
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor,
      }}
    >
      <ScrollView
        horizontal={true}
        ref={scrollRef}
        style={{
          flex: 1,
        }}
        pagingEnabled={true}
        // Updates current page X position after scroll
        onMomentumScrollEnd={(event) =>
          setCurrentPageXWidth(event.nativeEvent.contentOffset.x)
        }
      >
        {welcomePages.map((WelcomePage, index) => (
          <WelcomePage
            key={index}
            scrollToNext={scrollToNext}
            scrollToPrevious={scrollToPrevious}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

type ScrollFunctionProps = {
  scrollToNext: () => void;
  scrollToPrevious: () => void;
};

function WelcomePageLayout(
  props: PropsWithChildren<
    ScrollFunctionProps & {
      showBackButton?: boolean;
      onScrollToNext?: () => unknown;
    }
  >,
) {
  const windowDimensions = useWindowDimensions();

  return (
    <View
      style={{
        width: windowDimensions.width,
      }}
    >
      {props.showBackButton && (
        <View
          style={{
            paddingHorizontal: 16,
            marginBottom: 16,
          }}
        >
          <Pressable
            onPress={props.scrollToPrevious}
            style={{
              alignSelf: "flex-start",
            }}
          >
            <View
              style={{
                width: "auto",
                flexDirection: "row",
                columnGap: 8,
                alignItems: "center",
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderRadius: 36,
                backgroundColor: Colors.black,
              }}
            >
              <Icon name="chevron.left" size={14} color={Colors.gray400} />
              <ThemedText type="base-light">
                <Trans>Back</Trans>
              </ThemedText>
            </View>
          </Pressable>
        </View>
      )}
      <ScrollViewContainer>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 12,
            paddingBottom: 12,
          }}
        >
          {props.children}
        </View>
      </ScrollViewContainer>
      <View
        style={{
          paddingHorizontal: 24,
          paddingBottom: 24,
        }}
      >
        <Pressable
          onPress={() => {
            props.scrollToNext();
            props.onScrollToNext?.();
          }}
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
            backgroundColor: Colors.sky500,
            borderRadius: 36,
            alignItems: "center",
          })}
        >
          <ThemedText
            type="lg-normal"
            style={{
              paddingVertical: 12,
            }}
          >
            <Trans>Continue</Trans>
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

function WelcomePage1(props: ScrollFunctionProps) {
  return (
    <WelcomePageLayout {...props}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          rowGap: 8,
        }}
      >
        <Image
          source={require("@/assets/images/logo.png")}
          style={{
            height: "100%",
            width: "100%",
            maxHeight: 108,
          }}
        />
        <ThemedText type="lg-semibold">
          <Trans>Your Hyper Personalized Podcasts</Trans>
        </ThemedText>
      </View>
    </WelcomePageLayout>
  );
}

/**
 * Settings content is largely copied from Settings/Language page.
 */
function WelcomePage2(props: ScrollFunctionProps) {
  const settingContext = useSettingContext();
  return (
    <WelcomePageLayout
      {...props}
      showBackButton={true}
      onScrollToNext={() =>
        settingContext.updateSetting(
          "lastOnboardingTime",
          new Date().toISOString(),
        )
      }
    >
      <View
        style={{
          flexDirection: "column",
          rowGap: 32,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            rowGap: 4,
          }}
        >
          <ThemedText type="lg-semibold">
            <Trans>Language</Trans>
          </ThemedText>
          <ThemedText type="sm-light">
            <Trans>These can be changed again later in settings.</Trans>
          </ThemedText>
        </View>
        <View>
          <ThemedText
            style={{
              paddingBottom: 8,
            }}
          >
            <Trans>App Language</Trans>
          </ThemedText>
          <OpenNativeSettingsAppButton
            buttonStyle={{
              paddingVertical: 12,
              paddingHorizontal: 16,
              backgroundColor: Colors.black,
              borderRadius: 10,
            }}
          />
          <ThemedText
            type="sm-normal"
            colorType="subtext"
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            {Platform.OS === "ios" ? (
              <Trans>
                App language can only be modified in the iOS
                &quot;Settings&quot; app.
              </Trans>
            ) : Platform.OS === "android" ? (
              <Trans>
                App language can only be modified in the Android
                &quot;Settings&quot; app.
              </Trans>
            ) : (
              <Trans>
                App language can only be modified in the Device
                &quot;Settings&quot; app.
              </Trans>
            )}
          </ThemedText>
        </View>
        <View>
          <ThemedText
            style={{
              paddingBottom: 8,
            }}
          >
            <Trans>Content Language</Trans>
          </ThemedText>
          <View
            style={{
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor: Colors.black,
              borderRadius: 16,
            }}
          >
            <ThemedText type="sm-normal" colorType="subtext">
              {linguiMsgToString(
                settingContext.settings.contentLanguage.description,
              )}
            </ThemedText>
            <View
              style={{
                backgroundColor: Colors.neutral500,
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
                        backgroundColor: Colors.neutral600,
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
                      <ThemedText
                        style={{
                          flexShrink: 1,
                        }}
                      >
                        {linguiMsgToString(option.name)}
                      </ThemedText>
                      <View>
                        {settingContext
                          .getSetting("contentLanguage")
                          .includes(option.value) && (
                          <Icon
                            name="checkmark"
                            color={Colors.green600}
                            size={16}
                          />
                        )}
                      </View>
                    </View>
                  </Pressable>
                </Fragment>
              ),
            )}
          </View>
        </View>
      </View>
    </WelcomePageLayout>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function WelcomePage3(props: ScrollFunctionProps) {
  const settingContext = useSettingContext();

  return (
    <WelcomePageLayout
      {...props}
      showBackButton={true}
      onScrollToNext={() =>
        settingContext.updateSetting(
          "lastOnboardingTime",
          new Date().toISOString(),
        )
      }
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          rowGap: 8,
        }}
      >
        <Image
          source={require("@/assets/images/logo.png")}
          style={{
            height: "100%",
            width: "100%",
            maxHeight: 108,
          }}
        />
        <ThemedText type="lg-semibold">
          <Trans>Your Hyper Personalized Podcasts</Trans>
        </ThemedText>
      </View>
    </WelcomePageLayout>
  );
}
