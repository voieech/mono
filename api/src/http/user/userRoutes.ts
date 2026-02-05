import express from "express";

import type { SubscribableItemType } from "../../dto-types/index.js";

import { apiDB } from "../../kysely/index.js";
import { authMiddleware } from "../auth/index.js";

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

  .get(
    "/v1/user/subscription/:itemType/:itemID",
    authMiddleware,
    async function (req, res) {
      const userID = req.authenticatedUser?.id!;
      const itemType = req.params["itemType"]! as SubscribableItemType;
      const itemID = req.params["itemID"]!;

      const isSubscribed = await apiDB
        .selectFrom("user_subscription")
        .select("item_id")
        .where("user_id", "=", userID)
        .where("item_type", "=", itemType)
        .where("item_id", "=", itemID)
        .executeTakeFirst();

      if (isSubscribed === undefined) {
        res.status(200).json({
          subscribe: false,
        });
        return;
      }

      res.status(200).json({
        subscribe: true,
      });
    },
  )

  .post(
    "/v1/user/subscription/:itemType/:itemID",
    authMiddleware,
    async function (req, res) {
      const userID = req.authenticatedUser?.id!;
      const itemType = req.params["itemType"]! as SubscribableItemType;
      const itemID = req.params["itemID"]!;
      const shouldSubscribe = req.body["subscribe"]!;

      if (shouldSubscribe) {
        await apiDB
          .insertInto("user_subscription")
          .values({
            id: crypto.randomUUID(),
            created_at: $DateTime.now.asIsoDateTime(),
            user_id: userID,
            item_type: itemType,
            item_id: itemID,
          })
          .execute();
      } else {
        await apiDB
          .deleteFrom("user_subscription")
          .where("user_id", "=", userID)
          .where("item_type", "=", itemType)
          .where("item_id", "=", itemID)
          .execute();
      }

      // As long as DB calls did not throw, assume it succeeded
      res.status(200).json({
        subscribe: shouldSubscribe,
      });
    },
  );
