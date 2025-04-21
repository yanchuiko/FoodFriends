/**
 * MESSAGES MODAL
 *
 * This modal allows users to start a new direct chat with a friend.
 * It shows a list of friends the user hasn't messaged yet, and enables
 * chat creation with a selected friend.
 *
 * Features:
 * - Displays friends who don’t have an existing chat
 * - Filters out users with existing direct chats
 * - Allows selection and creation of a new chat
 * - Opens the newly created chat or navigates to the existing one
 * - UI feedback for loading and chat creation state
 *
 **/

import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native"; // React Native components
import { useState, useEffect } from "react"; // React hooks
import { useRouter } from "expo-router"; // Navigation

import { auth, db } from "@/firebase"; // Firebase config
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"; // Firestore operations

import { Ionicons } from "@expo/vector-icons"; // Icons
import { COLORS } from "@/styles/colors"; // Color constants
import { styles } from "@/styles/components/messagesModalStyles"; // Styles

// Props interface
interface MessagesModalProps {
  visible: boolean; // Modal visibility
  onClose: () => void; // Function to close the modal
}

export function MessagesModal({ visible, onClose }: MessagesModalProps) {
  const [friends, setFriends] = useState<any[]>([]); // Friends not yet messaged
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null); // Selected friend to chat with
  const [loading, setLoading] = useState(true); // Loading state for friends
  const [creating, setCreating] = useState(false); // Creating chat state
  const router = useRouter(); // Navigation
  const currentUser = auth.currentUser; // Authenticated user

  // Fetch friends who don’t have a chat
  useEffect(() => {
    if (!visible || !currentUser) return;

    // Function to fetch friends
    const fetchFriends = async () => {
      setLoading(true);

      // Get accepted friends
      const friendshipQuery = query(
        collection(db, "friendships"),
        where("participants", "array-contains", currentUser.uid),
        where("status", "==", "accepted")
      );
      const friendshipSnap = await getDocs(friendshipQuery);

      // Extract friend userIds
      const friendIds = friendshipSnap.docs.map((doc) => {
        const data = doc.data();
        return data.participants.find((id: string) => id !== currentUser.uid);
      });

      // Get existing direct chats
      const chatsSnap = await getDocs(
        query(
          collection(db, "chats"),
          where("type", "==", "direct"),
          where("participants", "array-contains", currentUser.uid)
        )
      );

      // Extract userIds from existing chats
      const alreadyChattedIds = chatsSnap.docs.map((doc) => {
        const data = doc.data();
        return data.participants.find((id: string) => id !== currentUser.uid);
      });

      // Filter out users who already have a chat
      const filteredFriendIds = friendIds.filter(
        (id: string) => !alreadyChattedIds.includes(id)
      );

      // If no friends to message
      if (filteredFriendIds.length === 0) {
        setFriends([]);
        setSelectedFriend(null);
        setLoading(false);
        return;
      }

      // Fetch user details of remaining friends
      const usersQuery = query(
        collection(db, "users"),
        where("userId", "in", filteredFriendIds)
      );
      const usersSnap = await getDocs(usersQuery);
      const list = usersSnap.docs.map((doc) => doc.data());

      setFriends(list);
      setLoading(false);
    };

    fetchFriends();
  }, [visible]);

  // Create or navigate to chat
  const chat = async () => {
    if (!currentUser || !selectedFriend) return;

    setCreating(true);

    // Check if chat already exists
    const existingQuery = query(
      collection(db, "chats"),
      where("type", "==", "direct"),
      where("participants", "array-contains", currentUser.uid)
    );
    const existingSnap = await getDocs(existingQuery);

    // Find existing chat with selected friend
    const existing = existingSnap.docs.find((doc) => {
      const data = doc.data();
      return data.participants.includes(selectedFriend);
    });

    // If chat exists, go to it
    if (existing) {
      router.push(`/chat/${existing.id}`);
      onClose();
      return;
    }

    // Otherwise, create a new chat
    const chatData = {
      type: "direct",
      participants: [currentUser.uid, selectedFriend],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: null,
    };

    // Add new chat to Firestore
    const docRef = await addDoc(collection(db, "chats"), chatData);

    // Navigate to new chat
    router.push(`/chat/${docRef.id}`);
    onClose();
    setCreating(false);
  };

  // Render the Messages Modal
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
            <Text style={styles.title}>New Chat</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close-outline" size={24} color={COLORS.black} />
            </TouchableOpacity>
          </View>

          {/* Loading Spinner */}
          {loading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.orange}
              style={{ marginTop: 40 }}
            />
          ) : friends.length === 0 ? (
            <Text style={styles.emptyText}>No friends to message yet.</Text>
          ) : (
            <ScrollView style={styles.scroll}>
              {/* Friend List */}
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
                      selectedFriend === item.userId && {
                        color: COLORS.white,
                      },
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

          {/* Confirm Button */}
          <TouchableOpacity
            style={[
              styles.createButton,
              (!selectedFriend || creating || friends.length === 0) && {
                opacity: 0.4,
              },
            ]}
            onPress={chat}
            disabled={!selectedFriend || creating || friends.length === 0}
          >
            <Text style={styles.createButtonText}>
              {creating ? "Starting..." : "Start Chat"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
