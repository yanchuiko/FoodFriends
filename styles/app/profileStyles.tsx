import { StyleSheet } from "react-native";
import { COLORS } from "@/styles/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 40,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    borderWidth: 2,
    borderColor: COLORS.black,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.black,
  },
  streak: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.seashell,
    borderColor: COLORS.orange,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  streakText: {
    marginLeft: 4,
    color: COLORS.orange,
    fontWeight: "600",
    fontSize: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 16,
    gap: 32,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.black,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.darkGrey,
  },
  postsGrid: {
    padding: 0,
    margin: 0,
    justifyContent: "center",
  },
  postImage: {
    width: "100%",
    height: "100%",
    borderBottomWidth: 2,
    borderColor: COLORS.white,
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.mediumGrey,
    marginTop: 180,
    fontSize: 16,
  },
  postWrapper: {
    width: "33.33%",
    aspectRatio: 1,
  },
});
