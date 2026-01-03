import { ItemImage, IText } from "@/components/styled";
import { ShoppingItem } from "@/types/types";
import { View } from "react-native";


export default function RemoveItemCard({ item }: { item: ShoppingItem }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        gap: 10,
        backgroundColor: "#00000080",
        borderRadius: 10
      }}
    >
      <ItemImage
        src={item.ingredientId?.imageURL}
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          backgroundColor: "grey"
        }}
      />
      <View style={{ flex: 1 }}>
        <IText bold size={14} >
          {item.name}
        </IText>
        <IText size={12}>
          {item.quantity} {item.unit}
        </IText>
      </View>
    </View>
  );
}
