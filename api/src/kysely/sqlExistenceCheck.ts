import { sql } from "kysely";

/**
 * Use this to select field for existence checks
 *
 * ```typescript
 * const isLiked: boolean = await apiDB
 *   .selectFrom("user_like")
 *   .select(sqlExistenceCheck)
 *   .where("user_id", "=", userID)
 *   .where("item_type", "=", itemType)
 *   .where("item_id", "=", itemID)
 *   .executeTakeFirst()
 *   .then((data) => data?.exists === true);
 * ```
 */
export const sqlExistenceCheck = sql<boolean>`true`.as("exists");
