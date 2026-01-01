import { FridgeItem } from "@/types/types";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import QuantitySelector from "../QuantitySelector";
import UnitSelector from "../UnitSelector";
import { ItemCard, ItemImage, IText } from "../styled";



export interface FridgeItemCardProps {
  item: FridgeItem;
  isEditing?: boolean;
  onQuantityChange?: (itemId: string, newQuantity: number) => void;
  onUnitChange?: (itemId: string, newUnit: string) => void;
  onDelete?: (itemId: string) => void;
  editQuantity?: number;
  toBeDeleted: boolean;
}

const FridgeItemCard: React.FC<FridgeItemCardProps> = ({
  item,
  isEditing = false,
  onQuantityChange,
  onUnitChange,
  onDelete,
  editQuantity,
  toBeDeleted,
}) => {
  const [selectedQuantity, setSelectedQuantity] = useState<number>(
    editQuantity || item.quantity
  );
  const expiryDate = new Date(item.expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const getExpiryStatusColor = () => {
    if (daysUntilExpiry < 0) return "#C41E3A"; // expired - red
    if (daysUntilExpiry <= 1) return "#ff7f35"; // expires today/tomorrow - orange
    if (daysUntilExpiry <= 3) return "#cf9d04"; // expires soon - yellow
    return "#000000B4"; // safe - green
  };

  const getExpiryText = () => {
    if (daysUntilExpiry < 0) return <strong>Expired</strong>;
    if (daysUntilExpiry === 0)
      return (
        <>
          Expires <strong>today</strong>
        </>
      );
    if (daysUntilExpiry === 1)
      return (
        <>
          Expires <strong>tomorrow</strong>
        </>
      );
    return (
      <>
        Expires in <strong>{daysUntilExpiry}</strong> days
      </>
    );
  };

  return (
    <ItemCard style={toBeDeleted && styles.cardToBeDeleted}>
      <View style={styles.leftContent}>
        <ItemImage
          source={
            item.foodId.imageURL
              ? { uri: item.foodId.imageURL }
              : require("@/assets/images/emptybox.png")
          }
        />
        {!isEditing ? (
          <View style={styles.infoContainer}>
            <View style={styles.groupInfoContainer}>
              <IText
                semiBold
                size={14}
                color="black"
                numberOfLines={1}
              >
                {item.foodId.name}
              </IText>

              <IText size={11} color="#000000B4">
                {item.quantity} {item.unitId.abbreviation}
              </IText>
            </View>

            <View style={styles.groupInfoContainer}>
              <IText size={11} color={getExpiryStatusColor()}>
                {getExpiryText()}
              </IText>

              <IText size={11} semiBold>
                {`Total \t\t ${item.price.toLocaleString("en-us")}`}đ
              </IText>
            </View>
          </View>
        ) : (
          <View style={styles.infoContainer}>
            <View style={styles.groupInfoContainer}>
              <IText
                semiBold
                size={14}
                color="black"
                numberOfLines={1}
              >
                {item.foodId.name}
              </IText>

              <View style={styles.editModeControls}>
                <QuantitySelector
                  state={selectedQuantity}
                  setState={setSelectedQuantity}
                />
                <View style={styles.unitSelectorContainer}>
                  <UnitSelector 
                    maxModalHeight="40%"
                    buttonStyle={styles.unitSelectButton}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      </View>

      {isEditing ? (
        <Pressable
          style={styles.deleteButton}
          onPress={() => {
            if (onDelete) {
              onDelete(item._id);
            }
            // Update quantity when done
            if (selectedQuantity !== item.quantity && onQuantityChange) {
              onQuantityChange(item._id, selectedQuantity);
            }
          }}
        >
          <FontAwesome6 name="trash" size={16} color="#C41E3A" />
        </Pressable>
      ) : (
        <View style={styles.rightContent}>
          {/* <View style={styles.badgeContainer}>
            <IText size={11} color="white">
              Total
            </IText>
            <IText
              size={12}
              semiBold
              color="white"
              style={{ marginTop: 2 }}
            >
              {item.quantity}
              {item.unitId.abbreviation}
            </IText>
          </View> */}
        </View>
      )}
    </ItemCard>
  );
};

const styles = StyleSheet.create({
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    gap: 4,
  },
  groupInfoContainer: {
    width: "50%",
  },
  editModeControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  unitSelectorContainer: {
    // marginTop: 4,
    marginLeft: 4
  },
  unitSelectButton: {
    width: 60,
    height: 20
  },
  rightContent: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  badgeContainer: {
    backgroundColor: "#82CD47",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: "center",
  },
  deleteButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cardToBeDeleted: {
    opacity: 0.5,
  },
});

export default FridgeItemCard;
