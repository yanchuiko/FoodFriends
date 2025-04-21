import { StyleSheet } from "react-native";
import { COLORS } from "@/styles/colors";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 42,
    fontWeight: "700",
    color: COLORS.black,
  },
  logoIcon: {
    width: 45,
    height: 45,
  },
  welcomeText: {
    fontSize: 20,
    color: COLORS.darkGrey,
    textAlign: "center",
    fontWeight: "500",
  },
  formContainer: {
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 5,
  },
  error: {
    color: COLORS.red,
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: COLORS.orange,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    alignItems: "center",
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: COLORS.darkGrey,
    fontSize: 15,
  },
  linkTextBold: {
    color: COLORS.orange,
    fontWeight: "600",
  },
});
