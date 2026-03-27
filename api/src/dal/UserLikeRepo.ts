import type { LikeableItemType } from "../dto-types/index.js";

import { apiDB, sqlExistenceCheck } from "../kysely/index.js";
import { generateID } from "../util/generateID.js";

export const userLikeRepo = {
  async upsert(like: {
    userID: string;
    itemType: LikeableItemType;
    itemID: string;
  }) {
    return await apiDB
      .insertInto("user_like")
      .values({
        id: generateID.uuidV7(),
        created_at: $DateTime.now.asIsoDateTime(),
        user_id: like.userID,
        item_type: like.itemType,
        item_id: like.itemID,
      })
      // Upsert behaviour
      .onConflict((oc) => {
        return (
          oc
            // If the composite unique constraint had a conflict means user
            // liked this item before, we will just update timestamp only.
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

  async getManyUserLikedItems(filters: {
    userID: string;
    limit: number;
    /**
     * Cursor is the ID to skip past
     */
    cursorID?: undefined | string;
    /**
     * Optionally filter for a specific item type, else returns all UserLiked
     * item IDs regardless of itemType
     */
    itemType?: undefined | LikeableItemType;
  }) {
    let query = apiDB
      .selectFrom("user_like")
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
