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
    marginBottom: 80,
    fontSize: 16,
  },
  item: {
    flexDirection: "row",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.mediumGrey,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  body: {
    flex: 1,
  },
  message: {
    fontSize: 15,
    lineHeight: 20,
  },
  name: {
    fontWeight: "600",
  },
  time: {
    fontSize: 13,
    color: COLORS.darkGrey,
    marginVertical: 6,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  acceptBtn: {
    backgroundColor: COLORS.green,
  },
  acceptText: {
    color: COLORS.white,
    fontWeight: "600",
  },
  acceptedIconBtn: {
    backgroundColor: COLORS.green,
  },
  declineBtn: {
    backgroundColor: COLORS.red,
  },
  declineText: {
    color: COLORS.white,
    fontWeight: "600",
  },
  declinedIconBtn: {
    backgroundColor: COLORS.red,
  },
  statusBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    maxWidth: 110,
  },
  statusText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
});
