import { Octicons } from "@expo/vector-icons";
import { Image, TouchableOpacity, View } from "react-native";
import { ItemCard, ItemImage, IText } from "../styled";

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  isPurchased: boolean;
}

interface ShoppingItemProps {
  item: ShoppingItem;
  onToggle?: (itemId: string) => void;
}


export const ShoppingItemCard: React.FC<ShoppingItemProps> = ({
  item,
  onToggle
}) => {
  return (
    <ItemCard >
      <View style={{
        flexDirection: "row",
        alignItems: "center"
      }}>
        <ItemImage src="https://imgs.search.brave.com/ZyTalHbd6ylc6QNmPc_567ZkdaIA2fOjPirg0xv5rNY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAxNi8w/NS9DYWJiYWdlLUZy/ZWUtUE5HLUltYWdl/LnBuZw" />
        <IText semiBold>{item.name}</IText>
      </View>

      <View style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10
      }}>
        <IText size={11}>{item.quantity} {item.unit}</IText>
        <TouchableOpacity onPress={() => onToggle?.(item.id)}>
          {item.isPurchased
            ? <View style={{ backgroundColor: "white", borderRadius: 5, padding: 4 }}>
              <Octicons size={28} name={"checkbox"} color="#46982D" />
            </View>
            : <Image
              source={require('@/assets/images/emptybox.png')}
              style={{
                width: 36,
                height: 36,
                padding: 6,
                backgroundColor: "white",
                borderRadius: 5
              }}
            />
          }
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
