import type { LikeableItemType } from "dto";

import { msg } from "@lingui/core/macro";
import * as Haptics from "expo-haptics";
import { ActivityIndicator, Pressable } from "react-native";

import { useUserLikeQuery, useUserLikeMutation } from "@/api";
import { Icon } from "@/components/provided";
import { Colors } from "@/constants";
import { useAuthContext } from "@/context";
import { toast } from "@/utils";

/**
 * A heart button that allows you to "like" or "unlike" any generic likeable
 * item! This will show the empty heart button when the user is unauthenticated,
 * and on click will trigger the auth modal to ask them to authenticate before
 * liking/unliking an item!
 */
export function LikeUnlikeButton(props: {
  likeableItemType: LikeableItemType;
  likeableItemID: string;
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

  return <AuthenticatedLikeUnlikeButton {...props} />;
}

/**
 * User is authenticated already, load and show the actual like status and allow
 * user to trigger mutations to modify like status.
 */
function AuthenticatedLikeUnlikeButton(props: {
  likeableItemType: LikeableItemType;
  likeableItemID: string;
}) {
  const userLikeQuery = useUserLikeQuery({
    itemType: props.likeableItemType,
    itemID: props.likeableItemID,
  });
  const userLikeMutation = useUserLikeMutation();

  if (userLikeQuery.isLoading) {
    return <ActivityIndicator />;
  }

  // isLiked is only true if there is no error making the query, and the return
  // value is true. If failed to load like status, treat it as the same as
  // currently not liked, to allow user to try liking it again.
  const isLiked = userLikeQuery.data?.like === true;

  return (
    <HeartBaseButton
      isLiked={isLiked}
      onPress={() => {
        userLikeMutation.mutate(
          {
            itemType: props.likeableItemType,
            itemID: props.likeableItemID,
            like: !isLiked,
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

function HeartBaseButton(props: {
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

const showFailedToUpdateLikeToast = () => toast(msg`Failed to update like`);
