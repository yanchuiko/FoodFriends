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
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.black,
  },
  logoIcon: {
    width: 38,
    height: 38,
  },
  welcomeText: {
    fontSize: 17,
    color: COLORS.darkGrey,
    textAlign: "center",
    fontWeight: "500",
  },
  formContainer: {
    width: "95%",
    maxWidth: 400,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 15,
    borderWidth: 1,
    borderColor: COLORS.black,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatarSection: {
    marginBottom: 16,
    alignItems: "center",
  },
  avatarButton: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.orange,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.black,
    overflow: "hidden",
  },
  button: {
    backgroundColor: COLORS.orange,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginTop: 24,
    borderWidth: 1,
    borderColor: COLORS.black,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  linkButton: {
    marginTop: 16,
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
  error: {
    color: COLORS.red,
    marginBottom: 16,
    textAlign: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
});
