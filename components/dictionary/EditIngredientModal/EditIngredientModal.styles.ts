import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  centerContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  imageSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#EEEEEE",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  imagePlaceholderContent: {
    alignItems: "center",
    gap: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    textAlign: "center",
  },
  orText: {
    marginVertical: 8,
  },
  searchButton: {
    borderWidth: 1,
    borderColor: "#82CD47",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  formSection: {
    gap: 20,
    marginBottom: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: "#000000",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#000000",
  },
  expiryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  expiryInput: {
    flex: 1,
  },
  categoryInputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryPickerContainer: {
    maxHeight: 200,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  categoryOptionSelected: {
    backgroundColor: "#E8F5E0",
  },
  actionButtons: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  saveButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
  },
});

export default styles;
