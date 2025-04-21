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
    height: 400,
    paddingBottom: 16,
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
  sectionTitleLikes: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: COLORS.black,
  },
  sectionTitleComments: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 20,
    color: COLORS.black,
  },
  emptyTextLikes: {
    color: COLORS.mediumGrey,
    fontSize: 15,
    marginVertical: 12,
    textAlign: "center",
  },
  emptyTextComments: {
    color: COLORS.mediumGrey,
    fontSize: 15,
    marginVertical: 12,
    textAlign: "center",
    marginTop: 70,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.black,
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
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
});
