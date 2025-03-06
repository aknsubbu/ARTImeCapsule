import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "../lib/auth-provider";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";

export default function AuthCallback() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    console.log("Auth callback mounted");
    console.log("Local search params:", params);

    // Get the full URL to check what's being received
    const getUrlAsync = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        console.log("Initial URL:", initialUrl);
      } catch (error) {
        console.error("Error getting initial URL:", error);
      }
    };

    getUrlAsync();

    // More robust authentication state handling
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        console.log("Authenticated, redirecting to app");
        router.replace("/(tabs)");
      } else if (!isLoading) {
        console.log("Not authenticated after loading, redirecting to login");
        router.replace("/");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, router]);

  return (
    <LinearGradient
      colors={["#3584e4", "#1a73e8"]}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View className="bg-white p-6 rounded-xl shadow-lg items-center">
        <ActivityIndicator size="large" color="#3584e4" className="mb-4" />
        <Text className="text-lg font-medium text-gray-800">
          Signing you in...
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Please wait while we complete the authentication process.
        </Text>
      </View>
    </LinearGradient>
  );
}
