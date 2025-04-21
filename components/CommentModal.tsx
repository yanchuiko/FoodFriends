/**
 * COMMENTS MODAL
 *
 * This modal allows users to view and add comments to a post.
 * It displays all existing comments in chronological order and supports:
 * - Real-time updates for new comments
 * - Comment input field with send button
 * - User avatars, names, timestamps for each comment
 *
 **/

import {
  Modal,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
} from "react-native"; // React Native components
import React, { useEffect, useState } from "react"; // React and hooks
import { formatDistanceToNow } from "date-fns"; // Date formatting

import { auth, db } from "@/firebase"; // Firebase configuration
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"; // Firestore operations

import { Ionicons } from "@expo/vector-icons"; // Icons
import { COLORS } from "@/styles/colors"; // Color constants
import { styles } from "@/styles/components/commentsModalStyles"; // Styles

// Props for the CommentsModal component
interface CommentsModalProps {
  visible: boolean; // Modal visibility
  onClose: () => void; // Function to close the modal
  postId: string; // ID of the post to fetch comments for
}

export function CommentsModal({
  visible,
  onClose,
  postId,
}: CommentsModalProps) {
  const [comments, setComments] = useState<any[]>([]); // List of comments
  const [text, setText] = useState(""); // Comment input
  const [loading, setLoading] = useState(true); // Loading indicator
  const currentUser = auth.currentUser; // Authenticated user

  // Fetch comments when modal opens
  useEffect(() => {
    if (!visible || !postId) return;

    // Query to fetch comments in ascending order of creation time
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );

    // Listen for changes in the comments collection
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }));
      setComments(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [visible, postId]);

  // Send a new comment
  const send = async () => {
    if (!text.trim() || !currentUser) return;

    try {
      // Add a new comment to the Firestore
      await addDoc(collection(db, "posts", postId, "comments"), {
        text: text.trim(),
        userId: currentUser.uid,
        userName: currentUser.displayName,
        userAvatar: currentUser.photoURL,
        createdAt: serverTimestamp(),
      });
      setText("");
    } catch (err) {
      console.error("Send comment error:", err);
    }
  };

  // Render the Comments Modal
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <SafeAreaView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Comments</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons
                name="close-outline"
                size={24}
                color={COLORS.black}
                testID="close-comment"
              />
            </TouchableOpacity>
          </View>

          {/* Comment List */}
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={COLORS.orange} />
            </View>
          ) : comments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.empty}>No comments yet</Text>
            </View>
          ) : (
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.commentsList}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Image
                    source={{ uri: item.userAvatar }}
                    style={styles.avatar}
                  />
                  <View style={styles.commentBubble}>
                    <Text style={styles.name}>{item.userName}</Text>
                    <Text style={styles.text}>{item.text}</Text>
                    {item.createdAt && (
                      <Text style={styles.timestamp}>
                        {formatDistanceToNow(item.createdAt, {
                          addSuffix: true,
                        })}
                      </Text>
                    )}
                  </View>
                </View>
              )}
            />
          )}

          {/* Comment Input */}
          <View style={styles.inputWrapper}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Write a comment..."
                placeholderTextColor={COLORS.darkGrey}
                value={text}
                onChangeText={setText}
              />
              <TouchableOpacity onPress={send} style={styles.sendBtn}>
                <Ionicons
                  name="send"
                  size={20}
                  color="white"
                  testID="send-comment"
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
