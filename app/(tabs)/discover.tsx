import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function DiscoverScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <Text className="text-2xl font-bold">Discover</Text>
          <Text className="text-gray-500 mt-1">
            Explore AR memories around you
          </Text>
        </View>

        <View className="bg-gray-100 rounded-lg p-4 mb-6">
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="search" size={20} color="#666" />
            <Text className="ml-2 text-gray-500">Search locations...</Text>
          </TouchableOpacity>
        </View>

        <View>
          {/* Here go two buttons saying map view and camera view */}
          <View className="flex-row space-x-4 mb-6">
            <TouchableOpacity
              className="flex-1 bg-blue-500 rounded-lg p-3 flex-row items-center justify-center"
              onPress={() => router.push("/(tabs)/mapview")}
            >
              <Ionicons name="map-outline" size={20} color="#FFFFFF" />
              <Text className="ml-2 text-white font-medium">Map View</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-blue-500 rounded-lg p-3 flex-row items-center justify-center">
              <Ionicons name="camera-outline" size={20} color="#FFFFFF" />
              <Text className="ml-2 text-white font-medium">Camera View</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-lg font-semibold mb-4">Nearby Memories</Text>
        <View className="space-y-4">{/* Nearby memories would go here */}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
