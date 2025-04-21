import { StyleSheet } from "react-native";
import { COLORS } from "@/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: COLORS.black,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  messagePreview: {
    fontSize: 14,
    color: COLORS.darkGrey,
  },
  unreadBadge: {
    backgroundColor: COLORS.orange,
    borderRadius: 15,
    minWidth: 30,
    minHeight: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadCount: {
    fontWeight: "600",
    fontSize: 16,
    color: COLORS.white,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: COLORS.mediumGrey,
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.darkGrey,
    marginTop: 2,
  },
});
