import type { LikeableItemType } from "../dto-types/index.js";

import { apiDB, sqlExistenceCheck } from "../kysely/index.js";

export const userLikeRepo = {
  async create(like: {
    userID: string;
    itemType: LikeableItemType;
    itemID: string;
  }) {
    return await apiDB
      .insertInto("user_like")
      .values({
        id: crypto.randomUUID(),
        created_at: $DateTime.now.asIsoDateTime(),
        user_id: like.userID,
        item_type: like.itemType,
        item_id: like.itemID,
      })
      .execute();
  },

  async getIsLiked(filters: {
    userID: string;
    itemType: LikeableItemType;
    itemID: string;
  }) {
    return await apiDB
      .selectFrom("user_like")
      .select(sqlExistenceCheck)
      .where("user_id", "=", filters.userID)
      .where("item_type", "=", filters.itemType)
      .where("item_id", "=", filters.itemID)
      .executeTakeFirst()
      .then((data) => data?.exists === true);
  },

  async delete(filters: {
    userID: string;
    itemType: LikeableItemType;
    itemID: string;
  }) {
    return await apiDB
      .deleteFrom("user_like")
      .where("user_id", "=", filters.userID)
      .where("item_type", "=", filters.itemType)
      .where("item_id", "=", filters.itemID)
      .execute();
  },
};
