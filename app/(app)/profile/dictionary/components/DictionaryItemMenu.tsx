import { TouchableOpacity, View } from "react-native";

import { IText } from "@/components/styled";
import dictionaryMenuStyles from "./dictionary-menu.styles";

interface DictionaryItemMenuProps {
  id: string;
  type: "ingredient" | "recipe" | "unit";
  onClose: () => void;
  onEdit: () => void;
  onHide: () => void;
  onClone: () => void;
}

export default function DictionaryItemMenu({
  onClose,
  onEdit,
  onHide,
  onClone,
}: DictionaryItemMenuProps) {
  const handleEdit = () => {
    onEdit();
    onClose();
  };

  const handleHide = () => {
    onHide();
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
      <TouchableOpacity style={dictionaryMenuStyles.menuItem} onPress={handleHide}>
        <IText size={14} color="#000000B4">
          Hide
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

