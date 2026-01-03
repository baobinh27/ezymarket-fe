import IButton from "@/components/IButton";
import { IText } from "@/components/styled";
import { MealType } from "@/types/types";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";

type ConfirmDeleteModalProps = {
  visible: boolean;
  itemName: string;
  mealType?: MealType;
  onCancel: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  visible,
  itemName,
  mealType,
  onCancel,
  onConfirm,
  isLoading = false,
}) => {
  const [itemNameText, setItemNameText] = useState<string | null>(null);
  const [mealTypeText, setMealTypeText] = useState<MealType | null>(null);

  useEffect(() => {
    if (visible) {
      setItemNameText(itemName);
      if (mealType !== undefined) setMealTypeText(mealType);
    }
  }, [visible, itemName, mealType]);
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel} />
      <View style={styles.container}>
        <View style={styles.content}>
          <IText size={18} semiBold style={styles.title}>
            Delete Item
          </IText>
          <IText size={14} style={styles.message}>
            Are you sure you want to delete{" "}
            <IText semiBold>{itemNameText}</IText>
            {!!mealTypeText && (
              <>
                {" "}
                from <IText semiBold>{mealTypeText}</IText>
              </>
            )}
            ?
          </IText>

          <IText size={12} style={styles.infoMessage}>
            The deleted item here will be re-added to your fridge.
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
              style={[styles.button, styles.confirmButton]}
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
  infoMessage: {
    backgroundColor: "#81cd4780",
    padding: 6,
    borderRadius: 6,
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
  confirmButton: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
});

export default ConfirmDeleteModal;
