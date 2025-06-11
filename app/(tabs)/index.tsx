/**
 * HOME SCREEN (FEED)
 *
 * This screen displays the main feed of the app where users can swipe
 * through their friends' latest posts.
 *
 * Features:
 * - Shows posts only from your friends within the last 24 hours
 * - Fetches and displays user data (name, avatar) with each post
 * - Horizontal swipeable cards (FlatList with paging)
 * - Custom header with notifications and settings buttons
 * - Real-time updates using Firestore `onSnapshot`
 * - Modal for viewing notifications
 */

import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
  LayoutChangeEvent,
} from "react-native"; // React Native components
import { useEffect, useState, useLayoutEffect } from "react"; // React hooks
import { useNavigation } from "expo-router"; // Navigation hook for Expo Router
import { Timestamp } from "firebase/firestore"; // Timestamp type from Firestore
import { NotificationsModal } from "@/components/NotificationsModal"; // Reusable custom component for notifications
import { FeedCardModal } from "@/components/FeedCardModal"; // Reusable custom component for feed cards

import { auth, db } from "@/firebase"; // Firebase configuration
import {
  collection,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore"; // Firestore operations

import { Ionicons } from "@expo/vector-icons"; // Icons
import { COLORS } from "@/styles/colors"; // Color constants
import { styles } from "@/styles/app/feedStyles"; // Styles

export default function HomeScreen() {
  const navigation = useNavigation(); // Navigation object for screen transitions
  const [showModal, setShowModal] = useState(false); // Controls visibility of notifications modal
  const [activeIndex, setActiveIndex] = useState(0); // Active feed card index
  const [containerWidth, setContainerWidth] = useState(0); // Width of each card (matches screen width)
  const [posts, setPosts] = useState<any[]>([]); // Array of friend's posts with user data

  // Set up navigation options for header buttons
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          style={{ marginRight: 16 }}
          testID="notification-button"
        >
          <Ionicons name="notifications" size={30} color={COLORS.black} />
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => console.log("Settings pressed")} // No functionality yet:(
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="settings" size={30} color={COLORS.black} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  // Fetch posts from friends in real-time
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    // Unsubscribe function for posts listener
    let unsubscribePosts: (() => void) | null = null;

    // Get all friendships for current user
    const friendshipsRef = collection(db, "friendships");
    const friendsQuery = query(
      friendshipsRef,
      where("participants", "array-contains", user.uid)
    );

    // Real-time listener for friendship updates
    const unsubscribeFriends = onSnapshot(friendsQuery, async (snapshot) => {
      // Extract friend IDs from accepted friendships
      const friendIds = snapshot.docs
        .map((doc) => doc.data())
        .filter((data) => data.status === "accepted") // Only accepted friendships
        .map((data) => data.participants.find((id: string) => id !== user.uid));

      // Cleanup previous posts listener
      if (unsubscribePosts) unsubscribePosts();

      // If no friends, clear posts
      if (friendIds.length === 0) {
        setPosts([]);
        return;
      }

      // !FOR DEMO PURPOSES: I COMMENT OUT 24 HOURS FUNCTION AND CHANGE POSTS QUERY
      // !SO YOU CAN SEE THE POSTS FROM THE REPORT
      // !CAN BE CHANGED BACK TO REAL VERSION IF YOU WANT TO TEST IT
      // Get posts from the last 24 hours
      const twentyFourHoursAgo = Timestamp.fromDate(
        new Date(Date.now() - 24 * 60 * 60 * 1000)
      );

      // !DEMO VERSION
      // const postsQuery = query(
      //   collection(db, "posts"),
      //   where("userId", "in", friendIds),
      //   orderBy("createdAt", "desc")
      // );

      // !REAL VERSION
      // Query latest posts from friends
      const postsQuery = query(
        collection(db, "posts"),
        where("userId", "in", friendIds),
        where("createdAt", ">=", twentyFourHoursAgo),
        orderBy("createdAt", "desc")
      );

      // Listen to post updates
      unsubscribePosts = onSnapshot(postsQuery, async (postSnapshots) => {
        // Map through each post and fetch user data
        const postsWithUserData = await Promise.all(
          postSnapshots.docs.map(async (docSnap) => {
            const data = docSnap.data();

            // Get user info (name, avatar)
            const userRef = doc(db, "users", data.userId);
            const userDoc = await getDoc(userRef);

            // Return post data with user info
            return {
              id: docSnap.id,
              ...data,
              userName: userDoc?.data()?.name,
              userAvatar: userDoc?.data()?.avatarUrl,
            };
          })
        );

        setPosts(postsWithUserData);
      });
    });

    // Cleanup all listeners
    return () => {
      unsubscribeFriends();
      if (unsubscribePosts) unsubscribePosts();
    };
  }, []);

  // Called on horizontal scroll to track which feed card is currently visible
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Calculate current index by dividing horizontal scroll offset by container width
    const index = Math.round(
      e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width
    );
    setActiveIndex(index); // Update active card index
  };

  // Called when the layout of the scroll container is calculated
  const onContainerLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setContainerWidth(width); // Store container width for scroll calculations
  };

  // Render empty state when no posts are available (No friends or posts)
  const renderEmptyState = () => (
    <View style={styles.messageContainer}>
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/11929/11929988.png",
        }}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>No posts yet</Text>
      <Text style={styles.emptyText}>
        Follow your friends to see their delicious food posts here!
      </Text>
    </View>
  );

  // Render the Feed Screen
  return (
    <View style={styles.container} onLayout={onContainerLayout}>
      {containerWidth > 0 && posts.length > 0 ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.cardWrapper, { width: containerWidth }]}>
              <FeedCardModal post={item} />
            </View>
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToAlignment="center"
        />
      ) : (
        renderEmptyState()
      )}

      {/* Slide-up modal for notifications */}
      <NotificationsModal
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
}
