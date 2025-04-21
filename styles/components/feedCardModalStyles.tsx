import { StyleSheet } from "react-native";
import { COLORS } from "@/styles/colors";

export const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    padding: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  card: {
    backgroundColor: COLORS.lightOrange,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.black,
    width: "92%",
    overflow: "hidden",
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.black,
  },
  headerText: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
  },
  timestamp: {
    fontSize: 14,
    color: COLORS.black,
    marginTop: 2,
  },
  imageContainer: {
    paddingHorizontal: 16,
    height: 400,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.black,
  },
  caption: {
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  captionText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.black,
  },
  actions: {
    flexDirection: "row",
    height: 55,
  },
  actionButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1.5,
    borderColor: COLORS.black,
  },
  shareButton: {
    backgroundColor: COLORS.yellow,
    borderRightWidth: 1.5,
  },
  commentButton: {
    backgroundColor: COLORS.blue,
  },
  likeButton: {
    backgroundColor: COLORS.pink,
    borderLeftWidth: 1.5,
  },
});
