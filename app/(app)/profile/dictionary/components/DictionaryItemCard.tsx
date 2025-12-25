import { useState, useRef } from "react";
import { View, TouchableOpacity, Pressable, Modal, StyleSheet } from "react-native";
import { Octicons } from "@expo/vector-icons";

import { IText, ItemImage } from "@/components/styled";
import DictionaryItemMenu from "./DictionaryItemMenu";
import dictionaryItemStyles from "../dictionary-item.styles";

export type DictionaryItemType = "ingredient" | "recipe";

interface BaseDictionaryItemCardProps {
  id: string;
  type: DictionaryItemType;
  isSystem?: boolean;
  onEdit?: () => void;
  onHide?: () => void;
  onClone?: () => void;
}

interface IngredientCardProps extends BaseDictionaryItemCardProps {
  type: "ingredient";
  icon?: string;
  name: string;
  unit?: string;
  expiryDuration?: string;
}

interface RecipeCardProps extends BaseDictionaryItemCardProps {
  type: "recipe";
  icon?: string;
  name: string;
  description?: string;
}

export type DictionaryItemCardProps = IngredientCardProps | RecipeCardProps;

export default function DictionaryItemCard(props: DictionaryItemCardProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<View>(null);
  const { id, type, isSystem, onEdit, onHide, onClone } = props;

  const handleMenuClose = () => {
    console.log("🔴 Closing menu for:", type, id);
    setMenuVisible(false);
  };

  const handleMenuOpen = () => {
    console.log("🟢 Opening menu for:", type, id);
    buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setMenuPosition({
        top: pageY + height,
        right: 16, // Distance from right edge
      });
      setMenuVisible(true);
    });
  };

  const renderContent = () => {
    if (type === "ingredient") {
      const { icon, name, unit, expiryDuration } = props;
      return (
        <>
          {icon ? (
            <ItemImage source={{ uri: icon }} />
          ) : (
            <View style={dictionaryItemStyles.iconPlaceholder}>
              <Octicons name="package" size={20} color="#000000B4" />
            </View>
          )}
          <View style={dictionaryItemStyles.itemInfo}>
            <IText size={16} bold>
              {name}
            </IText>
            {unit && (
              <IText size={12} color="#000000B4">
                Unit: {unit}
              </IText>
            )}
            {expiryDuration && (
              <IText size={12} color="#000000B4">
                Expiry duration: {expiryDuration}
              </IText>
            )}
          </View>
        </>
      );
    }

    // type === "recipe"
    const { icon, name, description } = props;
    return (
      <>
        {icon ? (
          <ItemImage source={{ uri: icon }} />
        ) : (
          <View style={dictionaryItemStyles.iconPlaceholder}>
            <Octicons name="book" size={20} color="#000000B4" />
          </View>
        )}
        <View style={dictionaryItemStyles.itemInfo}>
          <IText size={16} bold>
            {name}
          </IText>
          {description && (
            <IText size={12} color="#000000B4" numberOfLines={2}>
              {description}
            </IText>
          )}
        </View>
      </>
    );
  };

  return (
    <>
      <View style={dictionaryItemStyles.itemCard}>
        <View style={dictionaryItemStyles.itemLeft}>{renderContent()}</View>

        {!isSystem && (
          <View ref={buttonRef} collapsable={false}>
            <TouchableOpacity
              onPress={handleMenuOpen}
              style={dictionaryItemStyles.menuButton}
            >
              <Octicons name="kebab-horizontal" size={20} color="#000000B4" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={handleMenuClose}
      >
        <Pressable
          style={dictionaryItemStyles.modalOverlay}
          onPress={handleMenuClose}
        >
          <View
            style={[
              dictionaryItemStyles.menuPositioned,
              {
                position: "absolute",
                top: menuPosition.top,
                right: menuPosition.right,
              },
            ]}
          >
            <DictionaryItemMenu
              id={id}
              type={type}
              onClose={handleMenuClose}
              onEdit={() => {
                console.log("📝 Edit clicked for:", type, id);
                handleMenuClose();
                onEdit?.();
              }}
              onHide={() => {
                console.log("👁️ Hide clicked for:", type, id);
                handleMenuClose();
                onHide?.();
              }}
              onClone={() => {
                console.log("📋 Clone clicked for:", type, id);
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
