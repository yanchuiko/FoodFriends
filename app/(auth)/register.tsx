/**
 * REGISTER
 *
 * This screen provides the registration functionality for the FoodFriends app.
 * Users can create an account using Firebase Auth, select an avatar and upload it to Firebase Storage,
 * and store their information in Firebase Firestore.
 *
 * Features:
 * - Avatar selection and upload to Firebase Storage
 * - Firebase Authentication (createUserWithEmailAndPassword)
 * - Firestore user document creation
 * - Input validation and error handling
 *
 **/

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native"; // React Native components
import { useState, useCallback } from "react"; // React hooks
import { useFocusEffect } from "@react-navigation/native"; // Lifecycle hook
import { router } from "expo-router"; // Navigation
import * as ImagePicker from "expo-image-picker"; // Image picker
import { v4 as uuidv4 } from "uuid"; // UUID generator
import "react-native-get-random-values"; // Needed for UUID to work in React Native
import { AuthModal } from "@/components/AuthModal"; // Reusable custom component for input fields
import { setIsRegistering } from "@/app/_layout"; // Global loading state

import { auth, storage, db } from "@/firebase"; // Firebase configuration
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"; // Firebase Auth
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage
import { doc, setDoc } from "firebase/firestore"; // Firebase Firestore

import { Ionicons } from "@expo/vector-icons"; // Icons
import { COLORS } from "@/styles/colors"; // Color constants
import { styles } from "@/styles/app/registerStyles"; // Styles

export default function RegisterScreen() {
  const [name, setName] = useState(""); // User full name
  const [email, setEmail] = useState(""); // User email input
  const [password, setPassword] = useState(""); // User password input
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password input
  const [avatar, setAvatar] = useState<string | null>(null); // Avatar image URI
  const [error, setError] = useState(""); // Error message to display
  const [loading, setLoading] = useState(false); // Button loading state

  // Reset state (in case the user navigates back to this screen)
  useFocusEffect(
    useCallback(() => {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAvatar(null);
      setError("");
      setLoading(false);
    }, [])
  );

  // Pick an avatar image from the device's library
  const pickAvatar = async () => {
    try {
      // Request permission to access the image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8, // I've reduced the image quality to improve performance of loading
      });

      // Check if the user canceled the image picker
      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
        setError("");
      }
    } catch (err) {
      // Handle any errors that occur during image picking
      setError("Failed to pick avatar");
      console.error(err);
    }
  };

  // Upload the avatar image to Firebase Storage
  const uploadAvatar = async (uri: string, userId: string) => {
    const response = await fetch(uri); // Fetch the image from the URI
    const blob = await response.blob(); // Convert the image to a blob
    const avatarId = uuidv4(); // Generate a unique ID for the avatar
    const storageRef = ref(storage, `avatars/${userId}/${avatarId}.jpg`); // Create a reference to the storage location

    await uploadBytes(storageRef, blob); // Upload the image blob to Firebase Storage
    return await getDownloadURL(storageRef); // Get the download URL of the uploaded image
  };

  // Register functionality
  async function register() {
    // Field validation
    if (!name || !email || !password || !confirmPassword || !avatar) {
      setError("Please fill in all fields and select an avatar");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (name.length < 3) {
      setError("Name must be at least 3 characters long");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true); // Set loading state for button
    setError(""); // Clear any previous error messages

    try {
      setIsRegistering(true);
      // Attempt to create a new user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get the user object from the credential
      const user = userCredential.user;

      // Upload the avatar image to Firebase Storage
      const avatarUrl = await uploadAvatar(avatar, user.uid);
      await updateProfile(user, {
        displayName: name,
        photoURL: avatarUrl,
      });

      // Create a new document in Firestore for the user
      await setDoc(doc(db, "users", user.uid), {
        userId: user.uid,
        name,
        nameSearch: name.toLowerCase(),
        email,
        avatarUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Navigate to the login screen after successful registration
      await auth.signOut();
      setIsRegistering(false);
      router.replace("/login");
    } catch (err: any) {
      // Firebase Auth error codes
      switch (err?.code) {
        case "auth/email-already-in-use":
          setError("This email is already registered");
          break;
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/weak-password":
          setError("Password is too weak");
          break;
        default:
          setError(
            process.env.NODE_ENV === "development"
              ? `Registration failed: ${err.message}`
              : "Failed to create account. Please try again."
          );
      }
      setLoading(false);
      setIsRegistering(false);
    }
  }

  // Render the Register Screen
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
                  testID="logo-image"
                />
              </View>

              <Text style={styles.welcomeText}>
                Sign up and see what your friends cook up!
              </Text>
            </View>

            {/* Register Form */}
            <View style={styles.formContainer}>
              {/* Show Error Message */}
              {error ? <Text style={styles.error}>{error}</Text> : null}

              {/* Avatar Picker */}
              <View style={styles.avatarSection}>
                <TouchableOpacity
                  style={styles.avatarButton}
                  onPress={pickAvatar}
                >
                  {avatar ? (
                    <Image
                      source={{ uri: avatar }}
                      style={styles.avatarImage}
                      testID="selected-avatar"
                    />
                  ) : (
                    <Ionicons
                      name="person-circle-outline"
                      size={50}
                      color={COLORS.white}
                      testID="avatar-icon"
                    />
                  )}
                </TouchableOpacity>
              </View>

              {/* Name Input */}
              <AuthModal
                label="Name"
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                autoCapitalize="words"
              />

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
                placeholder="Create a password"
                autoCapitalize="none"
                //secureTextEntry // Was commented out for proper e2e testing (can be uncommented)
              />

              {/* Confirm Password Input */}
              <AuthModal
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                autoCapitalize="none"
                //secureTextEntry // Was commented out for proper e2e testing (can be uncommented)
              />

              {/* Submit Button */}
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={register}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Text>
              </TouchableOpacity>

              {/* Navigation Link to Login */}
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.linkText}>
                  Already have an account?{" "}
                  <Text style={styles.linkTextBold}>Log in</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
