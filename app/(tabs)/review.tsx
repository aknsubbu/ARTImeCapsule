import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ReviewPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { imageUri, lat, lng } = params;

  const [noteText, setNoteText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Function to save the note to your database
  const saveNote = async () => {
    if (!noteText.trim()) return;

    setIsSaving(true);

    try {
      // Here you would implement your actual database saving logic
      // For example:
      // await saveNoteToDatabase({
      //   content: noteText,
      //   imageUri,
      //   latitude: lat,
      //   longitude: lng,
      //   created_at: new Date().toISOString()
      // });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate back to home after saving
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: "Create Memory",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView className="flex-1">
        {/* Image Preview */}
        <View className="w-full h-64">
          {imageUri ? (
            <Image
              source={{ uri: imageUri as string }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full bg-gray-200 items-center justify-center">
              <Text>Image preview not available</Text>
            </View>
          )}
        </View>

        {/* Location Info */}
        <View className="p-4 bg-gray-100 flex-row items-center">
          <Ionicons name="location" size={20} color="#666" />
          <Text className="ml-2 text-gray-700">
            {lat && lng
              ? `Latitude: ${Number(lat).toFixed(6)}, Longitude: ${Number(
                  lng
                ).toFixed(6)}`
              : "Location not available"}
          </Text>
        </View>

        {/* Note Input */}
        <View className="p-4">
          <Text className="text-lg font-bold mb-2">Add your memory</Text>
          <TextInput
            className="bg-gray-100 p-4 rounded-lg min-h-20 text-base"
            multiline
            placeholder="What do you want to remember about this place?"
            value={noteText}
            onChangeText={setNoteText}
          />

          <Text className="text-xs text-gray-500 mt-2">
            This note will be visible to anyone who visits this location.
          </Text>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity
          className={`w-full py-3 rounded-full ${
            noteText.trim() ? "bg-blue-500" : "bg-gray-300"
          }`}
          onPress={saveNote}
          disabled={!noteText.trim() || isSaving}
        >
          <Text className="text-white font-bold text-center">
            {isSaving ? "Saving..." : "Save Memory"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
