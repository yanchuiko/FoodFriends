/**
 * AUTH MODAL
 *
 * Reusable input component for authentication screens (Login & Register).
 * Accepts a label and optional error message, and renders a styled TextInput.
 *
 * Features:
 * - Customizable TextInput with forwarded props
 * - Label display above input field
 * - Error message display below input field
 *
 **/

import { TextInput, TextInputProps, View, Text } from "react-native"; // React Native components
import { COLORS } from "@/styles/colors"; // Color constants
import { styles } from "@/styles/components/authModalStyles"; // Styles

// Props for the AuthModal component
interface AuthModalProps extends TextInputProps {
  label: string; // Field label (e.g. "Email", "Password")
  error?: string; // Optional error message
}

export function AuthModal({ label, error, ...props }: AuthModalProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null, props.style]}
        placeholderTextColor={COLORS.mediumGrey}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}
