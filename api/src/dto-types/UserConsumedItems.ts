import type { ConsumableItemType } from "./ConsumableItemType.js";

export type UserConsumedItems = {
  items: Array<{
    itemType: ConsumableItemType;
    itemID: string;
  }>;
};
