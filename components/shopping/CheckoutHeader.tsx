import IButton from "@/components/IButton";
import { IText } from "@/components/styled";
import { Octicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

interface CheckoutHeaderProps {
  onBack: () => void;
  onSave: () => void;
}

export default function CheckoutHeader({ onBack, onSave }: CheckoutHeaderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 50,
      paddingBottom: 10,
    //   backgroundColor: "white"
      }}
    >
      <TouchableOpacity onPress={onBack}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Octicons size={24} name="chevron-left" color="black" />
          <IText color="black" semiBold size={16}>
            Back
          </IText>
        </View>
      </TouchableOpacity>
      <IButton
        variant="primary"
        style={{ borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 }}
        onPress={onSave}
      >
        <IText color="white" semiBold>
          Save to Fridge
        </IText>
      </IButton>
    </View>
  );
}
