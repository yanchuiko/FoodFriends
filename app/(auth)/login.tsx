/**
 * LOGIN
 *
 * This screen provides the login functionality for the FoodFriends app.
 * Users can enter their email and password to authenticate using Firebase Auth.
 *
 * Features:
 * - Firebase Authentication (signInWithEmailAndPassword)
 * - Input validation and error handling
 *
 **/

import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"; // React Native components
import { useState } from "react"; // React hooks
import { router } from "expo-router"; // Navigation
import { auth } from "@/firebase"; // Firebase configuration
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase authentication
import { AuthModal } from "@/components/AuthModal"; // Reusable custom component for input fields
import { styles } from "@/styles/app/loginStyles"; // Styles

export default function LoginScreen() {
  const [email, setEmail] = useState(""); // User email input
  const [password, setPassword] = useState(""); // User password input
  const [error, setError] = useState(""); // Error message to display
  const [loading, setLoading] = useState(false); // Login button loading state

  // Login fucntionality
  async function login() {
    // Field validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true); // Set loading state for button
    setError(""); // Clear any previous error messages

    try {
      // Attempt to sign in with Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      // Firebase Auth error codes
      switch (err?.code) {
        case "auth/invalid-email":
        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("Invalid email or password");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later");
          break;
        default:
          setError("Login failed. Please try again.");
      }
      setLoading(false);
    }
  }

  // Render the Login Screen
  return (
    <KeyboardAvoidingView
      style={styles.safeArea}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>FoodFriends</Text>
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/11929/11929988.png",
                  }}
                  style={styles.logoIcon}
                  accessible
                  accessibilityLabel="FoodFriends App Logo"
                />
              </View>

              <Text style={styles.welcomeText}>
                Log in and let the fun begin!
              </Text>
            </View>

            {/* Login Form */}
            <View style={styles.formContainer}>
              {/* Show Error Message */}
              {error ? <Text style={styles.error}>{error}</Text> : null}

              {/* Email Input */}
              <AuthModal
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                autoCapitalize="none"
                keyboardType="email-address"
              />

              {/* Password Input */}
              <AuthModal
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                autoCapitalize="none"
                //secureTextEntry // Was commented out for proper e2e testing (can be uncommented)
              />

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={login}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel="Log in"
              >
                <Text style={styles.buttonText}>
                  {loading ? "Logging in..." : "Log in"}
                </Text>
              </TouchableOpacity>

              {/* Navigation Link to Register */}
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push("/register")}
                testID="register"
              >
                <Text style={styles.linkText}>
                  Don’t have an account?{" "}
                  <Text style={styles.linkTextBold}>Sign up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
