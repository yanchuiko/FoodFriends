import { StyleSheet } from "react-native";
import { COLORS } from "@/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  cardWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.white,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.black,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.darkGrey,
    textAlign: "center",
    maxWidth: 300,
  },
});
