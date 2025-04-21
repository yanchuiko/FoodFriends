import { StyleSheet } from "react-native";
import { COLORS } from "@/styles/colors";

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: COLORS.darkGrey,
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.black,
  },
  inputError: {
    borderColor: COLORS.red,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    marginTop: 4,
  },
});
