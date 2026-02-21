import { msg } from "@lingui/core/macro";
import { useLingui, Trans } from "@lingui/react/macro";
import { nativeApplicationVersion, nativeBuildVersion } from "expo-application";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Pressable,
  useWindowDimensions,
  Platform,
  ActivityIndicator,
} from "react-native";

import { useSubmitContactFormMutation } from "@/api";
import {
  ThemedText,
  Icon,
  VerticalSpacer,
  ScrollViewContainer,
  ThemedView,
} from "@/components";
import { Colors } from "@/constants";
import { useAuthContext } from "@/context";
import { isValidEmail, toast } from "@/utils";

/**
 * @todo
 * - Support query params for other pages to prefill in details
 * - Support query params for other pages to send "invisible details" that is
 * details that we want to include to save in the DB, but we do not show user we
 * are sending it
 */
export default function ContactFormPage() {
  const windowDimensions = useWindowDimensions();
  const authContext = useAuthContext();
  const router = useRouter();
  const { t, i18n } = useLingui();
  const submitContactFormMutation = useSubmitContactFormMutation();

  const [answer, setAnswer] = useState("");
  const [guestUserEmail, setGuestUserEmail] = useState("");
  const isGuestUserEmailEmpty = guestUserEmail === "";
  const isGuestUserEmailInvalid =
    !isGuestUserEmailEmpty && !isValidEmail(guestUserEmail);
  const isGuestUserEmailValid =
    !authContext.isAuthenticated &&
    !isGuestUserEmailEmpty &&
    isValidEmail(guestUserEmail);
  const isAnswerValid = answer !== "";
  const isAllFormInputsValid =
    isAnswerValid && (authContext.isAuthenticated || isGuestUserEmailValid);

  const initialNumberOfLines = 6;
  const fontSize = 16;
  const lineHeight = fontSize * 1.5;

  async function submitForm() {
    // Additional guard, should be unused since button is disabled if not valid
    if (!isAllFormInputsValid) {
      return;
    }

    const platform = `${Platform.OS}-${Platform.Version}`;

    try {
      await submitContactFormMutation.mutateAsync({
        // No need to send authenticated user's details since we will store
        // their userID in the backend after verification
        guestUserEmail,
        platform,
        nativeApplicationVersion,
        nativeBuildVersion,
        userLocale: i18n.locale,
        answer,

        // @todo Send other full details too like ota version and all
      });
      toast(msg`Submitted, we will get back to you as needed!`);
      router.canGoBack() && router.back();
    } catch {
      toast(msg`Failed to submit!`);
    }
  }

  return (
    <ScrollViewContainer>
      <View
        style={{
          paddingTop: 8,
          flexDirection: "column",
          rowGap: 16,
        }}
      >
        <ThemedText
          type="lg-light"
          style={{
            paddingBottom: 8,
          }}
        >
          <Trans>Send us your queries / feedback!</Trans>
        </ThemedText>
        {!authContext.isAuthenticated && (
          <View
            style={{
              flexDirection: "column",
              rowGap: 4,
            }}
          >
            <ThemedText colorType="subtext">
              Please sign in or enter your email, so that we can reply you as
              needed!
            </ThemedText>
            <VerticalSpacer height={4} />
            <Pressable onPress={() => authContext.login()}>
              <ThemedView
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 8,
                  justifyContent: "space-between",
                  backgroundColor: Colors.black,
                  paddingVertical: 4,
                  paddingHorizontal: 16,
                  borderRadius: 16,
                }}
              >
                <Image
                  source={require("@/assets/images/icon-dark.png")}
                  style={{
                    width: 36,
                    aspectRatio: 1,
                    borderRadius: 8,
                  }}
                  contentFit="cover"
                />
                <ThemedText type="lg-light">
                  <Trans>Sign In</Trans>
                </ThemedText>
                <Icon name="chevron.right" color={Colors.neutral50} />
              </ThemedView>
            </Pressable>
            <ThemedText
              type="base-light"
              style={{
                textAlign: "center",
              }}
            >
              <Trans>OR</Trans>
            </ThemedText>
            <View>
              <TextInput
                editable={!submitContactFormMutation.isPending}
                // Ensures text starts at the top of the box on Android, as it
                // defaults to centered when multiline is enabled.
                textAlignVertical="top"
                placeholder={t`Your email`}
                placeholderTextColor={Colors.neutral50}
                defaultValue={guestUserEmail}
                onChangeText={setGuestUserEmail}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderRadius: 16,
                  fontSize,
                  backgroundColor: Colors.neutral800,
                  color: Colors.neutral50,
                  borderWidth: StyleSheet.hairlineWidth,
                  borderColor: isGuestUserEmailInvalid
                    ? Colors.red600
                    : Colors.transparent,
                }}
              />
              {isGuestUserEmailInvalid && (
                <ThemedText
                  type="sm-light"
                  style={{
                    textAlign: "right",
                  }}
                  customColors={{
                    dark: Colors.red300,
                  }}
                >
                  <Trans>please enter a valid email</Trans>
                </ThemedText>
              )}
            </View>
            <VerticalSpacer />
          </View>
        )}

        <View
          style={{
            flexDirection: "column",
            rowGap: 8,
          }}
        >
          <ThemedText type="lg-light">
            <Trans>How can we help you?</Trans>
          </ThemedText>
          <View>
            <TextInput
              autoFocus={authContext.isAuthenticated}
              editable={!submitContactFormMutation.isPending}
              multiline
              numberOfLines={initialNumberOfLines}
              // Ensures text starts at the top of the box on Android, as it
              // defaults to centered when multiline is enabled.
              textAlignVertical="top"
              defaultValue={answer}
              onChangeText={setAnswer}
              onSubmitEditing={() => submitForm()}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 16,
                fontSize,
                minHeight: lineHeight * initialNumberOfLines,
                maxHeight: windowDimensions.height * 0.3,
                backgroundColor: Colors.neutral800,
                color: Colors.neutral50,
              }}
            />
            {!isAnswerValid && (
              <ThemedText
                type="sm-light"
                style={{
                  textAlign: "right",
                }}
                customColors={{
                  dark: Colors.red300,
                }}
              >
                <Trans>cannot be blank</Trans>
              </ThemedText>
            )}
          </View>
        </View>
        <Pressable
          style={({ pressed }) => ({
            opacity: pressed || submitContactFormMutation.isPending ? 0.8 : 1,
            backgroundColor: isAllFormInputsValid
              ? Colors.green600
              : Colors.neutral500,
            marginTop: 24,
            paddingVertical: 8,
            borderRadius: 8,
            alignItems: "center",
          })}
          onPress={submitForm}
          disabled={
            !isAllFormInputsValid || submitContactFormMutation.isPending
          }
        >
          <View
            style={{
              flexDirection: "row",
              columnGap: 8,
            }}
          >
            <ThemedText type="lg-light">
              <Trans>Submit</Trans>
            </ThemedText>
            {submitContactFormMutation.isPending && (
              <ActivityIndicator size="small" color={Colors.white} />
            )}
          </View>
        </Pressable>
      </View>
      <VerticalSpacer
        // Adding about 60% of screen height at the bottom to prevent the
        // keyboard from blocking the form inputs
        height={windowDimensions.height * 0.6}
      />
    </ScrollViewContainer>
  );
}
