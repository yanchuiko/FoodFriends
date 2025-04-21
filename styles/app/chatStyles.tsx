import { StyleSheet } from "react-native";
import { COLORS } from "@/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.softGrey,
    backgroundColor: COLORS.white,
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.black,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  messageItem: {
    marginBottom: 12,
    flexDirection: "row",
  },
  messageLeft: {
    alignSelf: "flex-start",
  },
  messageRight: {
    alignSelf: "flex-end",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  bubble: {
    maxWidth: "80%",
    padding: 10,
    borderRadius: 16,
  },
  bubbleLeft: {
    backgroundColor: COLORS.softGrey,
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  bubbleRight: {
    backgroundColor: COLORS.orange,
    borderTopRightRadius: 0,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.black,
    marginTop: 4,
    textAlign: "right",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.mediumGrey,
    backgroundColor: COLORS.white,
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
