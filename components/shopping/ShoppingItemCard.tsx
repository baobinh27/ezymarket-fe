
import { ShoppingItem } from "@/types/types";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { TouchableOpacity, View } from "react-native";
import { ItemCard, ItemImage, IText } from "../styled";

interface ShoppingItemProps {
  item: ShoppingItem;
  onToggle?: (itemId: string) => void;
  onDelete?: (itemId: string) => void;
}


export const ShoppingItemCard: React.FC<ShoppingItemProps> = ({
  item,
  onToggle,
  onDelete
}) => {
  return (
    <ItemCard >
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12
      }}>
        <ItemImage src={item.ingredientId?.imageURL} />
        <IText
          semiBold
          style={{
            textDecorationLine: item.isPurchased ? 'line-through' : 'none',
            color: item.isPurchased ? '#9CA3AF' : undefined
          }}
        >
          {item.name}
        </IText>
      </View>

      <View style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10
      }}>
        <IText size={11}>{`${item.quantity} ${item.unit}`}</IText>
        <TouchableOpacity onPress={() => onToggle?.(item._id || "")}>
          <View style={{ backgroundColor: "white", borderRadius: 5, padding: 2 }}>
            <MaterialCommunityIcons name={item.isPurchased ? "checkbox-marked-outline" : "checkbox-blank-outline"} size={26} color="black" />
          </View>
        </TouchableOpacity>
      </View>
    </ItemCard>
  )
}