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
    maxHeight: "74%",
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
  scroll: {
    maxHeight: "100%",
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    color: COLORS.darkGrey,
    marginTop: 50,
    marginBottom: 50,
    fontSize: 16,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLORS.lightGrey,
    marginBottom: 8,
  },
  friendSelected: {
    backgroundColor: COLORS.orange,
    borderRadius: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.black,
  },
  createButton: {
    backgroundColor: COLORS.orange,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 40,
    borderWidth: 1,
    borderColor: COLORS.black,
    marginHorizontal: 16,
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  checkmark: {
    position: "absolute",
    right: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
