/**
 * PROFILE
 *
 * This screen displays the current user's profile (his/her posts details),
 * current streak, and friend count. It also provides logout functionality.
 *
 * Features:
 * - Displays user profile data (name, avatar)
 * - Shows total posts, current streak, and friend count
 * - Fetches and sorts user's posts from Firestore
 * - Real-time updates using Firestore `onSnapshot`
 * - Opens full-screen modal for post details
 * - Logout button in the header
 *
 **/

import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native"; // React Native components
import React, { useEffect, useState, useLayoutEffect } from "react"; // React hooks
import { useNavigation } from "expo-router"; // Navigation hook
import { router } from "expo-router"; // Router for navigation
import { differenceInCalendarDays } from "date-fns"; // For streak calculation
import { PostInfo } from "@/components/PostInfoModal"; // Reusable custom component for post details

import { auth, db } from "@/firebase"; // Firebase config
import { signOut } from "firebase/auth"; // Firebase Auth
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore"; // Firestore queries

import { Ionicons } from "@expo/vector-icons"; // Icons
import { COLORS } from "@/styles/colors"; // Color constants
import { styles } from "@/styles/app/profileStyles"; // Styles

export default function ProfileScreen() {
  const [userData, setUserData] = useState<any>(null); // User profile data
  const [posts, setPosts] = useState<any[]>([]); // User's post list
  const [friendsCount, setFriendsCount] = useState(0); // Number of friends
  const [streak, setStreak] = useState(0); // Posting streak
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null); // For modal display
  const currentUser = auth.currentUser; // Authenticated user
  const navigation = useNavigation(); // Navigation instance

  // Logout button in header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logout} style={{ marginRight: 16 }}>
          <Ionicons name="log-out" size={30} color="black" testID="sign-out" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Logout functionality
  const logout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      router.replace("/(auth)/login"); // Redirect to login screen
    } catch (error) {
      Alert.alert("Logout Failed", "Something went wrong.");
      console.error("Logout error:", error);
    }
  };

  // Fetch user info, posts, friends, streak
  useEffect(() => {
    if (!currentUser) return;

    // Fetch user profile data
    const fetchUser = async () => {
      const userRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) setUserData(docSnap.data());
    };

    // Real-time listener that fetchs and sorts user's posts
    const unsubscribePosts = onSnapshot(
      query(collection(db, "posts"), where("userId", "==", currentUser.uid)),
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              createdAt: data.createdAt,
              ...data,
            };
          })
          .sort((a, b) => {
            const aDate = a.createdAt?.toDate?.() ?? new Date(0);
            const bDate = b.createdAt?.toDate?.() ?? new Date(0);
            return bDate.getTime() - aDate.getTime(); // Sort newest first
          });

        setPosts(data);
      }
    );

    // Real-time listener that calculates posting streak
    const unsubscribeUserPosts = onSnapshot(
      query(collection(db, "posts"), where("userId", "==", currentUser.uid)),
      (snapshot) => {
        const postDates: Date[] = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            return data.createdAt?.toDate?.();
          })
          .filter((date) => date instanceof Date)
          .sort((a, b) => b.getTime() - a.getTime());

        // Calculate streak: consecutive days of posting
        if (postDates.length === 0) {
          setStreak(0);
          return;
        }

        let currentStreak = 1;
        let previousDate = postDates[0];

        // Check for consecutive days
        for (let i = 1; i < postDates.length; i++) {
          const diff = differenceInCalendarDays(previousDate, postDates[i]);

          // Check if the difference is 1 day
          if (diff === 1) {
            currentStreak++;
            previousDate = postDates[i];
          } else if (diff === 0) {
            continue;
          } else {
            break;
          }
        }

        // Check if the last post was more than 1 day ago
        const daysSinceLastPost = differenceInCalendarDays(
          new Date(),
          postDates[0]
        );
        if (daysSinceLastPost > 1) currentStreak = 0;

        setStreak(currentStreak);
      }
    );

    // Real-time listener that counts number of accepted friends
    const unsubscribeFriends = onSnapshot(
      query(
        collection(db, "friendships"),
        where("participants", "array-contains", currentUser.uid),
        where("status", "==", "accepted")
      ),
      (snapshot) => setFriendsCount(snapshot.size)
    );

    fetchUser();

    // Cleanup listeners
    return () => {
      unsubscribePosts();
      unsubscribeUserPosts();
      unsubscribeFriends();
    };
  }, [currentUser]);

  // Render individual post item
  const renderPost = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.postWrapper}
      onPress={() => setSelectedPostId(item.id)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
    </TouchableOpacity>
  );

  if (!userData) return null;

  // Render the Profile Screen
  return (
    <View style={styles.container}>
      {/* Avatar */}
      <Image source={{ uri: userData.avatarUrl }} style={styles.avatar} />

      {/* Name and Streak */}
      <View style={styles.nameRow}>
        <Text style={styles.name}>{userData.name}</Text>
        {streak > 0 && (
          <View style={styles.streak}>
            <Ionicons name="flame" size={18} color={COLORS.orange} />
            <Text style={styles.streakText}>{streak}</Text>
          </View>
        )}
      </View>

      {/* Post & Friend Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{posts.length}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <TouchableOpacity
          style={styles.statItem}
          onPress={() => router.push("/friends")}
        >
          <Text style={styles.statNumber}>{friendsCount}</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </TouchableOpacity>
      </View>

      {/* Post Grid */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={renderPost}
        contentContainerStyle={styles.postsGrid}
        ListEmptyComponent={<Text style={styles.emptyText}>No posts yet</Text>}
        columnWrapperStyle={{ gap: 1 }}
      />

      {/* Post Details Modal */}
      <PostInfo
        visible={!!selectedPostId}
        onClose={() => setSelectedPostId(null)}
        postId={selectedPostId || ""}
      />
    </View>
  );
}
