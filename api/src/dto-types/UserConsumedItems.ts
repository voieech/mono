import type { ConsumableItemType } from "./ConsumableItemType.js";

export type UserConsumedItems = {
  items: Array<{
    itemType: ConsumableItemType;
    itemID: string;
    created_at: string;
  }>;
};
