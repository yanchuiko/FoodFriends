/**
 * FEED CARD MODAL
 *
 * This component represents a single swipeable post in the feed.
 * It shows the post image, user info, description, and allows interaction:
 * - Like the post
 * - View/add comments
 * - Share the post with friends via Messages
 *
 **/

import { View, Text, Image, TouchableOpacity } from "react-native"; // React Native components
import { useState, useEffect } from "react"; // React hooks
import { formatDistanceToNow } from "date-fns"; // Date formatting
import { CommentsModal } from "@/components/CommentModal"; // Comments modal component
import { ShareModal } from "@/components/ShareModal"; // Share modal component

import { auth, db } from "@/firebase"; // Firebase configuration
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"; // Firestore operations

import { Ionicons } from "@expo/vector-icons"; // Icons
import { COLORS } from "@/styles/colors"; // Color constants
import { styles } from "@/styles/components/feedCardModalStyles"; // Styles

export function FeedCardModal({ post }: { post: any }) {
  const [liked, setLiked] = useState(false); // Whether current user liked this post
  const [likeCount, setLikeCount] = useState(post.likes || 0); // Total like count
  const [showComments, setShowComments] = useState(false); // Comment modal toggle
  const [showShareModal, setShowShareModal] = useState(false); // Share modal toggle
  const currentUser = auth.currentUser; // Authenticated user

  // Check if the current user has liked the post
  useEffect(() => {
    if (!currentUser) return;
    const isLiked = post.likedBy?.includes(currentUser.uid);
    if (isLiked !== liked) {
      setLiked(isLiked);
    }
  }, [post.likedBy]);

  // Toggle like/unlike functionality
  const like = async () => {
    if (!currentUser) return;

    // Reference to the post document
    const postRef = doc(db, "posts", post.id);

    try {
      if (liked) {
        // Unlike post
        setLiked(false);
        setLikeCount((prev: number) => prev - 1);
        await updateDoc(postRef, {
          likedBy: arrayRemove(currentUser.uid),
          likes: likeCount - 1,
        });
      } else {
        // Like post
        setLiked(true);
        setLikeCount((prev: number) => prev + 1);
        await updateDoc(postRef, {
          likedBy: arrayUnion(currentUser.uid),
          likes: likeCount + 1,
        });
      }
    } catch (err) {
      console.error("Failed to update like:", err);
    }
  };

  // Render the Feed Card Modal
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {/* Post Header: User Info */}
        <View style={styles.header}>
          <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
          <View style={styles.headerText}>
            <Text style={styles.userName}>{post.userName}</Text>
            <Text style={styles.timestamp}>
              {formatDistanceToNow(post.createdAt.toDate(), {
                addSuffix: true,
              })}
            </Text>
          </View>
        </View>

        {/* Post Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: post.imageUrl }} style={styles.image} />
        </View>

        {/* Post Caption/Description */}
        <View style={styles.caption}>
          <Text style={styles.captionText}>{post.description}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          {/* Share Button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={() => setShowShareModal(true)}
            testID="share-button"
          >
            <Ionicons
              name="arrow-undo"
              size={30}
              color={COLORS.vibrantYellow}
            />
          </TouchableOpacity>

          {/* Comment Button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.commentButton]}
            onPress={() => setShowComments(true)}
            testID="comment-button"
          >
            <Ionicons name="chatbubble" size={30} color={COLORS.skyBlue} />
          </TouchableOpacity>

          {/* Like Button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.likeButton]}
            onPress={like}
            testID="like-button"
          >
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={30}
              color={COLORS.red}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Comments Modal */}
      <CommentsModal
        visible={showComments}
        onClose={() => setShowComments(false)}
        postId={post.id}
      />

      {/* Share Modal */}
      <ShareModal
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
        post={post}
      />
    </View>
  );
}
