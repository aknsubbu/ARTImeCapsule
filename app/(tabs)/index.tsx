import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView className="flex-1 p-4">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-bold">Welcome Back!</Text>
          <TouchableOpacity className="p-2">
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View className="bg-[#2A9D8F] p-6 rounded-2xl mb-6">
          <Text className="text-white text-lg mb-2">Create New Memory</Text>
          <Text className="text-white opacity-80">
            Capture and share your moments in AR
          </Text>
          <TouchableOpacity className="bg-white mt-4 py-2 px-4 rounded-lg self-start">
            <Text className="text-[#2A9D8F] font-semibold">Start Now</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-lg font-semibold mb-4">Recent Activities</Text>
        <View className="space-y-4">{/* Activity items would go here */}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
