import type { SubscribableItemType } from "../dto-types/index.js";

import { apiDB, sqlExistenceCheck } from "../kysely/index.js";
import { generateID } from "../util/generateID.js";

export const userSubscriptionRepo = {
  async upsert(subscription: {
    userID: string;
    itemType: SubscribableItemType;
    itemID: string;
  }) {
    return await apiDB
      .insertInto("user_subscription")
      .values({
        id: generateID.uuidV7(),
        created_at: $DateTime.now.asIsoDateTime(),
        user_id: subscription.userID,
        item_type: subscription.itemType,
        item_id: subscription.itemID,
      })
      // Upsert behaviour
      .onConflict((oc) => {
        return (
          oc
            // If the composite unique constraint had a conflict means user
            // subscribed to this item before.
            .columns(["user_id", "item_type", "item_id"])
            .doUpdateSet({
              // Need to update the ID since we are using this time sortable ID
              // as pagination cursor
              id: generateID.uuidV7(),
              created_at: $DateTime.now.asIsoDateTime(),
            })
        );
      })
      .execute();
  },

  async getIsSubscribed(filters: {
    userID: string;
    itemType: SubscribableItemType;
    itemID: string;
  }) {
    return await apiDB
      .selectFrom("user_subscription")
      .select(sqlExistenceCheck)
      .where("user_id", "=", filters.userID)
      .where("item_type", "=", filters.itemType)
      .where("item_id", "=", filters.itemID)
      .executeTakeFirst()
      .then((data) => data?.exists === true);
  },

  async getManySubscriptionItemID(filters: {
    userID: string;
    itemType: SubscribableItemType;
  }) {
    return await apiDB
      .selectFrom("user_subscription")
      .select("item_id")
      .where("user_id", "=", filters.userID)
      .where("item_type", "=", filters.itemType)
      .orderBy("created_at", "desc")
      .execute()
      .then((rows) => rows.map((row) => row.item_id));
  },

  async getManySubscriptionUserIdByItem(filters: {
    itemType: SubscribableItemType;
    itemID: string;
  }) {
    return await apiDB
      .selectFrom("user_subscription")
      .select("user_id")
      .where("item_type", "=", filters.itemType)
      .where("item_id", "=", filters.itemID)
      .execute()
      .then((rows) => rows.map((row) => row.user_id));
  },

  async getManyUserSubscribedItems(filters: {
    userID: string;
    limit: number;
    /**
     * Cursor is the ID to skip past
     */
    cursorID?: undefined | string;
    /**
     * Optionally filter for a specific item type, else returns all
     * UserSubscribed item IDs regardless of itemType
     */
    itemType?: undefined | SubscribableItemType;
  }) {
    let query = apiDB
      .selectFrom("user_subscription")
      .select(["id", "item_type as itemType", "item_id as itemID"])
      .where("user_id", "=", filters.userID)
      .orderBy("id", "desc")
      .limit(filters.limit);

    if (filters.itemType !== undefined) {
      query = query.where("item_type", "=", filters.itemType);
    }

    if (filters.cursorID !== undefined) {
      query = query.where("id", "<", filters.cursorID);
    }

    return await query.execute();
  },

  async delete(filters: {
    userID: string;
    itemType: SubscribableItemType;
    itemID: string;
  }) {
    return await apiDB
      .deleteFrom("user_subscription")
      .where("user_id", "=", filters.userID)
      .where("item_type", "=", filters.itemType)
      .where("item_id", "=", filters.itemID)
      .execute();
  },
};
