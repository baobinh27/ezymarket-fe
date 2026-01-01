import { StyleSheet } from "react-native";

const dictionaryItemStyles = StyleSheet.create({
  container: {
    gap: 12,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  itemCardHidden: {
    opacity: 0.4,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconPlaceholder: {
    width: 36,
    height: 36,
    backgroundColor: "white",
    borderRadius: 5,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  menuButton: {
    padding: 8,
  },
  menuContainer: {
    position: "relative",
  },
  menuWrapper: {
    position: "absolute",
    top: 32,
    right: 0,
    zIndex: 1000,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalContent: {
    minWidth: 200,
  },
  menuPositioned: {
    minWidth: 150,
  },
});

export default dictionaryItemStyles;
