import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../lib/auth-provider";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Get screen dimensions
const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  // Get authentication functions from context
  const { signInWithMagicLink } = useAuth();

  // Animate component on mount
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Validate email format
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle login with Magic Link
  const handleMagicLinkLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your email address");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await signInWithMagicLink(email);

      if (success) {
        setShowSuccess(true);
      } else {
        Alert.alert("Error", "Failed to send magic link. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <LinearGradient
        colors={["#3584e4", "#1a73e8"]}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Stack.Screen options={{ headerShown: false }} />

        <View className="bg-white w-full p-6 rounded-xl items-center shadow-lg">
          <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
            <Ionicons name="checkmark" size={50} color="#10b981" />
          </View>

          <Text className="text-xl font-bold text-center mb-2">
            Check Your Email
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            We've sent a magic link to {email}. Check your inbox and click the
            link to sign in.
          </Text>

          <Text className="text-sm text-gray-500 text-center">
            Didn't receive an email? Check your spam folder or try again.
          </Text>

          <TouchableOpacity
            className="mt-6 w-full"
            onPress={() => setShowSuccess(false)}
          >
            <Text className="text-blue-600 text-center font-medium">
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={["#3584e4", "#1a73e8"]}
        style={{ flex: 1, justifyContent: "center", padding: 20 }}
      >
        <Stack.Screen options={{ headerShown: false }} />

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
          className="bg-white rounded-xl p-6 shadow-xl"
        >
          {/* Logo and Header */}
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="time-outline" size={50} color="#3584e4" />
            </View>
            <Text className="text-2xl font-bold text-gray-800">
              AR Time Capsule
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              Sign in to store memories in the real world
            </Text>
          </View>

          {/* Email Input */}
          <View className="mb-6">
            <Text className="text-gray-700 font-medium mb-2">
              Email Address
            </Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
              <Ionicons name="mail-outline" size={20} color="#6b7280" />
              <TextInput
                className="flex-1 ml-2 text-gray-800 h-12"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className={`bg-blue-600 rounded-lg py-3 items-center ${
              isSubmitting ? "opacity-70" : ""
            }`}
            onPress={handleMagicLinkLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Send Magic Link
              </Text>
            )}
          </TouchableOpacity>

          {/* Information Text */}
          <Text className="text-gray-500 text-center text-sm mt-6">
            We'll email you a magic link for a password-free sign in.
          </Text>
        </Animated.View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
