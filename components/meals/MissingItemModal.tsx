import { IText } from "@/components/styled";
import { Modal, StyleSheet, View } from "react-native";
import IButton from "../IButton";

type MissingItemModalProps = {
  visible: boolean;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
};

const MissingItemModal = ({
  visible,
  itemName,
  onConfirm,
  onCancel,
  isLoading = false,
}: MissingItemModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <IText semiBold style={styles.title}>
            No Items Found
          </IText>
          <IText style={styles.message}>
            You don&apos;t have &quot;<strong>{itemName}</strong>&quot; in your fridge. Do you want to use it anyway?
          </IText>
          <View style={styles.buttonGroup}>
            <IButton
              variant="none"
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
              disabled={isLoading}
            >
              <IText semiBold color="#666">
                Cancel
              </IText>
            </IButton>
            <IButton
              variant="primary"
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
              disabled={isLoading}
            >
              <IText semiBold color="white">
                {isLoading ? "Using..." : "Use Anyway"}
              </IText>
            </IButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "85%",
    gap: 16,
  },
  title: {
    fontSize: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  confirmButton: {
    backgroundColor: "#22C55E",
  },
});

export default MissingItemModal;
