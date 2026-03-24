import type { ConsumableItemType } from "./ConsumableItemType.js";

export type UserConsumedItems = {
  items: Array<{
    id: string;
    itemType: ConsumableItemType;
    itemID: string;
  }>;
};
