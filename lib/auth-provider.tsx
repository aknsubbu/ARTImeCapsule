// import React, { createContext, useContext, useEffect, useState } from "react";
// import { nhost } from "./nhost-config";
// import { NhostProvider } from "@nhost/react";
// import { useRouter, useSegments } from "expo-router";
// import * as Linking from "expo-linking";

// // Define types for the auth context
// type AuthContextType = {
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   user: any | null;
//   signInWithMagicLink: (email: string) => Promise<boolean>;
//   signOut: () => Promise<void>;
// };

// // Create an auth context with default values
// export const AuthContext = createContext<AuthContextType>({
//   isAuthenticated: false,
//   isLoading: true,
//   user: null,
//   signInWithMagicLink: async () => false,
//   signOut: async () => {},
// });

// // Custom hook to use the auth context
// export const useAuth = () => useContext(AuthContext);

// // Provider component to wrap your app
// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   return (
//     <NhostProvider nhost={nhost}>
//       <AuthProviderContent>{children}</AuthProviderContent>
//     </NhostProvider>
//   );
// }

// function AuthProviderContent({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const segments = useSegments();
//   const [localIsAuthenticated, setLocalIsAuthenticated] = useState(false);
//   const [localIsLoading, setLocalIsLoading] = useState(true);

//   // Fetch authentication status on component mount and subscribe to changes
//   useEffect(() => {
//     // Initial authentication check
//     const checkAuthStatus = async () => {
//       try {
//         const authStatus = nhost.auth.getAuthenticationStatus();
//         setLocalIsAuthenticated(authStatus.isAuthenticated);
//         setLocalIsLoading(authStatus.isLoading);

//         // Subscribe to auth state changes
//         const unsubscribe = nhost.auth.onAuthStateChanged((event) => {
//           setLocalIsAuthenticated(event === "SIGNED_IN");
//           setLocalIsLoading(false);
//         });

//         return () => {
//           unsubscribe();
//         };
//       } catch (error) {
//         console.error("Error checking auth status:", error);
//         setLocalIsLoading(false);
//       }
//     };

//     checkAuthStatus();
//   }, []);

//   // Handle URL events for magic link
//   useEffect(() => {
//     const handleAuthCallback = async (event: { url: string }) => {
//       if (event.url.includes("auth-callback")) {
//         console.log("Auth callback received:", event.url);

//         try {
//           const urlObject = new URL(event.url);
//           const refreshToken = urlObject.searchParams.get("refreshToken");

//           if (refreshToken) {
//             console.log("Attempting to refresh session");
//             const { session, error } = await nhost.auth.refreshSession(
//               refreshToken
//             );

//             if (error) {
//               console.error("Session refresh error:", error);
//               router.replace("/");
//             } else {
//               console.log("Session refreshed successfully");
//             }
//           }
//         } catch (error) {
//           console.error("Error handling auth callback:", error);
//           router.replace("/");
//         }
//       }
//     };

//     // Set up URL event listener
//     const subscription = Linking.addEventListener("url", handleAuthCallback);

//     // Clean up subscription
//     return () => {
//       subscription.remove();
//     };
//   }, [router]);

//   // Handle routing based on authentication state
//   useEffect(() => {
//     if (!localIsLoading) {
//       const firstSegment = segments[0] as string | undefined;

//       // Check if user is in a non-authenticated area
//       const isInAuthGroup = Boolean(firstSegment && firstSegment === "(auth)");
//       const isAtRoot = Boolean(
//         firstSegment === "" || firstSegment === undefined
//       );
//       const isAtAuthCallback = Boolean(
//         firstSegment && firstSegment === "auth-callback"
//       );

//       // Determine if user is in a non-authenticated route
//       const isInUnauthenticatedArea =
//         isAtRoot || isAtAuthCallback || isInAuthGroup;

//       if (localIsAuthenticated && isInUnauthenticatedArea) {
//         // Redirect to app if authenticated and in unauthenticated area
//         router.replace("/(tabs)");
//       } else if (!localIsAuthenticated && !isInUnauthenticatedArea) {
//         // Redirect to login if not authenticated and not in auth area
//         router.replace("/");
//       }
//     }
//   }, [localIsAuthenticated, localIsLoading, segments, router]);

//   // Function to sign in with Magic Link
//   const signInWithMagicLink = async (email: string): Promise<boolean> => {
//     try {
//       const redirectTo = Linking.createURL("/auth-callback");
//       const { error } = await nhost.auth.signIn({
//         email,
//         options: {
//           redirectTo,
//         },
//       });

//       if (error) {
//         console.error("Magic link error:", error);
//         return false;
//       }
//       return true;
//     } catch (error) {
//       console.error("Magic link exception:", error);
//       return false;
//     }
//   };

//   // Function to sign out
//   const signOut = async () => {
//     await nhost.auth.signOut();
//     router.replace("/");
//   };

//   // Get the user
//   const user = nhost.auth.getUser();

//   // Provide auth context values
//   return (
//     <AuthContext.Provider
//       value={{
//         isAuthenticated: localIsAuthenticated,
//         isLoading: localIsLoading,
//         user,
//         signInWithMagicLink,
//         signOut,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { nhost } from "./nhost-config";
import { NhostProvider } from "@nhost/react";
import { useRouter, useSegments } from "expo-router";
import * as Linking from "expo-linking";
import type { User } from "@nhost/react";

// Debugging function to log detailed information
const logDebugInfo = (message: string, data?: any) => {
  console.log(
    `[AUTH DEBUG] ${message}`,
    data ? JSON.stringify(data, null, 2) : ""
  );
};

// Define types for the auth context
type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signInWithMagicLink: (email: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

// Create an auth context with default values
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  signInWithMagicLink: async () => false,
  signOut: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component to wrap your app
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <NhostProvider nhost={nhost}>
      <AuthProviderContent>{children}</AuthProviderContent>
    </NhostProvider>
  );
}

function AuthProviderContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();

  // Detailed state tracking
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
  }>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  // Refs for tracking and preventing unnecessary updates
  const mountCountRef = useRef(0);
  const authCheckCountRef = useRef(0);
  const routingCheckCountRef = useRef(0);
  const hasRedirectedRef = useRef(false);

  // Debugging render and state changes
  useEffect(() => {
    mountCountRef.current += 1;
    logDebugInfo("Component Mount", {
      mountCount: mountCountRef.current,
      segments: segments,
      authState: authState,
    });
  });

  // Memoized sign in with magic link function
  const signInWithMagicLink = useCallback(
    async (email: string): Promise<boolean> => {
      logDebugInfo("Attempting Magic Link Sign In", { email });
      try {
        const redirectTo = Linking.createURL("/auth-callback");
        const { error } = await nhost.auth.signIn({
          email,
          options: {
            redirectTo,
          },
        });

        if (error) {
          logDebugInfo("Magic Link Sign In Error", { error });
          return false;
        }
        return true;
      } catch (error) {
        logDebugInfo("Magic Link Sign In Exception", { error });
        return false;
      }
    },
    []
  );

  // Memoized sign out function
  const signOut = useCallback(async () => {
    logDebugInfo("Signing Out");
    await nhost.auth.signOut();
    router.replace("/");
  }, [router]);

  // Initial authentication check
  useEffect(() => {
    authCheckCountRef.current += 1;
    logDebugInfo("Authentication Check", {
      checkCount: authCheckCountRef.current,
      currentAuthState: authState,
    });

    const performAuthCheck = async () => {
      try {
        const authStatus = nhost.auth.getAuthenticationStatus();
        const user = nhost.auth.getUser();

        logDebugInfo("Auth Status Check", {
          isAuthenticated: authStatus.isAuthenticated,
          user: !!user,
        });

        setAuthState({
          isAuthenticated: authStatus.isAuthenticated,
          isLoading: false,
          user,
        });
      } catch (error) {
        logDebugInfo("Auth Check Error", { error });
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    };

    performAuthCheck();

    // Set up state change listener
    const unsubscribe = nhost.auth.onAuthStateChanged((event) => {
      logDebugInfo("Auth State Change", {
        isAuthenticated: event === "SIGNED_IN",
      });

      const user = nhost.auth.getUser();
      setAuthState({
        isAuthenticated: event === "SIGNED_IN",
        isLoading: false,
        user,
      });
    });

    return () => {
      unsubscribe();
    };
  }, []); // Empty dependency array

  // Routing logic effect
  useEffect(() => {
    // Prevent multiple redirects
    if (hasRedirectedRef.current) return;

    routingCheckCountRef.current += 1;
    logDebugInfo("Routing Check", {
      routingCheckCount: routingCheckCountRef.current,
      segments: segments,
      authState: authState,
    });

    // Only run routing logic when loading is complete
    if (!authState.isLoading) {
      const firstSegment = segments[0] as string | undefined;

      // Detailed segment analysis
      const routingInfo = {
        firstSegment,
        isInAuthGroup: Boolean(firstSegment && firstSegment === "(auth)"),
        isAtRoot: Boolean(firstSegment === "" || firstSegment === undefined),
        isAtAuthCallback: Boolean(
          firstSegment && firstSegment === "auth-callback"
        ),
      };

      logDebugInfo("Routing Analysis", routingInfo);

      // Determine if user is in a non-authenticated route
      const isInUnauthenticatedArea =
        routingInfo.isAtRoot ||
        routingInfo.isAtAuthCallback ||
        routingInfo.isInAuthGroup;

      // Routing decisions
      if (!authState.isAuthenticated && routingInfo.firstSegment === "(tabs)") {
        logDebugInfo(
          "Routing Decision",
          "Redirecting to login (not authenticated in tabs)"
        );
        hasRedirectedRef.current = true;
        router.replace("/");
        return;
      }

      if (authState.isAuthenticated && isInUnauthenticatedArea) {
        logDebugInfo(
          "Routing Decision",
          "Redirecting to tabs (authenticated in unauth area)"
        );
        hasRedirectedRef.current = true;
        router.replace("/(tabs)");
      } else if (!authState.isAuthenticated && !isInUnauthenticatedArea) {
        logDebugInfo(
          "Routing Decision",
          "Redirecting to login (not authenticated in auth area)"
        );
        hasRedirectedRef.current = true;
        router.replace("/");
      }
    }
  }, [authState.isAuthenticated, authState.isLoading, segments, router]);

  // URL callback handling
  useEffect(() => {
    const handleAuthCallback = async (event: { url: string }) => {
      logDebugInfo("Auth Callback Received", { url: event.url });

      try {
        const urlObject = new URL(event.url);
        const refreshToken = urlObject.searchParams.get("refreshToken");

        if (refreshToken) {
          logDebugInfo("Attempting Session Refresh", {
            hasRefreshToken: !!refreshToken,
          });
          const { session, error } = await nhost.auth.refreshSession(
            refreshToken
          );

          if (error) {
            logDebugInfo("Session Refresh Error", { error });
            router.replace("/");
          } else {
            logDebugInfo("Session Refresh Successful");
          }
        }
      } catch (error) {
        logDebugInfo("Auth Callback Error", { error });
        router.replace("/");
      }
    };

    // Set up URL event listener
    const subscription = Linking.addEventListener("url", handleAuthCallback);

    // Clean up subscription
    return () => {
      subscription.remove();
    };
  }, [router]);

  // Memoize context value
  const contextValue = useMemo(
    () => ({
      isAuthenticated: authState.isAuthenticated,
      isLoading: authState.isLoading,
      user: authState.user,
      signInWithMagicLink,
      signOut,
    }),
    [
      authState.isAuthenticated,
      authState.isLoading,
      authState.user,
      signInWithMagicLink,
      signOut,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function DebugAuthStateDisplay() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    console.log("DEBUG AUTH STATE", {
      isAuthenticated,
      isLoading,
      user: user ? { id: user.id, email: user.email } : null,
      segments,
    });
  }, [isAuthenticated, isLoading, user, segments, router]);

  return null;
}
