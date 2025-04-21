import { StyleSheet } from "react-native";
import { COLORS } from "@/styles/colors";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "50%",
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.softGrey,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.black,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGrey,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollArea: {
    flex: 1,
  },
  empty: {
    textAlign: "center",
    color: COLORS.darkGrey,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  commentsList: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  commentBubble: {
    flex: 1,
    backgroundColor: COLORS.softGrey,
    borderRadius: 16,
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.black,
    padding: 10,
  },
  name: {
    fontWeight: "600",
    fontSize: 15,
    color: COLORS.black,
  },
  text: {
    fontSize: 15,
    color: COLORS.black,
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.mediumGrey,
    marginTop: 6,
    textAlign: "right",
  },
  inputWrapper: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.mediumGrey,
    padding: 12,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
  },
  sendBtn: {
    backgroundColor: COLORS.orange,
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
});
