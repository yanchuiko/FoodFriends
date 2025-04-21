/**
 * TAB NAVIGATION LAYOUT
 *
 * This file configures the layout and behavior of the bottom tab navigator
 * for the main app screens using Expo Router and React Navigation.
 *
 * Each tab represents a core screen in the app:
 * - Home (Feed)
 * - Friends
 * - Post
 * - Messages
 * - Profile
 *
 */

import React from "react"; // React library
import { View, Text, Image } from "react-native"; // React Native components
import { Tabs } from "expo-router"; // Tab navigator from Expo Router
import { Ionicons } from "@expo/vector-icons"; // Icons
import { COLORS } from "@/styles/colors"; // Color constants

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false, // Hide default tab labels
        tabBarActiveTintColor: COLORS.orange, // Active icon color
        tabBarInactiveTintColor: COLORS.black, // Inactive icon color
        tabBarStyle: {
          height: 80, // Increased height for better spacing
        },
        tabBarIconStyle: {
          marginTop: 5, // Slight margin for vertical alignment
        },
      }}
    >
      {/* Home (Feed) Tab */}
      <Tabs.Screen
        name="index"
        options={{
          headerTitleAlign: "center",
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ fontSize: 24, fontWeight: "bold", marginRight: 8 }}
              >
                FoodFriends
              </Text>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/11929/11929988.png",
                }}
                style={{ width: 28, height: 28 }}
              />
            </View>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={30} color={color} />
          ),
        }}
      />

      {/* Friends Tab */}
      <Tabs.Screen
        name="friends"
        options={{
          headerTitleAlign: "center",
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ fontSize: 24, fontWeight: "bold", marginRight: 8 }}
              >
                Friends
              </Text>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/11929/11929988.png",
                }}
                style={{ width: 28, height: 28 }}
              />
            </View>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={30} color={color} />
          ),
        }}
      />

      {/* Post Tab */}
      <Tabs.Screen
        name="post"
        options={{
          headerTitleAlign: "center",
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ fontSize: 24, fontWeight: "bold", marginRight: 8 }}
              >
                Post
              </Text>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/11929/11929988.png",
                }}
                style={{ width: 28, height: 28 }}
              />
            </View>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle" size={30} color={color} />
          ),
        }}
      />

      {/* Messages Tab */}
      <Tabs.Screen
        name="messages"
        options={{
          headerTitleAlign: "center",
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ fontSize: 24, fontWeight: "bold", marginRight: 8 }}
              >
                Messages
              </Text>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/11929/11929988.png",
                }}
                style={{ width: 28, height: 28 }}
              />
            </View>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles" size={30} color={color} />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          headerTitleAlign: "center",
          headerTitle: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ fontSize: 24, fontWeight: "bold", marginRight: 8 }}
              >
                Profile
              </Text>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/11929/11929988.png",
                }}
                style={{ width: 28, height: 28 }}
              />
            </View>
          ),
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={30} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
