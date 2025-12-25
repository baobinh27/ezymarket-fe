import { StyleSheet } from "react-native";

const dictionaryStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#EEEEEE",
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: "#82CD47",
  },
  searchBarContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
    alignItems: "center",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#000000B4",
  },
  filterIcon: {
    padding: 4,
  },
  newButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 80,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default dictionaryStyles;

