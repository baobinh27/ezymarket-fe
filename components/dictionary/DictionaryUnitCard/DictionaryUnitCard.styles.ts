import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  unitCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  unitCardHidden: {
    opacity: 0.4,
  },
  unitLeft: {
    flex: 1,
    gap: 4,
  },
  unitDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  menuButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  menuPositioned: {
    minWidth: 150,
  },
});

export default styles;
