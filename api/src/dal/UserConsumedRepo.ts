import type { ConsumableItemType } from "../dto-types/index.js";

import { apiDB, sqlExistenceCheck } from "../kysely/index.js";
import { generateID } from "../util/generateID.js";

export const userConsumedRepo = {
  async upsert(consumption: {
    userID: string;
    itemType: ConsumableItemType;
    itemID: string;
  }) {
    return await apiDB
      .insertInto("user_consumed")
      .values({
        id: generateID.uuidV7(),
        created_at: $DateTime.now.asIsoDateTime(),
        user_id: consumption.userID,
        item_type: consumption.itemType,
        item_id: consumption.itemID,
      })
      // Upsert behaviour
      .onConflict((oc) => {
        return (
          oc
            // If the composite unique constraint had a conflict means user
            // consumed this item before, we will just update timestamp only.
            .columns(["user_id", "item_type", "item_id"])
            .doUpdateSet({
              created_at: $DateTime.now.asIsoDateTime(),
            })
        );
      })
      .execute();
  },

  async getIsConsumed(filters: {
    userID: string;
    itemType: ConsumableItemType;
    itemID: string;
  }) {
    return await apiDB
      .selectFrom("user_consumed")
      .select(sqlExistenceCheck)
      .where("user_id", "=", filters.userID)
      .where("item_type", "=", filters.itemType)
      .where("item_id", "=", filters.itemID)
      .executeTakeFirst()
      .then((data) => data?.exists === true);
  },

  async getManyUserConsumedItems(filters: {
    userID: string;
    /**
     * Optionally filter for a specific item type, else returns all UserConsumed
     * item IDs regardless of itemType
     */
    itemType?: undefined | ConsumableItemType;
    cursorCreatedAt?: undefined | string;
    limit: number;
  }) {
    let query = apiDB
      .selectFrom("user_consumed")
      .select(["item_type as itemType", "item_id as itemID", "created_at"])
      .where("user_id", "=", filters.userID)
      .orderBy("created_at", "desc")
      .limit(filters.limit);

    if (filters.itemType !== undefined) {
      query = query.where("item_type", "=", filters.itemType);
    }

    if (filters.cursorCreatedAt !== undefined) {
      query = query.where(
        "created_at",
        "<",
        $DateTime.ISO.DateTime.makeStrongAndThrowOnError(
          filters.cursorCreatedAt,
        ),
      );
    }

    return await query.execute();
  },

  async delete(filters: {
    userID: string;
    itemType: ConsumableItemType;
    itemID: string;
  }) {
    return await apiDB
      .deleteFrom("user_consumed")
      .where("user_id", "=", filters.userID)
      .where("item_type", "=", filters.itemType)
      .where("item_id", "=", filters.itemID)
      .execute();
  },
};
