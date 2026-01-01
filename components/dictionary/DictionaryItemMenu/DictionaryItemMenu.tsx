import React from "react";
import { TouchableOpacity, View } from "react-native";

import { IText } from "@/components/styled";
import dictionaryMenuStyles from "./dictionary-menu.styles";

interface DictionaryItemMenuProps {
  id: string;
  type: "ingredient" | "recipe" | "unit";
  isHidden?: boolean;
  onClose: () => void;
  onEdit: () => void;
  onHide: () => void;
  onShow?: () => void;
  onClone: () => void;
}

export default function DictionaryItemMenu({
  isHidden,
  onClose,
  onEdit,
  onHide,
  onShow,
  onClone,
}: DictionaryItemMenuProps) {
  const handleEdit = () => {
    onEdit();
    onClose();
  };

  const handleHideOrShow = () => {
    if (isHidden && onShow) {
      onShow();
    } else {
      onHide();
    }
    onClose();
  };

  const handleClone = () => {
    onClone();
    onClose();
  };

  return (
    <View style={dictionaryMenuStyles.menuContainer}>
      <TouchableOpacity style={dictionaryMenuStyles.menuItem} onPress={handleEdit}>
        <IText size={14} color="#000000B4">
          Edit
        </IText>
      </TouchableOpacity>
      <View style={dictionaryMenuStyles.separator} />
      <TouchableOpacity style={dictionaryMenuStyles.menuItem} onPress={handleHideOrShow}>
        <IText size={14} color="#000000B4">
          {isHidden ? "Show" : "Hide"}
        </IText>
      </TouchableOpacity>
      <View style={dictionaryMenuStyles.separator} />
      <TouchableOpacity style={dictionaryMenuStyles.menuItem} onPress={handleClone}>
        <IText size={14} color="#000000B4">
          Clone
        </IText>
      </TouchableOpacity>
    </View>
  );
}
