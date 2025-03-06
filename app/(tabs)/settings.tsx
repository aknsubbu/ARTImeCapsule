import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { useAuth } from "@/lib/auth-provider";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState("light");

  const { signOut } = useAuth();

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
            <View className="bg-gray-50 p-4 rounded-xl">
              <Text className="mb-3 text-gray-700">App Theme</Text>
              <View className="flex-row space-x-3">
                {[
                  { id: "light", label: "Light", icon: "☀️" },
                  { id: "dark", label: "Dark", icon: "🌙" },
                  { id: "system", label: "System", icon: "⚙️" },
                ].map((theme) => (
                  <TouchableOpacity
                    key={theme.id}
                    onPress={() => setSelectedTheme(theme.id)}
                    className={`flex-1 py-3 px-2 rounded-lg items-center ${
                      selectedTheme === theme.id
                        ? "bg-teal-500"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <Text className="text-xl mb-1">{theme.icon}</Text>
                    <Text
                      className={`font-medium ${
                        selectedTheme === theme.id
                          ? "text-white"
                          : "text-gray-800"
                      }`}
                    >
                      {theme.label}
                    </Text>
                  </TouchableOpacity>
                ))}
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

          <View>
            <Text className="text-lg font-semibold mb-4">Account</Text>
            <TouchableOpacity
              className="bg-red-500 p-4 rounded-xl"
              onPress={() => {
                Alert.alert("Sign Out", "Are you sure you want to sign out?", [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Sign Out",
                    onPress: () => signOut(),
                  },
                ]);
              }}
            >
              <Text className="text-white text-center font-semibold">
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
