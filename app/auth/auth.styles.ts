import { StyleSheet } from "react-native";

const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  logoLarge: {
    width: 72,
    height: 72,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  subtitleMain: {
    fontSize: 14,
    fontWeight: "600",
    color: "#82CD47",
    textAlign: "center",
    marginBottom: 4,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  inputPasswordRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 8,
  },
  inputPassword: {
    flex: 1,
    paddingHorizontal: 6,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
  },
  passwordIconButton: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  inputCode: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    letterSpacing: 8,
    textAlign: "center",
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  otpInput: {
    width: 44,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    textAlign: "center",
    fontSize: 18,
    color: "#111827",
    backgroundColor: "#F9FAFB",
  },
  primaryButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: "#82CD47",
    alignItems: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  bottomText: {
    fontSize: 13,
    color: "#6B7280",
  },
  bottomLink: {
    fontSize: 13,
    color: "#82CD47",
    fontWeight: "600",
    marginLeft: 4,
  },
  forgotWrapper: {
    alignSelf: "flex-end",
    marginTop: 8,
  },
  forgotText: {
    fontSize: 12,
    color: "#82CD47",
  },
  backWrapper: {
    marginTop: 16,
    alignItems: "center",
  },
  backText: {
    fontSize: 13,
    color: "#82CD47",
    fontWeight: "500",
  },
});

export default authStyles;

