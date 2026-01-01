import React from "react";
import { TextInput, View } from "react-native";
import IButton from "../IButton";
import { IText } from "../styled";

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  purchased: boolean;
}

interface ShoppingItemListProps {
  items: ShoppingItem[];
  onTogglePurchased: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
}

export const ShoppingItemList: React.FC<ShoppingItemListProps> = ({
  items,
  onTogglePurchased,
  onDeleteItem,
}) => {
  return;
};

interface AddItemInputProps {
  value: string;
  onChange: (text: string) => void;
  onAdd: () => void;
}

export const AddItemInput: React.FC<AddItemInputProps> = ({ value, onChange, onAdd }) => {
  return (
    <View style={{ flexDirection: "row", marginBottom: 16, gap: 8 }}>
      <TextInput
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
        placeholder="Add new item..."
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onAdd}
        placeholderTextColor="#999"
      />
      <IButton
        variant="primary"
        onPress={onAdd}
        style={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderRadius: 8,
        }}
      >
        <IText color="white" semiBold>
          Add
        </IText>
      </IButton>
    </View>
  );
};

interface ShoppingListProgressProps {
  purchasedCount: number;
  totalCount: number;
}

export const ShoppingListProgress: React.FC<ShoppingListProgressProps> = ({
  purchasedCount,
  totalCount,
}) => {
  return (
    <View
      style={{
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#eee",
      }}
    >
      <IText color="#666" size={14}>
        {purchasedCount} of {totalCount} items purchased
      </IText>
    </View>
  );
};
