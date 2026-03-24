import { v7 as uuidV7 } from "uuid";

/**
 * Methods for generating IDs
 */
export const generateID = {
  /**
   * UUID v4 for fully random and unique IDs
   */
  uuidV4: () => crypto.randomUUID(),

  /**
   * UUID v7 for time based K sortable unique IDs
   */
  uuidV7: () => uuidV7(),
};
