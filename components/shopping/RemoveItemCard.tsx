import { ItemImage, IText } from "@/components/styled";
import { View } from "react-native";

interface RemoveItemCardProps {
  name: string;
  quantity: string;
  unit: string;
  imageUrl?: string;
}

export default function RemoveItemCard({ name, quantity, unit, imageUrl }: RemoveItemCardProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        gap: 10,
        // opacity: 0.5,
        backgroundColor: "#00000080",
        borderRadius: 10
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
        <IText bold size={14} >
          {name}
        </IText>
        <IText size={12}>
          {quantity} {unit}
        </IText>
      </View>
    </View>
  );
}
