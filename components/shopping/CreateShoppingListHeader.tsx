import { IText } from "@/components/styled";
import { Octicons } from "@expo/vector-icons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { TouchableOpacity, View } from "react-native";

interface CreateShoppingListHeaderProps extends NativeStackHeaderProps {
  onConfirm: () => void;
}

export default function CreateShoppingListHeader({ navigation, onConfirm }: CreateShoppingListHeaderProps) {
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

    </View>
  );
}
