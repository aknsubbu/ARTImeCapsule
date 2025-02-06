import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function DiscoverScreen() {
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

        <Text className="text-lg font-semibold mb-4">Nearby Memories</Text>
        <View className="space-y-4">{/* Nearby memories would go here */}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
