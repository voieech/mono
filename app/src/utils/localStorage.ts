import AsyncStorage from "@react-native-async-storage/async-storage";

export const localStorage = {
  async writeData(key: string, value: any) {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  async readData<T = any>(key: string) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) {
        throw new Error(`[localStorage] No data for key: ${key}`);
      }

      const jsonValue = JSON.parse(value);
      return [null, jsonValue as T] as const;
    } catch (e) {
      console.error(e);
      return [e as Error, null] as const;
    }
  },
};
