import type { Href } from "expo-router";

import { useLingui, Trans } from "@lingui/react/macro";
import { Image } from "expo-image";
import { useRouter, Link } from "expo-router";
import { View, Pressable } from "react-native";

import {
  FullScreenSigninWall,
  SafeAreaViewContainer,
  FrontPageLayoutTopBarWithProfilePic,
  ScrollViewContainer,
  ThemedView,
  ThemedText,
  Icon,
  VerticalSpacer,
  ExperimentalSurface,
} from "@/components";
import { Colors } from "@/constants";

export default function MePage() {
  const { t } = useLingui();

  return (
    <>
      <FullScreenSigninWall>
        <VerticalSpacer height={24} />
        <ThemedView
          style={{
            padding: 24,
            borderRadius: 24,
            flexDirection: "column",
            rowGap: 8,
          }}
        >
          <ThemedText type="lg-light">
            <Trans>These are still available without signing in</Trans>
          </ThemedText>
          <Link
            href={{
              pathname: "/profile/profile-page",
            }}
          >
            <ThemedView
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                columnGap: 8,
                justifyContent: "space-between",
                backgroundColor: Colors.black,
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 16,
              }}
            >
              <ThemedText>
                <Trans>Profile, Settings, About</Trans>
              </ThemedText>
              <Icon name="chevron.right" color={Colors.neutral50} />
            </ThemedView>
          </Link>
        </ThemedView>
      </FullScreenSigninWall>
      <SafeAreaViewContainer>
        <FrontPageLayoutTopBarWithProfilePic>
          <ThemedText type="lg-light">
            <Trans>Your Library</Trans>
          </ThemedText>
        </FrontPageLayoutTopBarWithProfilePic>
        <ScrollViewContainer>
          <AlbumRow
            href={{
              pathname: "/profile/subscriptions",
            }}
            imgSource={require("@/assets/images/subscriptions.png")}
            title={t`Subscriptions`}
          />
          <VerticalSpacer />
          <AlbumRow
            href={{
              pathname: "/profile/history",
            }}
            imgSource={require("@/assets/images/history.jpg")}
            title={t`History`}
          />
          <VerticalSpacer />
          <AlbumRow
            href={{
              pathname: "/profile/likes",
            }}
            imgSource={require("@/assets/images/likes.png")}
            title={t`Likes`}
          />
          <VerticalSpacer />
          <ExperimentalSurface>
            <AlbumRow
              href={{
                pathname: "/",
              }}
              imgSource={require("@/assets/images/subscriptions.png")}
              title={t`Subscriptions Content`}
            />
          </ExperimentalSurface>
        </ScrollViewContainer>
      </SafeAreaViewContainer>
    </>
  );
}

function AlbumRow(props: {
  href: Href;
  imgSource: string;
  title: string;
  subtitle?: string;
  value?: string;
}) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(props.href)}
      style={({ pressed }) => ({
        opacity: pressed ? 0.6 : 1,
        borderRadius: 16,
        backgroundColor: Colors.neutral800,
      })}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          padding: 8,
        }}
      >
        <Image
          source={props.imgSource}
          style={{
            width: "100%",
            height: "100%",
            aspectRatio: 1,
            maxWidth: 64,
            borderRadius: 16,
          }}
          contentFit="cover"
        />
        <View
          style={{
            flex: 1,
            paddingVertical: 4,
            paddingHorizontal: 16,
            flexDirection: "column",
            justifyContent: "center",
            rowGap: 2,
          }}
        >
          <ThemedText numberOfLines={1}>{props.title}</ThemedText>
          {props.subtitle !== undefined && (
            <ThemedText type="sm-light" numberOfLines={1}>
              {props.subtitle}
            </ThemedText>
          )}
        </View>
      </View>
    </Pressable>
  );
}
