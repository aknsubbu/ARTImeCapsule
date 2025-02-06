import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView className="flex-1 p-4">
        <View className="items-center mb-6">
          <Image
            source={{ uri: "https://via.placeholder.com/100" }}
            className="w-24 h-24 rounded-full mb-4"
          />
          <Text className="text-2xl font-bold">John Doe</Text>
          <Text className="text-gray-500">@johndoe</Text>
        </View>

        <View className="flex-row justify-around mb-6 bg-gray-50 p-4 rounded-xl">
          <View className="items-center">
            <Text className="text-2xl font-bold">24</Text>
            <Text className="text-gray-500">Memories</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold">128</Text>
            <Text className="text-gray-500">Following</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold">346</Text>
            <Text className="text-gray-500">Followers</Text>
          </View>
        </View>

        <TouchableOpacity className="bg-[#2A9D8F] p-3 rounded-lg mb-6">
          <Text className="text-white text-center font-semibold">
            Edit Profile
          </Text>
        </TouchableOpacity>

        <View className="space-y-4">{/* Profile content would go here */}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
