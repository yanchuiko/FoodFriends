/**
 * SHARE MODAL
 *
 * This modal allows users to share a post with a friend via Messages.
 * It:
 * - Lists all friends the user can message
 * - Lets the user pick a friend to send the post to
 * - Sends the post (image + original author name) to the selected friend
 * - Creates a new chat if one doesn’t already exist
 *
 **/

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native"; // React Native components
import { useState, useEffect } from "react"; // React hooks
import { useRouter } from "expo-router"; // Routing library for Expo

import { auth, db } from "@/firebase"; // Firebase configuration
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore"; // Firestore operations

import { Ionicons } from "@expo/vector-icons"; // Icons
import { COLORS } from "@/styles/colors"; // Color constants
import { styles } from "@/styles/components/shareModalStyles"; // Styles

// Props for the ShareModal component
interface ShareModalProps {
  visible: boolean; // Modal visibility
  onClose: () => void; // Function to close the modal
  post: any; // Post data to be shared
}

export function ShareModal({ visible, onClose, post }: ShareModalProps) {
  const [friends, setFriends] = useState<any[]>([]); // List of friends to share with
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null); // Selected friend to share with
  const [loading, setLoading] = useState(true); // Loading state for fetching friends
  const [sharing, setSharing] = useState(false); // State while sending the post
  const router = useRouter(); // Router for navigation
  const currentUser = auth.currentUser; // Current authenticated user

  // Fetch friends when modal opens
  useEffect(() => {
    if (!visible || !currentUser) return;

    // Fetch friends from Firestore
    const fetchFriends = async () => {
      setLoading(true);

      // Get accepted friendships
      const friendshipQuery = query(
        collection(db, "friendships"),
        where("participants", "array-contains", currentUser.uid),
        where("status", "==", "accepted")
      );

      // Fetch friendships
      const friendshipSnap = await getDocs(friendshipQuery);

      // Extract friend IDs (excluding current user)
      const friendIds = friendshipSnap.docs.map((doc) => {
        const data = doc.data();
        return data.participants.find((id: string) => id !== currentUser.uid);
      });

      // If no friends, set empty state
      if (friendIds.length === 0) {
        setFriends([]);
        setSelectedFriend(null);
        setLoading(false);
        return;
      }

      // Fetch user details for each friend
      const usersQuery = query(
        collection(db, "users"),
        where("userId", "in", friendIds)
      );
      const usersSnap = await getDocs(usersQuery);
      const list = usersSnap.docs.map((doc) => doc.data());

      setFriends(list);
      setLoading(false);
    };

    fetchFriends();
  }, [visible]);

  // Handle sharing the post
  const share = async () => {
    if (!currentUser || !selectedFriend) return;
    setSharing(true);

    try {
      // Check for an existing chat between the user and friend
      const existingQuery = query(
        collection(db, "chats"),
        where("type", "==", "direct"),
        where("participants", "array-contains", currentUser.uid)
      );

      // Fetch existing chats
      const existingSnap = await getDocs(existingQuery);

      // Variable to store chat ID
      let chatId = null;

      // Loop through existing chats to find a match
      for (const doc of existingSnap.docs) {
        const data = doc.data();
        if (data.participants.includes(selectedFriend)) {
          chatId = doc.id;
          break;
        }
      }

      // Create a new chat if it doesn't exist
      if (!chatId) {
        const chatData = {
          type: "direct",
          participants: [currentUser.uid, selectedFriend],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastMessage: null,
        };
        const docRef = await addDoc(collection(db, "chats"), chatData);
        chatId = docRef.id;
      }

      // Add shared post message to the chat
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        senderId: currentUser.uid,
        imageUrl: post.imageUrl,
        originalUserName: post.userName,
        createdAt: serverTimestamp(),
      });

      // Update the chat's lastMessage and unreadCount
      const chatRef = doc(db, "chats", chatId);
      const chatDoc = await getDoc(chatRef);
      const chatData = chatDoc.data();
      const receiverId = chatData?.participants.find(
        (uid: string) => uid !== currentUser.uid
      );

      await updateDoc(chatRef, {
        updatedAt: serverTimestamp(),
        lastMessage: {
          text: "Shared a post",
          sender: currentUser.uid,
          timestamp: serverTimestamp(),
        },
        [`unreadCount.${receiverId}`]:
          (chatData?.unreadCount?.[receiverId] || 0) + 1,
      });

      // Navigate to the chat screen
      router.push(`/chat/${chatId}`);
      onClose();
    } catch (err) {
      console.error("Share error:", err);
      Alert.alert("Error", "Failed to share the post.");
    } finally {
      setSharing(false);
    }
  };

  // Render the Share Modal
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
            <Text style={styles.title}>Share</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close-outline" size={24} color={COLORS.black} />
            </TouchableOpacity>
          </View>

          {/* Friend List */}
          {loading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.orange}
              style={{ marginTop: 40 }}
            />
          ) : friends.length === 0 ? (
            <Text style={styles.emptyText}>No friends to share with yet.</Text>
          ) : (
            <ScrollView style={styles.scroll}>
              {friends.map((item) => (
                <TouchableOpacity
                  key={item.userId}
                  style={[
                    styles.friendItem,
                    selectedFriend === item.userId && styles.friendSelected,
                  ]}
                  onPress={() => setSelectedFriend(item.userId)}
                >
                  <Image
                    source={{ uri: item.avatarUrl }}
                    style={styles.avatar}
                  />
                  <Text
                    style={[
                      styles.friendName,
                      selectedFriend === item.userId && { color: COLORS.white },
                    ]}
                  >
                    {item.name}
                  </Text>
                  {selectedFriend === item.userId && (
                    <View style={styles.checkmark}>
                      <Ionicons name="checkmark" size={20} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Share Button */}
          <TouchableOpacity
            style={[
              styles.createButton,
              (!selectedFriend || sharing || friends.length === 0) && {
                opacity: 0.4,
              },
            ]}
            onPress={share}
            disabled={!selectedFriend || sharing || friends.length === 0}
          >
            <Text style={styles.createButtonText}>
              {sharing ? "Sharing..." : "Share Post"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
