import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { IText } from "../styled";

interface EmptyFridgeMessageProps {
  title?: string;
  description?: string;
}

const EmptyFridgeMessage: React.FC<EmptyFridgeMessageProps> = ({
  title = "Your fridge is empty",
  description = "Add some items to get started",
}) => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="fridge-outline"
        size={80}
        color="#82CD47"
        style={styles.icon}
      />
      <IText semiBold size={18} color="#000000B4" style={styles.title}>
        {title}
      </IText>
      <IText size={14} color="#0000004B" style={styles.description}>
        {description}
      </IText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
  },
  description: {
    textAlign: "center",
  },
});

export default EmptyFridgeMessage;
