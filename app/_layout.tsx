/**
 * ROOT LAYOUT
 *
 * This is the root layout file for the app. It handles:
 * - Firebase auth state tracking
 * - Conditional redirects based on login status
 * - App-wide gesture support
 * - Initial loading screen during auth check
 */

import { useEffect, useState } from "react"; // React hooks
import { Stack } from "expo-router"; // Stack navigator for routing
import { StatusBar } from "expo-status-bar"; // Status bar management
import { GestureHandlerRootView } from "react-native-gesture-handler"; // Gesture handler root view for handling gestures
import { auth } from "@/firebase"; // Firebase authentication
import { onAuthStateChanged } from "firebase/auth"; // Firebase authentication state listener
import { StyleSheet } from "react-native"; // Stylesheet for styling components

// Variable to track registration state
let isRegistering = false;

// Function to set the registration state
export function setIsRegistering(value: boolean) {
  isRegistering = value;
}

export default function RootLayout() {
  const [user, setUser] = useState<any>(null); // State to track the authenticated user
  const [initialLoad, setInitialLoad] = useState(true); // State to track initial loading state

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!isRegistering) {
        setUser(user);
      }
      setInitialLoad(false);
    });

    return () => unsubscribe();
  }, []);

  // Loading screen while checking auth state
  if (initialLoad) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="loading" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="dark" />
      </GestureHandlerRootView>
    );
  }

  // Main app layout with conditional redirects
  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false }}
          redirect={!!user}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
          redirect={!user}
        />
        <Stack.Screen name="error" options={{ title: "Oops!" }} />
      </Stack>
      <StatusBar style="dark" />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
