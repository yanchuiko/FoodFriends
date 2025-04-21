/**
 * FRIENDS
 *
 * This screen manages the social interactions between users in the FoodFriends app.
 * Users can search for other users, send friend requests, view their friends,
 * and remove friends. It also features a leaderboard based on the number of posts.
 *
 * Features:
 * - User search with real-time filtering (excluding already connected users)
 * - Send and manage friend requests via Firestore and Notifications
 * - Real-time friends list with post streak tracking
 * - Leaderboard based on post count (including current user)
 * - Streak calculation based on post dates
 * - Firebase Firestore integration with snapshot listeners
 * - Error handling and state management for a smooth user experience
 *
 **/

import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native"; // React Native components
import { useState, useEffect } from "react"; // React hooks
import { SafeAreaView } from "react-native-safe-area-context"; // SafeAreaView
import { differenceInCalendarDays } from "date-fns"; // Date manipulation library

import { auth, db } from "@/firebase"; // Firebase configuration
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore"; // Firebase operations

import { Ionicons } from "@expo/vector-icons"; // Icons
import { COLORS } from "@/styles/colors"; // Color constants
import { styles } from "@/styles/app/friendsStyles"; // Styles

export default function FriendsScreen() {
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [results, setResults] = useState<any[]>([]); // State for search results
  const [friends, setFriends] = useState<any[]>([]); // State for friends list
  const [leaderboard, setLeaderboard] = useState<any[]>([]); // State for leaderboard
  const [loading, setLoading] = useState(false); // State for loading indicator
  const currentUser = auth.currentUser; // Get current user from Firebase auth

  // Query to retrieve all friendship documents (pending or accepted) involving the current user
  const getFriendshipsQuery = (userId: string) => {
    const friendshipsRef = collection(db, "friendships");
    return query(
      friendshipsRef,
      where("participants", "array-contains", userId)
    );
  };

  // Query to fetch all posts authored by users in the provided user ID array
  const getPostsQuery = (userIds: string[]) => {
    const postsRef = collection(db, "posts");
    return query(postsRef, where("userId", "in", userIds));
  };

  // Extract accepted friend user IDs from the friendship snapshot, excluding the current user's ID
  const extractFriendIds = (snapshot: any, userId: string) => {
    return snapshot.docs
      .map((doc: any) => doc.data())
      .filter((data: any) => data.status === "accepted")
      .map((data: any) =>
        data.participants.find((id: string) => id !== userId)
      );
  };

  // Process the posts snapshot to count total posts and collect post dates per user
  const processPosts = (postsSnap: any) => {
    const postCounts: Record<string, number> = {};
    const userPosts: Record<string, Date[]> = {};

    // postCounts: total number of posts per user
    // userPosts: array of post dates per user (used for streak calculation)
    postsSnap.forEach((doc: any) => {
      const { userId, createdAt } = doc.data();
      if (!createdAt) return;
      const date = createdAt.toDate();
      postCounts[userId] = (postCounts[userId] || 0) + 1;
      if (!userPosts[userId]) userPosts[userId] = [];
      userPosts[userId].push(date);
    });

    return { postCounts, userPosts };
  };

  // Calculate posting streaks for each user based on their post dates
  const calculateStreaks = (userPosts: Record<string, Date[]>) => {
    const streaks: Record<string, number> = {};

    // Iterate through each user
    for (const userId in userPosts) {
      // Sort the user's post dates in descending order (most recent first)
      const dates = userPosts[userId].sort((a, b) => b.getTime() - a.getTime());

      let streak = 1;
      let previousDate = dates[0];

      // Compare consecutive dates to determine streak
      for (let i = 1; i < dates.length; i++) {
        const diff = differenceInCalendarDays(previousDate, dates[i]);

        if (diff === 1) {
          streak++;
          previousDate = dates[i];
        } else if (diff === 0) {
          continue; // same day post, ignore
        } else {
          break; // non-consecutive day, streak ends
        }
      }

      // If the most recent post was over a day ago, streak is reset to 0
      const daysSinceLastPost = differenceInCalendarDays(new Date(), dates[0]);
      if (daysSinceLastPost > 1) {
        streak = 0;
      }

      // Save the user's streak
      streaks[userId] = streak;
    }

    return streaks;
  };

  // Sort the friends list in descending order based on their streak value
  const sortByStreak = (friendsList: any[]) => {
    return [...friendsList].sort((a, b) => (b.streak || 0) - (a.streak || 0));
  };

  // Build a leaderboard combining friends and the current user, sorted by post count
  const buildLeaderboard = (
    friendsList: any[],
    postCounts: Record<string, number>,
    currentUser: any
  ) => {
    const leaderboardUsers = [
      ...friendsList.map((friend) => ({
        ...friend,
        postCount: postCounts[friend.userId] || 0,
        isCurrentUser: false,
      })),
      {
        userId: currentUser.uid,
        name: currentUser.displayName,
        avatarUrl: currentUser.photoURL,
        postCount: postCounts[currentUser.uid] || 0,
        isCurrentUser: true,
      },
    ];

    // Sort the leaderboard in descending order of post count
    return leaderboardUsers.sort((a, b) => b.postCount - a.postCount);
  };

  // Fetch friends' data from Firestore and include their current streak values
  const fetchFriendsList = async (
    friendIds: string[],
    streaks: Record<string, number>
  ) => {
    if (friendIds.length === 0) return [];

    const usersRef = collection(db, "users"); // Reference to the users collection
    const friendsQuery = query(usersRef, where("userId", "in", friendIds)); // Query to retrieve matching friends
    const usersSnap = await getDocs(friendsQuery); // Execute the query

    // Map each user document to include the streak value
    return usersSnap.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        userId: doc.id,
        streak: streaks[data.userId] || 0,
      };
    });
  };

  // Search function to find users based on the input query
  const search = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // Query users whose nameSearch field matches the input
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("nameSearch", ">=", trimmed.toLowerCase()),
        where("nameSearch", "<=", trimmed.toLowerCase() + "\uf8ff")
      );
      const snapshot = await getDocs(q);
      const users = snapshot.docs
        .map((doc) => doc.data())
        .filter((user) => user.userId !== currentUser?.uid); // Exclude self

      // Get current user's existing friendships
      const friendshipsRef = collection(db, "friendships");
      const friendshipsSnap = await getDocs(
        query(
          friendshipsRef,
          where("participants", "array-contains", currentUser?.uid)
        )
      );

      // Extract already connected user IDs
      const connectedUserIds = friendshipsSnap.docs.map((doc) =>
        doc.data().participants.find((id: string) => id !== currentUser?.uid)
      );

      // Filter out already connected users
      const filtered = users.filter(
        (user) => !connectedUserIds.includes(user.userId)
      );

      setResults(filtered);
    } catch (err) {
      console.error("Search error:", err);
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Send a friend request to a user
  const sendFriendRequest = async (userId: string) => {
    if (!currentUser) return;

    try {
      // Create a new friendship document with pending status
      await addDoc(collection(db, "friendships"), {
        participants: [currentUser.uid, userId],
        status: "pending",
        requesterId: currentUser.uid,
        createdAt: new Date(),
      });

      // Create a notification for the recipient
      await addDoc(collection(db, "notifications"), {
        userId,
        type: "friendRequest",
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        senderAvatar: currentUser.photoURL,
        read: false,
        createdAt: new Date(),
      });

      // Reset search UI and show success alert
      Alert.alert("Success", "Friend request sent!");
      setSearchQuery("");
      setResults([]);
    } catch (err) {
      console.error("Friend request error:", err);
      Alert.alert("Error", "Could not send friend request.");
    }
  };

  // Remove a friend from the current user's friends list
  const removeFriend = async (friendId: string) => {
    if (!currentUser) return;

    try {
      // Query to retrieve all friendship documents involving the current user
      const friendshipsRef = collection(db, "friendships");
      const q = query(
        friendshipsRef,
        where("participants", "array-contains", currentUser.uid)
      );
      const snapshot = await getDocs(q);

      // Find the specific accepted friendship document with the given friendId
      const friendDoc = snapshot.docs.find((doc) => {
        const data = doc.data();
        return (
          data.status === "accepted" &&
          data.participants.includes(friendId) &&
          data.participants.includes(currentUser.uid)
        );
      });

      // Delete the friendship document if found
      if (friendDoc) {
        await deleteDoc(doc(db, "friendships", friendDoc.id));
        Alert.alert("Removed", "Friend has been removed.");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      Alert.alert("Error", "Could not remove friend.");
    }
  };

  // Main useEffect to handle real-time updates for friendships and posts
  useEffect(() => {
    if (!currentUser) return;

    // Unsubscribe function for posts listener
    let unsubscribePosts: (() => void) | null = null;

    // Listen for real-time updates to the current user's friendships
    const unsubscribeFriendships = onSnapshot(
      getFriendshipsQuery(currentUser.uid),
      async (snapshot) => {
        try {
          // Step 1: Extract friend IDs from the snapshot
          const friendIds = extractFriendIds(snapshot, currentUser.uid);

          // Step 2: Include current user and friends to fetch their posts
          const postUserIds = [...friendIds, currentUser.uid];

          // Step 3: Unsubscribe from previous post listener to avoid duplicates
          if (unsubscribePosts) unsubscribePosts();

          // Step 4: Listen for real-time updates to posts made by the user and their friends
          unsubscribePosts = onSnapshot(
            getPostsQuery(postUserIds),
            async (postsSnap) => {
              try {
                // Step 5: Process posts to get post counts and posting dates
                const { postCounts, userPosts } = processPosts(postsSnap);

                // Step 6: Calculate posting streaks for each user
                const streaks = calculateStreaks(userPosts);

                // Step 7: Fetch user data for friends and attach streaks
                const friendsList = await fetchFriendsList(friendIds, streaks);

                // Step 8: Sort friends by streak and update state
                setFriends(sortByStreak(friendsList));

                // Step 9: Build leaderboard with post counts and update state
                const leaderboardUsers = buildLeaderboard(
                  friendsList,
                  postCounts,
                  currentUser
                );
                setLeaderboard(leaderboardUsers);
              } catch (postErr) {
                console.error("Posts error:", postErr);
              }
            },
            console.error
          );
        } catch (friendErr) {
          console.error("Friendships error:", friendErr);
        }
      },
      console.error
    );

    // Cleanup listeners
    return () => {
      unsubscribeFriendships();
      if (unsubscribePosts) unsubscribePosts();
    };
  }, [currentUser]);

  // Render the Friends Screen
  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <FlatList
        // The top section includes search bar, search results, and friends list header
        ListHeaderComponent={
          <>
            {/* SEARCH BAR */}
            <View style={styles.searchBar}>
              <Ionicons
                name="search-outline"
                size={20}
                color={COLORS.mediumGrey}
              />
              <TextInput
                style={styles.input}
                placeholder="Search users..."
                placeholderTextColor={COLORS.mediumGrey}
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  search(text);
                }}
                returnKeyType="search"
              />
            </View>

            {/* SEARCH RESULTS */}
            {searchQuery.trim().length > 0 && (
              <View style={{ marginTop: 12 }}>
                <View style={styles.friendsHeader}>
                  <Ionicons
                    name="person-outline"
                    size={25}
                    color={COLORS.orange}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.resultsTitle}>Search Results</Text>
                </View>

                <FlatList
                  data={results}
                  keyExtractor={(item) => item.userId}
                  scrollEnabled={false}
                  contentContainerStyle={styles.list}
                  ListEmptyComponent={
                    !loading ? (
                      <Text style={styles.emptyText}>No users found</Text>
                    ) : null
                  }
                  renderItem={({ item }) => (
                    <View style={styles.card}>
                      <View style={styles.left}>
                        <Image
                          source={{ uri: item.avatarUrl }}
                          style={styles.avatar}
                        />
                        <Text style={styles.name}>{item.name}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => sendFriendRequest(item.userId)}
                      >
                        <Ionicons
                          name="person-add-outline"
                          size={20}
                          color={COLORS.white}
                          testID="add-friend-button"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            )}

            {/* FRIENDS SECTION */}
            <View style={{ marginTop: 24 }}>
              <View style={styles.friendsHeader}>
                <Ionicons
                  name="people-outline"
                  size={25}
                  color={COLORS.orange}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.friendsTitle}>Your Friends</Text>
              </View>
            </View>
          </>
        }
        data={friends}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.left}>
              <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
              <Text style={styles.name}>{item.name}</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                columnGap: 8,
              }}
            >
              {/* Show streak icon only if streak > 0 */}
              {item.streak > 0 && (
                <View style={styles.streak}>
                  <Ionicons name="flame" size={20} color={COLORS.orange} />
                  <Text style={styles.streakText}>{item.streak}</Text>
                </View>
              )}

              <TouchableOpacity
                onPress={() => removeFriend(item.userId)}
                style={styles.removeButton}
              >
                <Ionicons
                  name="person-remove-outline"
                  size={20}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No friends yet</Text>
        }
        // LEADERBOARD SECTION
        ListFooterComponent={
          <>
            <View style={{ marginTop: 32 }}>
              <View style={styles.friendsHeader}>
                <Ionicons
                  name="trophy-outline"
                  size={25}
                  color={COLORS.orange}
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.friendsTitle}>Leaderboard</Text>
              </View>

              <FlatList
                data={leaderboard}
                keyExtractor={(item) => item.userId}
                scrollEnabled={false}
                contentContainerStyle={styles.list}
                renderItem={({ item, index }) => (
                  <View
                    style={[
                      styles.card,
                      item.isCurrentUser && styles.currentUserHighlight,
                    ]}
                  >
                    <View style={styles.left}>
                      <Text
                        style={{
                          marginRight: 8,
                          fontWeight: "600",
                          color: item.isCurrentUser
                            ? COLORS.orange
                            : COLORS.black,
                        }}
                      >
                        #{index + 1}
                      </Text>
                      <Image
                        source={{ uri: item.avatarUrl }}
                        style={styles.avatar}
                      />
                      <Text
                        style={[
                          styles.name,
                          item.isCurrentUser && { color: COLORS.orange },
                        ]}
                      >
                        {item.name}
                      </Text>
                    </View>
                    <Text style={styles.postCount}>
                      🧑‍🍳 {item.postCount} posts
                    </Text>
                  </View>
                )}
              />
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
}
