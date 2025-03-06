import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { CameraView } from "expo-camera";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";

// Define proper types
type Note = {
  id: string;
  content: string;
  latitude: number;
  longitude: number;
  created_at: string;
};

export default function CameraPage() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [useFrontCamera, setUseFrontCamera] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);

  const cameraRef = useRef<CameraView>(null);

  // Fetch nearby notes
  useEffect(() => {
    // This would typically fetch from your database
    // For now, we'll use sample data
    setNotes([
      {
        id: "1",
        content: "Memory from last summer",
        latitude: 37.7749,
        longitude: -122.4194,
        created_at: new Date().toISOString(),
      },
    ]);
  }, []);

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();

      setHasPermission(
        cameraStatus === "granted" && locationStatus === "granted"
      );

      if (locationStatus === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 10000,
            distanceInterval: 5,
          },
          (newLocation) => setLocation(newLocation)
        );
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current && location) {
      try {
        const photo = await cameraRef.current.takePictureAsync();

        if (!photo) {
          console.error("Failed to capture photo");
          return;
        }

        // Navigate to review page with captured data
        router.push({
          pathname: "/(tabs)/review",
          params: {
            imageUri: photo.uri,
            lat: location.coords.latitude.toString(),
            lng: location.coords.longitude.toString(),
          },
        });
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };

  const toggleCamera = () => {
    setUseFrontCamera(!useFrontCamera);
  };

  if (hasPermission === null) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white">Requesting permissions...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white mb-4">
          Camera or location permission denied
        </Text>
        <TouchableOpacity
          className="px-4 py-2 bg-white rounded-full"
          onPress={() => router.back()}
        >
          <Text>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <Stack.Screen options={{ headerShown: false }} />

      <CameraView
        ref={cameraRef}
        className="flex-1"
        facing={useFrontCamera ? "front" : "back"}
        flash={flashEnabled ? "on" : "off"}
      >
        <SafeAreaView className="flex-1">
          {/* Top Controls */}
          <View className="flex-row justify-between p-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>

            <View className="flex-row space-x-4">
              <TouchableOpacity
                onPress={toggleFlash}
                className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
              >
                <Ionicons
                  name={flashEnabled ? "flash" : "flash-off"}
                  size={20}
                  color="white"
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={toggleCamera}
                className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
              >
                <Ionicons
                  name="camera-reverse-outline"
                  size={20}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Notes indicator */}
          {notes.length > 0 && (
            <View className="absolute top-16 left-4 bg-black/50 px-2 py-1 rounded-lg">
              <Text className="text-white text-xs">
                {notes.length} {notes.length === 1 ? "note" : "notes"} nearby
              </Text>
            </View>
          )}

          {/* Center Capture Button */}
          <View className="flex-1 justify-end items-center pb-12">
            <TouchableOpacity onPress={takePicture}>
              <View className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center">
                <View className="w-16 h-16 rounded-full bg-white/20"></View>
              </View>
            </TouchableOpacity>

            {/* Tap to capture indicator */}
            <View className="mt-6 px-6 py-2 bg-black/50 rounded-full">
              <Text className="text-white">Tap to capture</Text>
            </View>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}
