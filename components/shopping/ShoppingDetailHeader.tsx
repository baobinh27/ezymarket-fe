import IButton from "@/components/IButton";
import { IText } from "@/components/styled";
import { Octicons } from "@expo/vector-icons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { TouchableOpacity, View } from "react-native";

interface ShoppingDetailHeaderProps extends NativeStackHeaderProps {}

export default function ShoppingDetailHeader({ navigation, route }: ShoppingDetailHeaderProps) {
  const params = route.params as { id?: string; name?: string };

  const handleCheckout = () => {
    navigation.push('checkout/[id]', { 
      id: params.id, 
      name: params.name 
    } as never);
  };

  return (
    <View style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 50,
      paddingBottom: 10,
    }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Octicons size={24} name="chevron-left" color="black" />
          <IText color="black" semiBold size={16}>Back</IText>
        </View>
      </TouchableOpacity>
      
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10
      }}>
        <IButton 
          variant="secondary" 
          style={{ borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 }} 
          onPress={() => {}}
        >
          <IText color="#46982D" semiBold>Edit</IText>
        </IButton>
        
        <IButton 
          variant="primary" 
          style={{ borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 }} 
          onPress={handleCheckout}
        >
          <IText color="white" semiBold>Checkout</IText>
        </IButton>
      </View>
    </View>
  );
}
