/**
 * POST
 *
 * This screen allows users to create and share a food post with their friends.
 * Users can take a photo or select an image from their gallery, write a description,
 * and upload the post.
 *
 * Features:
 * - Camera and gallery image selection
 * - Image upload to Firebase Storage
 * - Post creation in Firestore with user metadata
 * - Input validation and error handling
 * - Post success confirmation screen
 *
 **/

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from "react-native"; // React Native components
import { useState } from "react"; // React hook
import { SafeAreaView } from "react-native-safe-area-context"; // SafeAreaView wrapper
import * as ImagePicker from "expo-image-picker"; // Image picker

import { auth, db, storage } from "@/firebase"; // Firebase configuration
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage
import { collection, addDoc, serverTimestamp } from "firebase/firestore"; // Firebase Firestore
import { v4 as uuidv4 } from "uuid"; // UUID generator

import { Ionicons } from "@expo/vector-icons"; // Icons
import { COLORS } from "@/styles/colors"; // Color constants
import { styles } from "@/styles/app/postStyles"; // Styles

export default function PostScreen() {
  const [image, setImage] = useState<string | null>(null); // Selected image URI
  const [description, setDescription] = useState(""); // Post description
  const [loading, setLoading] = useState(false); // Post button loading state
  const [error, setError] = useState<string | null>(null); // Error message
  const [showSuccess, setShowSuccess] = useState(false); // Success screen toggle

  // Take a photo using the camera
  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: "images",
        quality: 0.8, // For better loading performance
      });

      // Check if the user canceled the image picker
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setError(null);
      }
    } catch (err) {
      // Handle any errors that occur during image picking
      console.error("Failed to take photo:", err);
      setError("Failed to take photo.");
    }
  };

  // Pick an image from gallery
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        quality: 0.8, // For better loading performance
      });

      // Check if the user canceled the image picker
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setError(null);
      }
    } catch (err) {
      // Handle any errors that occur during image picking
      console.error("Failed to pick image:", err);
      setError("Failed to pick image.");
    }
  };

  // Upload image to Firebase Storage
  const uploadImage = async (uri: string) => {
    const response = await fetch(uri); // Fetch the image URI
    const blob = await response.blob(); // Convert to blob

    const user = auth.currentUser; // Get the current user
    if (!user) throw new Error("User not authenticated"); // Ensure user is authenticated (without this, the app will crash)

    const imageId = uuidv4(); // Generate a unique ID for the image
    const storageRef = ref(storage, `posts/${user.uid}/${imageId}.jpg`); // Create a reference in Firebase Storage

    await uploadBytes(storageRef, blob); // Upload the image blob
    const downloadURL = await getDownloadURL(storageRef); // Get the download URL

    return { imageUrl: downloadURL, imageId }; // Return the image URL and ID
  };

  // Post functionality
  const post = async () => {
    // Field validation
    if (!image) {
      setError("Please select an image.");
      return;
    }

    if (!description.trim()) {
      setError("Please write a description.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if the user is authenticated
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      // Upload image and get the URL
      const { imageUrl, imageId } = await uploadImage(image);

      // Create a new post in Firestore
      const postRef = collection(db, "posts");
      await addDoc(postRef, {
        userId: user.uid,
        userName: user.displayName,
        userAvatar: user.photoURL,
        imageUrl,
        imageId,
        description: description.trim(),
        createdAt: serverTimestamp(),
        likes: 0,
        likedBy: [],
        comments: 0,
        shares: 0,
      });

      // Reset state after successful post
      setLoading(false);
      setImage(null);
      setDescription("");
      setShowSuccess(true);
    } catch (err) {
      console.error("Post creation failed:", err);
      setLoading(false);
      setError("Failed to create post. Please try again.");
    }
  };

  // Show success screen if post is created
  if (showSuccess) {
    return (
      <SafeAreaView style={styles.successContainer}>
        <View style={styles.successContent}>
          <Ionicons
            name="checkmark-circle-outline"
            size={64}
            color={COLORS.green}
          />
          <Text style={styles.successTitle} testID="success-message">
            Post Created!
          </Text>
          <Text style={styles.successText}>
            Your post has been successfully shared with your friends.
          </Text>
          <TouchableOpacity
            style={styles.successButton}
            onPress={() => setShowSuccess(false)}
          >
            <Text style={styles.successButtonText}>Create New Post</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Render the Post Screen
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 110 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.content}>
              <View style={styles.formContainer}>
                {/* Show Error Message */}
                {error && (
                  <Text
                    style={{
                      color: COLORS.red,
                      marginBottom: 12,
                      textAlign: "center",
                    }}
                    testID="error-message"
                  >
                    {error}
                  </Text>
                )}

                {/* Image Picker */}
                <View style={styles.imageSection} testID="image-section">
                  {image ? (
                    <View
                      style={styles.selectedImageContainer}
                      testID="selected-image-container"
                    >
                      <Image
                        source={{ uri: image }}
                        style={styles.selectedImage}
                        testID="selected-image"
                      />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => setImage(null)}
                        testID="remove-image-button"
                      >
                        <Ionicons
                          name="close-outline"
                          size={30}
                          color={COLORS.white}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <TouchableOpacity
                        style={styles.halfImageButtonTop}
                        onPress={takePhoto}
                        testID="camera-button"
                      >
                        <View style={styles.iconContainer}>
                          <Ionicons
                            name="camera-outline"
                            size={55}
                            color={COLORS.white}
                          />
                        </View>
                        <Text style={styles.imageButtonText}>Take a photo</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.halfImageButtonBottom}
                        onPress={pickImage}
                        testID="image-picker-button"
                      >
                        <View style={styles.iconContainer}>
                          <Ionicons
                            name="image-outline"
                            size={55}
                            color={COLORS.white}
                          />
                        </View>
                        <Text style={styles.imageButtonText}>
                          Choose from gallery
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>

                {/* Description Input */}
                <View
                  style={styles.descriptionContainer}
                  testID="description-box"
                >
                  <TextInput
                    style={styles.descriptionInput}
                    placeholder="Write a description..."
                    placeholderTextColor={COLORS.darkGrey}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    maxLength={100} // Limit to 100 characters (demonstration purpose)
                    textAlignVertical="top"
                    blurOnSubmit={true}
                    testID="description-input"
                  />
                </View>

                {/* Post Button */}
                <TouchableOpacity
                  style={[
                    styles.postButton,
                    (!image || !description.trim() || loading) && {
                      opacity: 0.5,
                    },
                  ]}
                  onPress={post}
                  disabled={!image || !description.trim() || loading}
                  testID="post-button"
                >
                  <Text style={styles.postButtonText} testID="post-button-text">
                    {loading ? "Posting..." : "Post"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
