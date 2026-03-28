import type { SubscribableItemType } from "./SubscribableItemType.js";

export type UserSubscribedItems = {
  items: Array<{
    id: string;
    itemType: SubscribableItemType;
    itemID: string;
  }>;
};
