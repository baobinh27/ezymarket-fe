import { ItemImage, IText } from "@/components/styled";
import { Octicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

interface AddItemCardProps {
  name: string;
  imageUrl?: string;
  isRecommended?: boolean;
  onPress: () => void;
}

export default function AddItemCard({ name, imageUrl, isRecommended, onPress }: AddItemCardProps) {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: "#F5F5F5",
        borderRadius: 8,
        marginBottom: 8,
      }}
      onPress={onPress}
    >
     <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
      <ItemImage
        src="https://imgs.search.brave.com/ZyTalHbd6ylc6QNmPc_567ZkdaIA2fOjPirg0xv5rNY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAxNi8w/NS9DYWJiYWdlLUZy/ZWUtUE5HLUltYWdl/LnBuZw" 
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
        }}
      />
     
        {isRecommended && (
         <View style={{
            backgroundColor: "white",
            borderRadius: 5,
            paddingVertical: 2,
            paddingHorizontal: 8,
            marginRight: 5
         }}>
            <IText size={10} color="#46982D">Recommended</IText>
        </View>)
        }
        <IText semiBold>
          {name}
        </IText>
      </View>
      <Octicons name="plus" size={24} color="#000000B4" />
    </TouchableOpacity>
  );
}
