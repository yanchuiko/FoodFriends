/**
 * AUTH LAYOUT
 *
 * This layout wraps all authentication-related screens (Login, Register)
 * inside a stack navigator with headers hidden. It ensures a consistent
 * navigation experience for all screens under the (auth) route group.
 *
 * Features:
 * - Stack navigation for auth screens
 * - Hides the default header
 * - Used by Expo Router for all routes in /app/(auth)
 *
 **/

import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
