import { Expo } from "expo-server-sdk";
import express from "express";

import type {
  PushNotificationTokens,
  SubscribableItemType,
  LikeableItemType,
  ConsumableItemType,
  UserLikeStatus,
  UserConsumedStatus,
  UserSubscriptionStatus,
  UserSubscriptionsOfItemType,
  UserConsumedItems,
} from "../../dto-types/index.js";

import {
  userPushNotificationTokenRepo,
  userSubscriptionRepo,
  userLikeRepo,
  userConsumedRepo,
} from "../../dal/index.js";
import { InvalidInputException } from "../../exceptions/index.js";
import { NotFoundException } from "../../exceptions/index.js";
import { authenticationMiddlewareBuilder } from "../../middleware/index.js";
import { expo } from "../../notifications-push/index.js";

export const userRoutes = express
  .Router()

  .post("/v1/user/settings/content-preference", (req, res) => {
    const userContentPreferenceTags = req.body.userContentPreferenceTags;

    userContentPreferenceTags;

    // @todo Maybe it should be rows instead of a single array so we can query/filter it?
    // apiDB
    //   .updateTable("user_content_preference")
    //   .set(userContentPreferenceTags)
    //   .where("user_id", "==", authn.userID);

    res.status(200).json({});
  })

  .post(
    "/v1/user/notification/push-notifications/save-tokens",
    authenticationMiddlewareBuilder(),
    async (req, res) => {
      const pushNotificationTokens = req.body as PushNotificationTokens;
      if (!Expo.isExpoPushToken(pushNotificationTokens.expoToken)) {
        throw new InvalidInputException(`Invalid Expo push notification token`);
      }

      const userID = await req.genAuthenticatedUserID();

      await userPushNotificationTokenRepo.upsert({
        user_id: userID,
        expo_token: pushNotificationTokens.expoToken,
        device_token: pushNotificationTokens.deviceToken,
        device_platform: pushNotificationTokens.devicePlatform,
      });

      res.status(200).json({});
    },
  )

  .post(
    "/v1/user/notification/push-notifications/delete-tokens",
    async (req, res) => {
      const pushNotificationTokens = req.body as PushNotificationTokens;
      if (!Expo.isExpoPushToken(pushNotificationTokens.expoToken)) {
        throw new InvalidInputException(`Invalid Expo push notification token`);
      }

      await userPushNotificationTokenRepo.deleteByExpoPushToken(
        pushNotificationTokens.expoToken,
      );

      res.status(200).json({});
    },
  )

  .post(
    "/v1/user/notification/push-notifications/test-notification",
    authenticationMiddlewareBuilder(),
    async (req, res) => {
      const pushNotificationTokens = req.body as PushNotificationTokens;
      if (!Expo.isExpoPushToken(pushNotificationTokens.expoToken)) {
        throw new InvalidInputException(`Invalid Expo push notification token`);
      }

      const userID = await req.genAuthenticatedUserID();

      const userDeviceExpoPushNotificationTokenIsStored =
        await userPushNotificationTokenRepo.getUserDeviceExpoPushNotificationTokenExists(
          {
            userID,
            expoPushToken: pushNotificationTokens.expoToken,
          },
        );

      if (!userDeviceExpoPushNotificationTokenIsStored) {
        throw new NotFoundException("Token not found in DB");
      }

      // @todo Handle the result
      await expo.sendPushNotificationsAsync([
        {
          to: pushNotificationTokens.expoToken,
          title: "Title test",
          subtitle: "Subtitle test",
          body: "Body test",
        },
      ]);

      res.status(200).json({});
    },
  )

  .get(
    "/v1/user/subscription/:itemType/:itemID",
    authenticationMiddlewareBuilder(),
    async function (req, res) {
      const userID = await req.genAuthenticatedUserID();
      const itemType = req.params["itemType"]! as SubscribableItemType;
      const itemID = req.params["itemID"]!;

      const isSubscribed = await userSubscriptionRepo.getIsSubscribed({
        userID,
        itemType,
        itemID,
      });

      res.status(200).json({
        subscribe: isSubscribed,
      } satisfies UserSubscriptionStatus);
    },
  )

  .post(
    "/v1/user/subscription/:itemType/:itemID",
    authenticationMiddlewareBuilder(),
    async function (req, res) {
      const userID = await req.genAuthenticatedUserID();
      const itemType = req.params["itemType"]! as SubscribableItemType;
      const itemID = req.params["itemID"]!;
      const shouldSubscribe = req.body["subscribe"]!;

      if (shouldSubscribe) {
        await userSubscriptionRepo.create({
          userID,
          itemType,
          itemID,
        });
      } else {
        await userSubscriptionRepo.delete({
          userID,
          itemType,
          itemID,
        });
      }

      // As long as DB calls did not throw, assume it succeeded
      res.status(200).json({
        subscribe: shouldSubscribe,
      } satisfies UserSubscriptionStatus);
    },
  )

  .get(
    "/v1/user/subscription/:itemType",
    authenticationMiddlewareBuilder(),
    async function (req, res) {
      const userID = await req.genAuthenticatedUserID();
      const itemType = req.params["itemType"]! as SubscribableItemType;

      const itemIDs = await userSubscriptionRepo.getManySubscriptionItemID({
        userID,
        itemType,
      });

      res.status(200).json({
        itemIDs,
      } satisfies UserSubscriptionsOfItemType);
    },
  )

  .get(
    "/v1/user/like/:itemType/:itemID",
    authenticationMiddlewareBuilder(),
    async function (req, res) {
      const userID = await req.genAuthenticatedUserID();
      const itemType = req.params["itemType"]! as LikeableItemType;
      const itemID = req.params["itemID"]!;

      const isLiked = await userLikeRepo.getIsLiked({
        userID,
        itemType,
        itemID,
      });

      res.status(200).json({
        like: isLiked,
      } satisfies UserLikeStatus);
    },
  )

  .post(
    "/v1/user/like/:itemType/:itemID",
    authenticationMiddlewareBuilder(),
    async function (req, res) {
      const userID = await req.genAuthenticatedUserID();
      const itemType = req.params["itemType"]! as LikeableItemType;
      const itemID = req.params["itemID"]!;
      const shouldLike = req.body["like"]!;

      if (shouldLike) {
        await userLikeRepo.upsert({
          userID,
          itemType,
          itemID,
        });
      } else {
        await userLikeRepo.delete({
          userID,
          itemType,
          itemID,
        });
      }

      // As long as DB calls did not throw, assume it succeeded
      res.status(200).json({
        like: shouldLike,
      } satisfies UserLikeStatus);
    },
  )

  .get(
    "/v1/user/consumed/:itemType/:itemID",
    authenticationMiddlewareBuilder(),
    async function (req, res) {
      const userID = await req.genAuthenticatedUserID();
      const itemType = req.params["itemType"]! as ConsumableItemType;
      const itemID = req.params["itemID"]!;

      const isConsumed = await userConsumedRepo.getIsConsumed({
        userID,
        itemType,
        itemID,
      });

      res.status(200).json({
        consumed: isConsumed,
      } satisfies UserConsumedStatus);
    },
  )

  .get(
    "/v1/user/consumed",
    authenticationMiddlewareBuilder(),
    async function (req, res) {
      const userID = await req.genAuthenticatedUserID();

      // Optional filter(s)
      const itemType = req.query["itemType"] as undefined | ConsumableItemType;
      const cursorItemID = req.query["cursorItemID"] as undefined | string;
      const rawLimit = Number(req.query["limit"]);
      const limit = isNaN(rawLimit) || rawLimit < 1 ? 50 : rawLimit;

      const userConsumedItems = await userConsumedRepo.getManyUserConsumedItems(
        {
          userID,
          itemType,
          limit,
          cursorItemID,
        },
      );

      res.status(200).json({
        items: userConsumedItems,
      } satisfies UserConsumedItems);
    },
  )

  .post(
    "/v1/user/consumed/:itemType/:itemID",
    authenticationMiddlewareBuilder(),
    async function (req, res) {
      const userID = await req.genAuthenticatedUserID();
      const itemType = req.params["itemType"]! as ConsumableItemType;
      const itemID = req.params["itemID"]!;
      const shouldConsume = req.body["consumed"]!;

      if (shouldConsume) {
        await userConsumedRepo.upsert({
          userID,
          itemType,
          itemID,
        });
      } else {
        await userConsumedRepo.delete({
          userID,
          itemType,
          itemID,
        });
      }

      // As long as DB calls did not throw, assume it succeeded
      res.status(200).json({
        consumed: shouldConsume,
      } satisfies UserConsumedStatus);
    },
  );
