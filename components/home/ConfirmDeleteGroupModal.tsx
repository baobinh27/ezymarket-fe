import IButton from "@/components/IButton";
import { IText } from "@/components/styled";
import { Modal, Pressable, StyleSheet, View } from "react-native";

type ConfirmDeleteGroupModalProps = {
  visible: boolean;
  groupName: string;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

const ConfirmDeleteGroupModal: React.FC<ConfirmDeleteGroupModalProps> = ({
  visible,
  groupName,
  onCancel,
  onConfirm,
  isLoading = false,
}) => {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel} />
      <View style={styles.container}>
        <View style={styles.content}>
          <IText size={18} semiBold style={styles.title}>
            Delete Group
          </IText>
          <IText size={14} style={styles.message}>
            Are you sure you want to delete group <IText semiBold>{groupName}</IText>?
          </IText>
          <IText size={12} color="#FF6B6B" style={styles.warning}>
            This action cannot be undone. All members will lose access to this group.
          </IText>

          <View style={styles.buttonGroup}>
            <IButton
              variant="secondary"
              style={styles.button}
              onPress={onCancel}
              disabled={isLoading}
            >
              <IText semiBold color="#82CD47">
                Cancel
              </IText>
            </IButton>
            <IButton
              style={[styles.button, styles.deleteButton]}
              onPress={onConfirm}
              disabled={isLoading}
            >
              <IText semiBold color="#EF4444">
                {isLoading ? "Deleting..." : "Delete"}
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    flex: 1,
    alignSelf: "center",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: "100%",
  },
  content: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    gap: 16,
    width: "100%",
    maxWidth: 320,
  },
  title: {
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    color: "#666",
    lineHeight: 20,
  },
  warning: {
    textAlign: "center",
    backgroundColor: "#FFE5E5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
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
    borderWidth: 1,
    borderColor: "#82CD47",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
});

export default ConfirmDeleteGroupModal;
