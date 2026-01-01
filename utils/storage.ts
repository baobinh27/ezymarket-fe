import AsyncStorage from "@react-native-async-storage/async-storage";

export const localStorage = {
  get: async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },

  set: async (key: string, value: any) => {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  remove: async (key: string) => {
    await AsyncStorage.removeItem(key);
  },
};
