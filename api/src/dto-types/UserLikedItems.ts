import type { LikeableItemType } from "./LikeableItemType.js";

export type UserLikedItems = {
  items: Array<{
    id: string;
    itemType: LikeableItemType;
    itemID: string;
  }>;
};
