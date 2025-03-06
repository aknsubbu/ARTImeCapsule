import React, { useState, useEffect, useRef } from "react";
import MapView from "react-native-maps";
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { useLocationUpdates } from "@/hooks/useLocationUpdates";
import { useRouter } from "expo-router";

interface LocationData {
  latitude?: number;
  longitude?: number;
  altitude?: number | null;
  heading?: number | null;
}

export default function MapViewPage() {
  const router = useRouter();
  const { location, error } = useLocationUpdates();
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState({
    latitude: 13.0843,
    longitude: 80.2705,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    if (location?.coords) {
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
    }
  }, [location]);
  const handleBackPress = () => {
    router.push("/(tabs)/discover");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1">
        <TouchableOpacity
          onPress={handleBackPress}
          className="absolute top-12 left-4 z-10 bg-white p-2 rounded-full shadow-md"
        >
          <Text className="text-lg font-bold">← Back</Text>
        </TouchableOpacity>
        <MapView
          ref={mapRef}
          className="w-full h-full"
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={true}
          followsUserLocation={true}
        />

        {/* Coordinates overlay */}
        <View className="absolute bottom-8 self-center bg-white p-3 rounded-xl shadow-lg opacity-80"></View>
        <Text className="text-center font-medium text-sm">
          Lat: {region.latitude.toFixed(6)}
        </Text>
        <Text className="text-center font-medium text-sm">
          Long: {region.longitude.toFixed(6)}
        </Text>
      </View>
    </SafeAreaView>
  );
}
