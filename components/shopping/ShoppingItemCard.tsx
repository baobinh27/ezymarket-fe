
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
        alignItems: "center"
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

<View
  style={{
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  }}
>
  <IText size={11}>2 pieces</IText>
  {item.purchased ? (
    <View style={{ backgroundColor: "white", borderRadius: 5, padding: 4 }}>
      <Octicons size={28} name={"checkbox"} color="#46982D" />
    </View>
  ) : (
    <Image
      source={require("@/assets/images/emptybox.png")}
      style={{
        width: 36,
        height: 36,
        padding: 6,
        backgroundColor: "white",
        borderRadius: 5,
      }}
    />
  )}
</View>
    </ItemCard >
  );
};
