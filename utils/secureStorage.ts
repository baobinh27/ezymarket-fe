import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const SecureStorage = {
  getItem: async (key: string) => {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },

  setItem: async (key: string, value: string) => {
    if (Platform.OS === "web") {
      return localStorage.setItem(key, value);
    }
    return SecureStore.setItemAsync(key, value);
  },

  deleteItem: async (key: string) => {
    if (Platform.OS === "web") {
      return localStorage.removeItem(key);
    }
    return SecureStore.deleteItemAsync(key);
  },
};
