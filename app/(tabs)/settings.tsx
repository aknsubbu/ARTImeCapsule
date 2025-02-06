import { View, Text, ScrollView, Switch, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState("light");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-6">Settings</Text>

        <View className="space-y-6">
          <View>
            <Text className="text-lg font-semibold mb-4">Notifications</Text>
            <View className="flex-row justify-between items-center bg-gray-50 p-4 rounded-xl">
              <Text>Push Notifications</Text>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#767577", true: "#2A9D8F" }}
              />
            </View>
          </View>

          <View>
            <Text className="text-lg font-semibold mb-4">Theme</Text>
            <View className="flex-row justify-between items-center bg-gray-50 p-4 rounded-xl">
              <Text className="w-1/2">App Theme</Text>
              <View className="w-1/2 bg-gray-50 rounded-xl overflow-hidden">
                <Picker
                  selectedValue={selectedTheme}
                  onValueChange={(itemValue) => setSelectedTheme(itemValue)}
                  style={{
                    backgroundColor: "transparent",
                  }}
                >
                  <Picker.Item
                    label="Light Theme"
                    value="light"
                    style={{ fontSize: 16 }}
                  />
                  <Picker.Item
                    label="Dark Theme"
                    value="dark"
                    style={{ fontSize: 16 }}
                  />
                  <Picker.Item
                    label="System Theme"
                    value="system"
                    style={{ fontSize: 16 }}
                  />
                </Picker>
              </View>
            </View>
          </View>

          <View>
            <Text className="text-lg font-semibold mb-4">
              Location Services
            </Text>
            <View className="flex-row justify-between items-center bg-gray-50 p-4 rounded-xl">
              <Text>Location Access</Text>
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                trackColor={{ false: "#767577", true: "#2A9D8F" }}
              />
            </View>
          </View>

          <TouchableOpacity className="bg-red-500 p-4 rounded-xl">
            <Text className="text-white text-center font-semibold">
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
