import { Octicons } from "@expo/vector-icons";
import { View } from "react-native";
import { ItemCard, ItemImage, IText } from "../styled";

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  purchased: boolean;
}

interface ShoppingItemProps {
  item: ShoppingItem
}


export const ShoppingItemCard: React.FC<ShoppingItemProps> = ({
  item
}) => {
  return (
   <ItemCard >

   
        {/* <TouchableOpacity
        onPress={() => {}}
        style={{
            width: 24,
            height: 24,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: item.purchased ? "#4CAF50" : "#ccc",
            backgroundColor: item.purchased ? "#4CAF50" : "transparent",
            marginRight: 12,
            justifyContent: "center",
            alignItems: "center",
        }}
        >
        {item.purchased && (
            <IText bold color="white" size={14}>
            ✓
            </IText>
        )}
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
        <IText
            bold
            color={item.purchased ? "#999" : "#000"}
            size={16}
            style={{
            textDecorationLine: item.purchased ? "line-through" : "none",
            }}
        >
            {item.name}
        </IText>
        <IText color="#999" size={12}>
            {item.quantity} {item.unit}
        </IText>
        </View>

        <TouchableOpacity onPress={() => {}}>
        <IText color="#FF3B30" bold size={18}>
            ✕
        </IText>
        </TouchableOpacity> */}
        <View style={{
            flexDirection: "row",
            alignItems: "center"
        }}>
            <ItemImage  src="https://imgs.search.brave.com/ZyTalHbd6ylc6QNmPc_567ZkdaIA2fOjPirg0xv5rNY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAxNi8w/NS9DYWJiYWdlLUZy/ZWUtUE5HLUltYWdl/LnBuZw" />
            <IText semiBold>Cabbage</IText>
        </View>

        <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10
        }}>
            <IText size={11} >2 pieces</IText>
            <Octicons size={36} name="checkbox" color="black"/>
        </View>


    </ItemCard>

        
  )
}

