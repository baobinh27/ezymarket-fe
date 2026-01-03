import { ItemImage, IText } from "@/components/styled";
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
        backgroundColor: isPurchased ? "#808080" : "#F5F5F5",
        borderRadius: 10,
      }}
    >
      <ItemImage
        src="https://imgs.search.brave.com/ZyTalHbd6ylc6QNmPc_567ZkdaIA2fOjPirg0xv5rNY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAxNi8w/NS9DYWJiYWdlLUZy/ZWUtUE5HLUltYWdl/LnBuZw" 
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
