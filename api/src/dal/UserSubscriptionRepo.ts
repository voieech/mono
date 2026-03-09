import type { SubscribableItemType } from "../dto-types/index.js";

import { apiDB, sqlExistenceCheck } from "../kysely/index.js";

export const userSubscriptionRepo = {
  async create(subscription: {
    userID: string;
    itemType: SubscribableItemType;
    itemID: string;
  }) {
    return await apiDB
      .insertInto("user_subscription")
      .values({
        id: crypto.randomUUID(),
        created_at: $DateTime.now.asIsoDateTime(),
        user_id: subscription.userID,
        item_type: subscription.itemType,
        item_id: subscription.itemID,
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
