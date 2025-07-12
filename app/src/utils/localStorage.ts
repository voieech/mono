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

  async readData(key: string) {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      const value = jsonValue != null ? JSON.parse(jsonValue) : null;
      return [null, value] as const;
    } catch (e) {
      console.error(e);
      return [e as Error, null] as const;
    }
  },
};
