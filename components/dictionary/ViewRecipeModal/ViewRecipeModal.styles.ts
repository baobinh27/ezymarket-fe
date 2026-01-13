import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 20,
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
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerSection: {
    gap: 8,
  },
  description: {
    marginTop: 4,
    lineHeight: 20,
  },
  metaSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E5E5",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  tagsSection: {
    gap: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  ingredientsList: {
    gap: 8,
  },
  ingredientItem: {
    paddingLeft: 8,
  },
  directionsList: {
    gap: 12,
  },
  directionItem: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#46982D",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  stepText: {
    flex: 1,
    lineHeight: 20,
  },
  buttonSection: {
    marginTop: 8,
    marginBottom: 16,
  },
  editButton: {
    paddingVertical: 12,
    borderRadius: 8,
  },
});

export default styles;
