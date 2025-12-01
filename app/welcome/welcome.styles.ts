import { StyleSheet } from "react-native";

export const welcomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6FFF4",
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  content: {
    alignItems: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 40,
  },
  logoWrapper: {
    width: 180,
    height: 180,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 48,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
  },
  dotActive: {
    width: 16,
    backgroundColor: "#82CD47",
  },
  footer: {
    alignItems: "center",
  },
  primaryButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 24,
    backgroundColor: "#82CD47",
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  skipWrapper: {
    paddingVertical: 4,
  },
  skipText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});


