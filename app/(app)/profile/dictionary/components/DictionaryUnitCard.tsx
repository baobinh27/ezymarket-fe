import { useState, useRef } from "react";
import { View, TouchableOpacity, Pressable, Modal, StyleSheet } from "react-native";
import { Octicons } from "@expo/vector-icons";

import { IText } from "@/components/styled";
import DictionaryItemMenu from "./DictionaryItemMenu";

interface DictionaryUnitCardProps {
  id: string;
  name: string;
  abbreviation?: string;
  type?: string;
  isSystem?: boolean;
  onEdit?: () => void;
  onHide?: () => void;
  onClone?: () => void;
}

export default function DictionaryUnitCard({
  id,
  name,
  abbreviation,
  type,
  isSystem,
  onEdit,
  onHide,
  onClone,
}: DictionaryUnitCardProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<View>(null);

  const handleMenuClose = () => {
    setMenuVisible(false);
  };

  const handleMenuOpen = () => {
    buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setMenuPosition({
        top: pageY + height,
        right: 16,
      });
      setMenuVisible(true);
    });
  };

  return (
    <>
      <View style={styles.unitCard}>
        <View style={styles.unitLeft}>
          <IText size={16} bold>
            {name}
          </IText>
          <View style={styles.unitDetails}>
            {abbreviation && (
              <IText size={12} color="#000000B4">
                {abbreviation}
              </IText>
            )}
            {type && abbreviation && (
              <IText size={12} color="#000000B4"> • </IText>
            )}
            {type && (
              <IText size={12} color="#000000B4">
                {type}
              </IText>
            )}
          </View>
        </View>

        <View ref={buttonRef} collapsable={false}>
          <TouchableOpacity onPress={handleMenuOpen} style={styles.menuButton}>
            <Octicons name="kebab-horizontal" size={20} color="#000000B4" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={handleMenuClose}
      >
        <Pressable style={styles.modalOverlay} onPress={handleMenuClose}>
          <View
            style={[
              styles.menuPositioned,
              {
                position: "absolute",
                top: menuPosition.top,
                right: menuPosition.right,
              },
            ]}
          >
            <DictionaryItemMenu
              id={id}
              type="unit"
              onClose={handleMenuClose}
              onEdit={() => {
                handleMenuClose();
                onEdit?.();
              }}
              onHide={() => {
                handleMenuClose();
                onHide?.();
              }}
              onClone={() => {
                handleMenuClose();
                onClone?.();
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

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
