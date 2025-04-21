/**
 * LOADING SCREEN
 *
 * This screen is used as a loading indicator during app transitions.
 * It shows a centered orange spinner while the app performs async tasks.
 *
 * Usage:
 * - Can be used during auth state check, data fetching, or app transitions.
 *
 */

import { View, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS } from "@/styles/colors";

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.orange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
});
