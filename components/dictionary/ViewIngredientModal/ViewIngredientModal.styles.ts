import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  imageSection: {
    alignItems: "center",
    marginBottom: 8,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  detailsSection: {
    gap: 16,
  },
  detailRow: {
    gap: 8,
  },
  label: {
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  buttonSection: {
    marginTop: 8,
  },
  editButton: {
    paddingVertical: 12,
    borderRadius: 8,
  },
});

export default styles;
