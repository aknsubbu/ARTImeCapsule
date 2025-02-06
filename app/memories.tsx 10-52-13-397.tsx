import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function MemoriesPage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <Text className="text-2xl font-bold">My Memories</Text>
          <Text className="text-gray-500 mt-1">
            Your personal AR time capsules
          </Text>
        </View>

        <View className="flex-row space-x-4 mb-6">
          <TouchableOpacity className="bg-[#2A9D8F] px-4 py-2 rounded-full">
            <Text className="text-white">All</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-full">
            <Text className="text-gray-800">Private</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-full">
            <Text className="text-gray-800">Public</Text>
          </TouchableOpacity>
        </View>

        <View className="space-y-4">{/* Memory items would go here */}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
