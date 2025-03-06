import { useEffect, useState } from "react";
import { Slot, useSegments, useRouter } from "expo-router";
import { AuthProvider, useAuth } from "../lib/auth-provider";
import { View, ActivityIndicator, Text } from "react-native";

// Auth guard component with improved update handling
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  // Track if we've already performed a redirect
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Only proceed if auth state is loaded and we haven't redirected yet
    if (!isLoading && !hasRedirected) {
      // Get the first segment to determine route type
      const segment = segments[0] || "";

      // Check if route should be protected
      const isProtectedRoute = segment === "(tabs)";
      // Check if route is explicitly auth-related
      const isAuthRoute = segment === "login" || segment === "auth-callback";

      // Only redirect if necessary
      let shouldRedirect = false;
      let redirectTo = "";

      if (!isAuthenticated && isProtectedRoute) {
        shouldRedirect = true;
        redirectTo = "/login";
      } else if (isAuthenticated && isAuthRoute) {
        shouldRedirect = true;
        redirectTo = "/(tabs)";
      }

      // Perform redirect if needed
      if (shouldRedirect) {
        setHasRedirected(true);
        router.replace(redirectTo as any);
      }
    }
  }, [isAuthenticated, isLoading, segments, hasRedirected]);

  // Reset redirect flag when segments change (user navigates)
  useEffect(() => {
    setHasRedirected(false);
  }, [segments.join("/")]);

  // Show loading indicator while checking auth status
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3584e4" />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  // Render the app content
  return <>{children}</>;
}

// Root layout
export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard>
        <Slot />
      </AuthGuard>
    </AuthProvider>
  );
}
