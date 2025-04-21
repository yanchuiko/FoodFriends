/**
 * NOTIFICATIONS MODAL
 *
 * This component displays friend-related notifications.
 * Users can accept or decline incoming friend requests and see updates
 * about the status of their own sent requests.
 *
 * Features:
 * - Fetches all unread notifications for the current user
 * - Handles accepting/declining friend requests
 * - Marks notifications as read
 * - Real-time feedback with activity indicators
 * - UI updates after actions (accept, decline, mark as read)
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
import React, { useState, useEffect } from "react"; // React hooks
import { formatDistanceToNow } from "date-fns"; // Date formatting

import { auth, db } from "@/firebase"; // Firebase configuration
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore"; // Firestore operations

import { Ionicons } from "@expo/vector-icons"; // Icons
import { COLORS } from "@/styles/colors"; // Color constants
import { styles } from "@/styles/components/notificationsModalStyles"; // Styles

// Type for each individual notification
type Notification = {
  id: string;
  type: "friendRequest" | "friendRequestAccepted" | "friendRequestDeclined";
  senderId: string;
  senderName: string;
  senderAvatar: string;
  read: boolean;
  createdAt: Date;
};

// Props for the modal
type NotificationsModalProps = {
  visible: boolean; // Modal visibility
  onClose: () => void; // Function to close the modal
};

export function NotificationsModal({
  visible,
  onClose,
}: NotificationsModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]); // List of notifications
  const [loading, setLoading] = useState(true); // Loading state
  const currentUser = auth.currentUser; // Current authenticated user

  // Fetch notifications when modal is opened
  useEffect(() => {
    if (visible && currentUser) {
      fetchNotifications();
    }
  }, [visible, currentUser]);

  // Fetch all unread notifications for the current user
  const fetchNotifications = async () => {
    if (!currentUser) return;

    try {
      // Query to get notifications
      const notificationsRef = collection(db, "notifications");
      const q = query(
        notificationsRef,
        where("userId", "==", currentUser.uid),
        where("read", "==", false)
      );

      // Fetch notifications
      const snapshot = await getDocs(q);

      // Map through the documents to create a list of notifications
      const list: Notification[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        type: doc.data().type,
        senderId: doc.data().senderId,
        senderName: doc.data().senderName,
        senderAvatar: doc.data().senderAvatar,
        read: doc.data().read,
        createdAt: doc.data().createdAt.toDate(),
      }));

      // Sort notifications by creation date (newest first)
      setNotifications(
        list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      );
    } catch (err) {
      console.error("Fetch notifications error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Accept or decline a friend request
  const handleFriendRequest = async (notif: Notification, accept: boolean) => {
    if (!currentUser) return;

    try {
      // Query to find the friendship document
      const friendshipRef = collection(db, "friendships");
      const q = query(
        friendshipRef,
        where("participants", "array-contains", currentUser.uid),
        where("requesterId", "==", notif.senderId)
      );

      // Fetch the friendship document
      const snap = await getDocs(q);
      // If a document exists, get its reference
      if (!snap.empty) {
        const ref = snap.docs[0].ref;

        if (accept) {
          // Accept the request and notify the sender
          await updateDoc(ref, { status: "accepted" });
          await addDoc(collection(db, "notifications"), {
            userId: notif.senderId,
            type: "friendRequestAccepted",
            senderId: currentUser.uid,
            senderName: currentUser.displayName,
            senderAvatar: currentUser.photoURL,
            read: false,
            createdAt: new Date(),
          });
        } else {
          // Decline request and notify sender
          await deleteDoc(ref);
          await addDoc(collection(db, "notifications"), {
            userId: notif.senderId,
            type: "friendRequestDeclined",
            senderId: currentUser.uid,
            senderName: currentUser.displayName,
            senderAvatar: currentUser.photoURL,
            read: false,
            createdAt: new Date(),
          });
        }
      }

      // Mark original notification as read
      await updateDoc(doc(db, "notifications", notif.id), { read: true });
      fetchNotifications(); // Refresh notifications
    } catch (err) {
      console.error("Handle friend request error:", err);
    }
  };

  // Mark any notification as read
  const markAsRead = async (notif: Notification) => {
    try {
      // Update the notification document to mark it as read
      await updateDoc(doc(db, "notifications", notif.id), { read: true });
      fetchNotifications(); // Refresh notifications
    } catch (err) {
      console.error("Mark as read error:", err);
    }
  };

  // Render the Notifications Modal
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Modal header */}
          <View style={styles.header}>
            <Text style={styles.title}>Notifications</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close-outline" size={24} color={COLORS.black} testID="notif-close"/>
            </TouchableOpacity>
          </View>

          {/* Loading state */}
          {loading ? (
            <ActivityIndicator
              size="large"
              color={COLORS.orange}
              style={{ marginTop: 40 }}
            />
          ) : notifications.length === 0 ? (
            <Text style={styles.emptyText}>No notifications</Text>
          ) : (
            <ScrollView style={styles.scroll}>
              {notifications.map((notif) => (
                <View key={notif.id} style={styles.item}>
                  {/* Sender avatar */}
                  <Image
                    source={{ uri: notif.senderAvatar }}
                    style={styles.avatar}
                  />

                  <View style={styles.body}>
                    {/* Notification message */}
                    <Text style={styles.message}>
                      <Text style={styles.name}>{notif.senderName}</Text>
                      {notif.type === "friendRequest"
                        ? " sent you a friend request"
                        : notif.type === "friendRequestAccepted"
                        ? " accepted your friend request"
                        : " declined your friend request"}
                    </Text>

                    {/* Timestamp */}
                    <Text style={styles.time}>
                      {formatDistanceToNow(notif.createdAt, {
                        addSuffix: true,
                      })}
                    </Text>

                    {/* Action buttons */}
                    {notif.type === "friendRequest" ? (
                      <View style={styles.actions}>
                        {/* Accept */}
                        <TouchableOpacity
                          style={[styles.btn, styles.acceptBtn]}
                          onPress={() => handleFriendRequest(notif, true)}
                        >
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={20}
                            color={COLORS.white}
                          />
                          <Text style={styles.acceptText}>Accept</Text>
                        </TouchableOpacity>

                        {/* Decline */}
                        <TouchableOpacity
                          style={[styles.btn, styles.declineBtn]}
                          onPress={() => handleFriendRequest(notif, false)}
                        >
                          <Ionicons
                            name="close-circle-outline"
                            size={20}
                            color={COLORS.white}
                          />
                          <Text style={styles.declineText}>Decline</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      // Status button for accepted/declined
                      <TouchableOpacity
                        style={[
                          styles.statusBtn,
                          notif.type === "friendRequestAccepted"
                            ? styles.acceptedIconBtn
                            : styles.declinedIconBtn,
                        ]}
                        onPress={() => markAsRead(notif)}
                      >
                        <Ionicons
                          name={
                            notif.type === "friendRequestAccepted"
                              ? "checkmark-circle-outline"
                              : "close-circle-outline"
                          }
                          size={20}
                          color={COLORS.white}
                          style={{ marginRight: 6 }}
                        />
                        <Text style={styles.statusText}>
                          {notif.type === "friendRequestAccepted"
                            ? "Accepted"
                            : "Declined"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}
