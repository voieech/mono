import AsyncStorage from "@react-native-async-storage/async-storage";

export const localStorage = {
  notFoundErrorName: "NotFound",

  /**
   * Writes any JSON stringifiable data to localStorage
   */
  async write(key: string, value: any) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  /**
   * Read data casted to type `T` after parsing string value from localStorage
   * with `JSON.parse`.
   */
  async read<T = any>(key: string) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) {
        const err = new Error(`[localStorage] No data for key: ${key}`);
        err.name = this.notFoundErrorName;
        throw err;
      }

      const jsonValue = JSON.parse(value);
      return [null, jsonValue as T] as const;
    } catch (e) {
      console.error(e);
      return [e as Error, null] as const;
    }
  },
} as const;
