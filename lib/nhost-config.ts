import { NhostClient } from "@nhost/nhost-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";

// Create the redirect URL for magic link authentication
export const redirectURL = Linking.createURL("/auth-callback");

// Create a storage adapter for AsyncStorage
const asyncStorageAdapter = {
  getItem: async (key: string) => {
    return await AsyncStorage.getItem(key);
  },
  setItem: async (key: string, value: string) => {
    await AsyncStorage.setItem(key, value);
  },
  removeItem: async (key: string) => {
    await AsyncStorage.removeItem(key);
  },
};

// Create Nhost client
export const nhost = new NhostClient({
  subdomain: process.env.EXPO_PUBLIC_NHOST_SUBDOMAIN,
  region: process.env.EXPO_PUBLIC_NHOST_REGION,
  clientStorage: asyncStorageAdapter,
  clientStorageType: "custom",
  autoSignIn: true,
});

// Export the backend URL - now using the correct property access
export const NHOST_BACKEND_URL = `https://${nhost.auth.client.backendUrl}`;
