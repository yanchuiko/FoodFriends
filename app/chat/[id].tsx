/**
 * CHAT SCREEN
 *
 * This screen displays the direct conversation between two users.
 * It shows the chat history, allows sending new messages, and
 * automatically updates unread message counts.
 *
 * Features:
 * - Real-time message updates using Firestore `onSnapshot`
 * - Displays chat participant’s name and avatar
 * - Sends messages with text input and updates `lastMessage`
 * - Resets `unreadCount` when viewing the chat
 * - Automatically scrolls to latest message
 * - Displays timestamps in human-readable format
 *
 **/

import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from "react-native"; // React Native components
import { useState, useEffect, useRef } from "react"; // React hooks
import { useLocalSearchParams, useRouter } from "expo-router"; // Navigation
import { SafeAreaView } from "react-native-safe-area-context"; // Safe UI padding

import { auth, db } from "@/firebase"; // Firebase config
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore"; // Firestore operations

import { Ionicons } from "@expo/vector-icons"; // Icons
import { COLORS } from "@/styles/colors"; // Color constants
import { styles } from "@/styles/app/chatStyles"; // Styles

export default function ChatScreen() {
  const [messages, setMessages] = useState<any[]>([]); // All chat messages
  const [loading, setLoading] = useState(true); // Loading spinner
  const [text, setText] = useState(""); // Input field text
  const [sending, setSending] = useState(false); // Sending state
  const [chatUserName, setChatUserName] = useState<string>(""); // Other user's name
  const [chatUserAvatar, setChatUserAvatar] = useState<string>(""); // Other user's avatar
  const { id } = useLocalSearchParams(); // Chat ID from route
  const currentUser = auth.currentUser; // Current logged in user
  const router = useRouter(); // Router instance
  const flatListRef = useRef<FlatList>(null); // For scrolling

  // Fetch chat user details
  useEffect(() => {
    const fetchChatUser = async () => {
      if (!currentUser || !id) return;

      const chatDoc = await getDoc(doc(db, "chats", id as string)); // Get chat document
      const data = chatDoc.data(); // Extract data

      // Find the other user in the chat
      const otherUserId = data?.participants.find(
        (uid: string) => uid !== currentUser.uid
      );

      // Fetch other user's details
      if (otherUserId) {
        const userDoc = await getDoc(doc(db, "users", otherUserId));
        const userData = userDoc.data();
        if (userData?.name) {
          setChatUserName(userData.name);
          setChatUserAvatar(userData.avatarUrl);
        }
      }
    };

    fetchChatUser();
  }, [id, currentUser]);

  // Fetch messages from Firestore
  useEffect(() => {
    // Check if chat ID and current user exist
    const q = query(
      collection(db, "chats", id as string, "messages"),
      orderBy("createdAt", "desc")
    );

    // Listen for new messages
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const list: any[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
        });
      });

      setMessages(list);
      setLoading(false);

      // Reset unread count
      const chatRef = doc(db, "chats", id as string);
      await updateDoc(chatRef, {
        ...(currentUser && { [`unreadCount.${currentUser.uid}`]: 0 }),
      });
    });

    return () => unsubscribe();
  }, [id, currentUser]);

  // Messages functionality
  const send = async () => {
    if (!text.trim() || sending || !currentUser) return;

    setSending(true);

    // Prepare message data
    try {
      const messageData = {
        text: text.trim(),
        sender: currentUser.uid,
        senderName: currentUser.displayName,
        senderAvatar: currentUser.photoURL,
        createdAt: serverTimestamp(),
      };

      const chatRef = doc(db, "chats", id as string); // Get chat reference
      const chatDoc = await getDoc(chatRef); // Fetch chat document
      const data = chatDoc.data(); // Extract data

      // Find the other user in the chat
      const receiverId = data?.participants.find(
        (uid: string) => uid !== currentUser.uid
      );

      // Add message to messages subcollection
      await addDoc(
        collection(db, "chats", id as string, "messages"),
        messageData
      );

      // Update chat metadata
      await updateDoc(chatRef, {
        lastMessage: {
          text: text.trim(),
          sender: currentUser.uid,
          timestamp: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
        [`unreadCount.${receiverId}`]:
          (data?.unreadCount?.[receiverId] || 0) + 1,
      });

      setText(""); // Clear input
    } catch (err) {
      console.error("Send message error:", err);
    } finally {
      setSending(false);
    }
  };

  // Format timestamp
  const formatMessageTime = (date: Date) => {
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    return isToday
      ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : date.toLocaleDateString([], { month: "short", day: "numeric" }) +
          ", " +
          date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Render each message bubble
  const renderItem = ({ item }: { item: any }) => {
    const isOwn = (item.sender || item.senderId) === currentUser?.uid; // Check if the message is sent by the current user
    const isSharedImage = !!item.imageUrl && !item.text; // Check if the message is a shared image (Post)

    return (
      <View
        style={[
          styles.messageItem,
          isOwn ? styles.messageRight : styles.messageLeft,
        ]}
      >
        {/* Avatar for incoming messages */}
        {!isOwn && chatUserAvatar && (
          <Image source={{ uri: chatUserAvatar }} style={styles.avatar} />
        )}

        {/* Message bubble */}
        <View
          style={[
            styles.bubble,
            isOwn ? styles.bubbleRight : styles.bubbleLeft,
          ]}
        >
          {/* Shared post image */}
          {isSharedImage && (
            <>
              <Image
                source={{ uri: item.imageUrl }}
                style={{ width: 200, height: 200, borderRadius: 12 }}
                resizeMode="cover"
              />
              {item.originalUserName && (
                <Text
                  style={[
                    styles.timestamp,
                    isOwn && { color: COLORS.white },
                    { fontSize: 14 },
                  ]}
                >
                  Shared from {item.originalUserName}
                </Text>
              )}
            </>
          )}

          {/* Text message */}
          {item.text?.trim() && (
            <Text
              style={[styles.messageText, isOwn && { color: COLORS.white }]}
            >
              {item.text}
            </Text>
          )}

          {/* Timestamp */}
          <Text style={[styles.timestamp, isOwn && { color: COLORS.white }]}>
            {item.createdAt ? formatMessageTime(item.createdAt) : ""}
          </Text>
        </View>
      </View>
    );
  };

  // Render the Chat Screen
  return (
    <SafeAreaView style={styles.container}>
      {/* Chat header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={async () => {
            // Reset unread count when going back
            if (id && currentUser) {
              const chatRef = doc(db, "chats", id as string);
              await updateDoc(chatRef, {
                [`unreadCount.${currentUser.uid}`]: 0,
              });
            }
            router.back();
          }}
          style={styles.backBtn}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={COLORS.black}
            testID="back-arrow"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{chatUserName || "Chat"}</Text>
      </View>

      {/* Messages list */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.orange} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          inverted
          contentContainerStyle={{ padding: 16 }}
        />
      )}

      {/* Message input bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={text}
            onChangeText={setText}
            editable={!sending}
          />
          <TouchableOpacity
            onPress={send}
            disabled={!text.trim() || sending}
            style={styles.sendBtn}
            testID="send-button"
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
