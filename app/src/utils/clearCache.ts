import { Image } from "expo-image";

/**
 * Clear all local cache
 */
export async function clearCache() {
  // Clear all images from the disk cache asynchronously
  await Image.clearDiskCache();

  // Clear all images stored in memory asynchronously
  await Image.clearMemoryCache();
}
