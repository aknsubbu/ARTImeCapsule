import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { CameraView } from "expo-camera";
import { Camera } from "expo-camera";
import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  ViroARScene,
  ViroText,
  ViroARSceneNavigator,
  ViroFlexView,
} from "@viro-community/react-viro";

// Define proper types
type Note = {
  id: string;
  content: string;
  latitude: number;
  longitude: number;
  created_at: string;
};

type ARCameraProps = {
  notes?: Note[];
  onCapture?: (imageUri: string, location: Location.LocationObject) => void;
  onClose?: () => void;
};

// Define the AR Scene component - it must be a function with no arguments
const ARNotesScene = () => {
  return (
    <ViroARScene onTrackingUpdated={() => {}}>
      {/* We'll use viroAppProps to access the notes */}
      {[].map((note: Note, index: number) => (
        <ViroFlexView
          key={`note-${index}`}
          position={[0, 0.2 * index, -1]}
          width={2}
          height={0.5}
          style={{ backgroundColor: "rgba(0,0,0,0.7)", padding: 0.1 }}
        >
          <ViroText
            text={note.content}
            width={1.8}
            height={0.4}
            style={{
              color: "#ffffff",
              fontSize: 20,
              textAlign: "center",
            }}
          />
        </ViroFlexView>
      ))}
    </ViroARScene>
  );
};

export default function ARCamera({
  notes = [],
  onCapture,
  onClose,
}: ARCameraProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [showAR, setShowAR] = useState(true);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [useFrontCamera, setUseFrontCamera] = useState(false);

  const cameraRef = useRef<CameraView>(null);
  const isFocused = useIsFocused();

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

        if (onCapture && photo) {
          onCapture(photo.uri, location);
        }
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
          onPress={onClose}
        >
          <Text>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {isFocused && (
        <CameraView
          ref={cameraRef}
          className="flex-1"
          facing={useFrontCamera ? "front" : "back"}
          flash={flashEnabled ? "on" : "off"}
        >
          {/* AR Overlay */}
          {showAR && notes.length > 0 && (
            <View className="absolute inset-0">
              <ViroARSceneNavigator
                initialScene={{
                  scene: ARNotesScene,
                }}
                style={{ flex: 1 }}
                viroAppProps={{ notes }}
              />
            </View>
          )}

          <SafeAreaView className="flex-1">
            {/* Top Controls */}
            <View className="flex-row justify-between p-4">
              <TouchableOpacity
                onPress={onClose}
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
                  onPress={() => setShowAR(!showAR)}
                  className="w-10 h-10 bg-black/30 rounded-full items-center justify-center"
                >
                  <MaterialIcons name="view-in-ar" size={20} color="white" />
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
      )}
    </View>
  );
}
