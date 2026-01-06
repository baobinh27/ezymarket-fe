import { Octicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";

import { IText, ItemCard } from "@/components/styled";
import DictionaryItemMenu from "../DictionaryItemMenu/DictionaryItemMenu";
import styles from "./DictionaryUnitCard.styles";

interface DictionaryUnitCardProps {
  id: string;
  name: string;
  abbreviation?: string;
  type?: string;
  isSystem?: boolean;
  isHidden?: boolean;
  onEdit?: () => void;
  onHide?: () => void;
  onShow?: () => void;
  onClone?: () => void;
}

export default function DictionaryUnitCard({
  id,
  name,
  abbreviation,
  type,
  isSystem,
  isHidden,
  onEdit,
  onHide,
  onShow,
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
      <ItemCard style={isHidden && styles.unitCardHidden}>
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
              <IText size={12} color="#000000B4">
                {" "}
                •{" "}
              </IText>
            )}
            {type && (
              <IText size={12} color="#000000B4">
                {type}
              </IText>
            )}
          </View>
        </View>

        {!isSystem && (onEdit || onHide || onClone) && (
          <View ref={buttonRef} collapsable={false}>
            <TouchableOpacity onPress={handleMenuOpen} style={styles.menuButton}>
              <Octicons name="kebab-horizontal" size={20} color="#000000B4" />
            </TouchableOpacity>
          </View>
        )}
      </ItemCard>

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
              isHidden={isHidden}
              onClose={handleMenuClose}
              onEdit={() => {
                handleMenuClose();
                onEdit?.();
              }}
              onHide={() => {
                handleMenuClose();
                onHide?.();
              }}
              onShow={() => {
                handleMenuClose();
                onShow?.();
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
