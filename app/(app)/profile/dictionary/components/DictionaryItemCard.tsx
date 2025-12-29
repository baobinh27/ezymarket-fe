import { Octicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Modal, Pressable, TouchableOpacity, View } from "react-native";

import { IText, ItemImage } from "@/components/styled";
import dictionaryItemStyles from "../dictionary-item.styles";
import DictionaryItemMenu from "./DictionaryItemMenu";

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
  tags?: Array<{ _id: string; name: string } | string>;
  ingredientsCount?: number;
}

export type DictionaryItemCardProps = IngredientCardProps | RecipeCardProps;

export default function DictionaryItemCard(props: DictionaryItemCardProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<View>(null);
  const { id, type, isSystem, onEdit, onHide, onClone } = props;

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

    const { icon, name, description, tags, ingredientsCount } = props;
    
    const validTags = (tags ?? [])
      .filter((tag) => {
        if (typeof tag === "string" || !tag?._id) return false;
        const nameStr = tag.name ?? "";
        return !(nameStr.length === 24 && /^[0-9a-fA-F]{24}$/.test(nameStr));
      })
      .slice(0, 3);

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
            <IText size={12} color="#000000B4" numberOfLines={2} style={{ marginTop: 4 }}>
              {description}
            </IText>
          )}
          {(validTags.length > 0 || ingredientsCount) && (
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
              {validTags.length > 0 && (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
                  {validTags.map((tag, idx) => {
                    const tagName = typeof tag === "object" ? tag.name : tag;
                    return (
                      <View
                        key={typeof tag === "object" ? tag._id : idx}
                        style={{
                          backgroundColor: "#F0F0F0",
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 4,
                        }}
                      >
                        <IText size={10} color="#000000B4">
                          {tagName}
                        </IText>
                      </View>
                    );
                  })}
                </View>
              )}
              {ingredientsCount !== undefined && ingredientsCount > 0 && (
                <View
                  style={{
                    backgroundColor: "#E8F5E9",
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 4,
                  }}
                >
                  <IText size={10} color="#46982D">
                    {ingredientsCount} ingredients
                  </IText>
                </View>
              )}
            </View>
          )}
        </View>
      </>
    );
  };

  return (
    <>
      <View style={dictionaryItemStyles.itemCard}>
        <View style={dictionaryItemStyles.itemLeft}>{renderContent()}</View>

        {!isSystem && (onEdit || onHide || onClone) && (
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
