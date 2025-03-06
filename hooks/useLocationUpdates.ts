import { useState, useEffect } from "react";
import * as Location from "expo-location";

export function useLocationUpdates() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startLocationUpdates = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Location permission denied");
          return;
        }

        // Get initial location
        const initialLocation = await Location.getCurrentPositionAsync({});
        setLocation(initialLocation);

        // Start watching for location updates
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 10000,
            distanceInterval: 5,
          },
          (newLocation) => {
            setLocation(newLocation);
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to get location");
      }
    };

    startLocationUpdates();

    // Cleanup subscription on unmount
    return () => {
      subscription?.remove();
    };
  }, []);

  return { location, error };
}
