/**
 * POST INFO MODAL
 *
 * This component displays detailed information about a selected post.
 * It shows all users who liked the post and all comments on it.
 * The modal appears as a bottom sheet and provides real-time updates
 *
 * Features:
 * - Modal layout with scrollable content
 * - Fetches and displays users who liked the post
 * - Fetches and displays all comments for the post
 * - Real-time updates for both likes and comments
 *
 **/

import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native"; // React Native components
import React, { useEffect, useState } from "react"; // React hooks
import { formatDistanceToNow } from "date-fns"; // Date formatting

import { db } from "@/firebase"; // Firebase config
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore"; // Firestore operations

import { Ionicons } from "@expo/vector-icons"; // Icons
import { COLORS } from "@/styles/colors"; // Color constants
import { styles } from "@/styles/components/postInfoModalStyles"; // Styles

// Props for the PostInfo component
interface PostInfoProps {
  visible: boolean; // Modal visibility
  onClose: () => void; // Function to close the modal
  postId: string; // ID of the post to fetch data for
}

export function PostInfo({ visible, onClose, postId }: PostInfoProps) {
  const [likes, setLikes] = useState<any[]>([]); // List of users who liked the post
  const [comments, setComments] = useState<any[]>([]); // List of comments
  const [loadingLikes, setLoadingLikes] = useState(true); // Loading state for likes
  const [loadingComments, setLoadingComments] = useState(true); // Loading state for comments

  // Listen for real-time updates to post likes and comments
  useEffect(() => {
    if (!visible || !postId) return;

    // Reference to the post document
    const postRef = doc(db, "posts", postId);

    // Listener for post document changes (used to track likes)
    const unsubscribePost = onSnapshot(postRef, async (postSnap) => {
      const likedBy = postSnap.data()?.likedBy || []; // Array of user IDs who liked the post

      // Check if there are any likes
      if (likedBy.length === 0) {
        setLikes([]);
        setLoadingLikes(false);
        return;
      }

      const userData: any[] = []; // Array to store user data
      
      // Fetch user data for each user who liked the post
      for (const userId of likedBy) {
        const userSnap = await getDoc(doc(db, "users", userId));
        if (userSnap.exists()) {
          userData.push(userSnap.data());
        }
      }

      setLikes(userData);
      setLoadingLikes(false);
    });

    // Query to fetch comments for the post
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );

    // Fetch comments in real-time
    const unsubscribeComments = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }));

      setComments(data);
      setLoadingComments(false);
    });

    // Cleanup function to unsubscribe from listeners
    return () => {
      unsubscribePost();
      unsubscribeComments();
    };
  }, [visible, postId]);

  // Render the Post Info Modal
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Post Info</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons
                name="close-outline"
                size={24}
                color={COLORS.black}
                testID="close-post"
              />
            </TouchableOpacity>
          </View>

          {/* Likes and Comments List */}
          <FlatList
            ListHeaderComponent={() => (
              <>
                {/* Likes Section */}
                <Text style={styles.sectionTitleLikes}>Likes</Text>
                {loadingLikes ? (
                  <ActivityIndicator
                    size="small"
                    color={COLORS.orange}
                    style={{ marginVertical: 8 }}
                  />
                ) : likes.length === 0 ? (
                  <Text style={styles.emptyTextLikes}>No likes yet.</Text>
                ) : (
                  likes.map((user) => (
                    <View key={user.userId} style={styles.itemRow}>
                      <Image
                        source={{ uri: user.avatarUrl }}
                        style={styles.avatar}
                      />
                      <Text style={styles.userName}>{user.name}</Text>
                      <Ionicons
                        name="heart"
                        size={18}
                        color={COLORS.red}
                        style={{ marginLeft: "auto" }}
                      />
                    </View>
                  ))
                )}

                {/* Comments Section */}
                <Text style={styles.sectionTitleComments}>Comments</Text>
              </>
            )}
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Image
                  source={{ uri: item.userAvatar }}
                  style={styles.avatar}
                />
                <View style={styles.commentBubble}>
                  <Text style={styles.userName}>{item.userName}</Text>
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
            ListEmptyComponent={
              loadingComments ? (
                <ActivityIndicator
                  size="large"
                  color={COLORS.orange}
                  style={{ marginTop: 40 }}
                />
              ) : (
                <Text style={styles.emptyTextComments}>No comments yet.</Text>
              )
            }
            contentContainerStyle={{ padding: 16 }}
          />
        </View>
      </View>
    </Modal>
  );
}
