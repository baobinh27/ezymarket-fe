import { ItemImageWithFallback, IText } from "@/components/styled";
import { View } from "react-native";

interface SavedItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  cost?: string;
  imageUrl?: string;
}

interface SavedShoppingItemCardProps {
  item: SavedItem;
  isPurchased?: boolean;
}

export default function SavedShoppingItemCard({ item, isPurchased }: SavedShoppingItemCardProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        gap: 10,
        backgroundColor: !isPurchased ? "#808080" : "#F5F5F5",
        borderRadius: 10,
      }}
    >
      <ItemImageWithFallback
        src={item.imageUrl}
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
        }}
      />
      <View style={{ flex: 1 }}>
        <IText bold size={16} >
          {item.name}
        </IText>
        <IText size={12} >
          {item.quantity} {item.unit}
        </IText>
      </View>
      {item.cost && (
        <IText size={13} >
          {item.cost}
        </IText>
      )}
    </View>
  );
}
