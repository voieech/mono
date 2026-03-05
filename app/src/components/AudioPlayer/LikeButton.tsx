import type { LikeableItemType } from "dto";

import { msg } from "@lingui/core/macro";
import * as Haptics from "expo-haptics";
import { ActivityIndicator, Pressable } from "react-native";

import { useUserLikeQuery, useUserLikeMutation } from "@/api";
import { Icon } from "@/components/provided";
import { Colors } from "@/constants";
import { useAuthContext } from "@/context";
import { toast } from "@/utils";

export function LikeButtonMaybeUnauthenticated(props: {
  audioTrackType: LikeableItemType;
  audioTrackID: string;
}) {
  const authContext = useAuthContext();

  if (!authContext.isAuthenticated) {
    return (
      <HeartBaseButton
        isLiked={false}
        onPress={authContext.showFullScreenSigninModalIfNotAuthenticated}
      />
    );
  }

  return <LikeUnlikeButton {...props} />;
}

/**
 * User is authenticated already
 */
function LikeUnlikeButton(props: {
  audioTrackType: LikeableItemType;
  audioTrackID: string;
}) {
  const userLikeQuery = useUserLikeQuery({
    itemType: props.audioTrackType,
    itemID: props.audioTrackID,
  });

  if (userLikeQuery.isLoading) {
    return <ActivityIndicator />;
  }

  // If failed to load status, treat it as the same as not liked
  if (
    userLikeQuery.isError ||
    userLikeQuery.data === undefined ||
    userLikeQuery.data.like === undefined ||
    userLikeQuery.data.like === false
  ) {
    return <ClickToLikeButton {...props} />;
  }

  return <ClickToUnlikeButton {...props} />;
}

const showFailedToUpdateLikeToast = () => toast(msg`Failed to update like`);

function ClickToLikeButton(props: {
  audioTrackType: LikeableItemType;
  audioTrackID: string;
}) {
  const userLikeMutation = useUserLikeMutation();
  return (
    <HeartBaseButton
      isLiked={false}
      onPress={() => {
        userLikeMutation.mutate(
          {
            itemType: props.audioTrackType,
            itemID: props.audioTrackID,
            like: true,
          },
          {
            onError: showFailedToUpdateLikeToast,
          },
        );
      }}
      disabled={userLikeMutation.isPending}
    />
  );
}

function ClickToUnlikeButton(props: {
  audioTrackType: LikeableItemType;
  audioTrackID: string;
}) {
  const userLikeMutation = useUserLikeMutation();
  return (
    <HeartBaseButton
      isLiked={true}
      onPress={() => {
        userLikeMutation.mutate(
          {
            itemType: props.audioTrackType,
            itemID: props.audioTrackID,
            like: false,
          },
          {
            onError: showFailedToUpdateLikeToast,
          },
        );
      }}
      disabled={userLikeMutation.isPending}
    />
  );
}

export function HeartBaseButton(props: {
  isLiked: boolean;
  onPress?: () => unknown;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        props.onPress?.();
      }}
      disabled={props.disabled}
    >
      <Icon
        name={props.isLiked ? "heart.fill" : "heart"}
        color={props.isLiked ? Colors.red600 : Colors.neutral200}
        size={32}
      />
    </Pressable>
  );
}
