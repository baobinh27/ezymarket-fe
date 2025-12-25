import { StyleSheet } from "react-native";

const dictionaryMenuStyles = StyleSheet.create({
  menuContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 8,
    minWidth: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginHorizontal: 8,
  },
});

export default dictionaryMenuStyles;

