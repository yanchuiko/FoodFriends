/**
 * MESSAGES
 *
 * This screen displays the user's direct message inbox.
 * It shows a list of all active chats sorted by most recently updated,
 * and allows navigation to individual conversations.
 *
 * Features:
 * - Real-time chat updates using Firestore
 * - Displays unread message count per chat
 * - Fetches chat participant data (name, avatar)
 * - Formats timestamps into human-readable form
 * - Opens modal to start a new conversation
 *
 **/

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native"; // React Native components
import { useState, useEffect, useLayoutEffect } from "react"; // React hooks
import { SafeAreaView } from "react-native-safe-area-context"; // SafeAreaView
import { useNavigation, router } from "expo-router"; // Navigation
import { formatDistanceToNow, isBefore, subMonths, format } from "date-fns"; // Date formatting utils
import { MessagesModal } from "@/components/NewChatModal"; // Reusable custom component for messages

import { auth, db } from "@/firebase"; // Firebase config
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
} from "firebase/firestore"; // Firestore queries

import { Ionicons } from "@expo/vector-icons"; // Icons
import { COLORS } from "@/styles/colors"; // Color constants
import { styles } from "@/styles/app/messagesStyles"; // Styles

export default function MessagesScreen() {
  const [chats, setChats] = useState<any[]>([]); // All chats user is part of
  const [loading, setLoading] = useState(true); // Loading state while fetching chats
  const [showModal, setShowModal] = useState(false); // Toggle for new message modal
  const navigation = useNavigation(); // Navigation hook
  const currentUser = auth.currentUser; // Current authenticated user

  // New chat button in header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={{ marginRight: 16 }}
          testID="new-chat-button"
        >
          <Ionicons name="add" size={30} color={COLORS.black} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Fetch chats when the component mounts or when currentUser changes
  useEffect(() => {
    if (!currentUser) return;

    // Query all chats where current user is a participant, ordered by last update
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUser.uid),
      orderBy("updatedAt", "desc")
    );

    // Real-time snapshot listener for chat updates
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const fetchedChats: any[] = []; // Array to hold formatted chat data

      // Loop through each chat document
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data(); // Get chat data

        // Get the other user's ID (not current user)
        const otherUserId = data.participants.find(
          (id: string) => id !== currentUser.uid
        );

        // Fetch the other user's name and avatar
        const usersQuery = query(
          collection(db, "users"),
          where("userId", "==", otherUserId)
        );
        const usersSnap = await getDocs(usersQuery);
        const userData = usersSnap.docs[0]?.data();

        // Push formatted chat data to the array
        fetchedChats.push({
          id: docSnap.id,
          name: userData?.name,
          avatar: userData?.avatarUrl,
          lastMessage: data.lastMessage,
          unreadCount: data.unreadCount?.[currentUser.uid] || 0,
        });
      }

      setChats(fetchedChats);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener
  }, [currentUser]);

  // Format chat timestamp to a human-readable string
  const formatLastMessageTime = (timestamp: any) => {
    if (!timestamp) return "";

    const date = timestamp.toDate(); // Convert Firestore timestamp to JS Date object
    const oneMonthAgo = subMonths(new Date(), 1); // Calculate date one month ago

    // If older than 1 month, show full date
    // Else relative time
    return isBefore(date, oneMonthAgo)
      ? format(date, "MMM d")
      : formatDistanceToNow(date, { addSuffix: true });
  };

  // Render chat item
  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => router.push(`/chat/${item.id}`)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.messagePreview} numberOfLines={1}>
          {item.lastMessage?.text || "No messages yet"}
        </Text>
        <Text style={styles.timestamp}>
          {item.lastMessage?.timestamp
            ? formatLastMessageTime(item.lastMessage.timestamp)
            : ""}
        </Text>
      </View>

      {/* Show unread message count if exists */}
      {item.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{item.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  // Render the Messages Screen
  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.orange} />
        </View>
      ) : chats.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No messages yet</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      {/* Modal to create a new chat */}
      <MessagesModal visible={showModal} onClose={() => setShowModal(false)} />
    </SafeAreaView>
  );
}
