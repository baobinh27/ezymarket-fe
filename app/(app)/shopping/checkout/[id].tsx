import { CheckoutItem, ShoppingItemCheckoutCard } from "@/components/shopping/ShoppingItemCheckoutCard";
import { IText } from "@/components/styled";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, ScrollView, StyleSheet } from "react-native";

export default function CheckoutScreen() {
  const { id, name } = useLocalSearchParams();
  
  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>([
    { 
      id: "1", 
      name: "Cabbage", 
      quantity: "2", 
      unit: "pieces",
      saved: false,
      costPerUnit: "0",
      total: "0",
      expiryDays: 3
    },
    { 
      id: "2", 
      name: "Egg", 
      quantity: "10", 
      unit: "pieces",
      saved: false,
      costPerUnit: "0",
      total: "0",
      expiryDays: 21
    },
    { 
      id: "3", 
      name: "Milk", 
      quantity: "1", 
      unit: "carton",
      saved: true,
      costPerUnit: "0",
      total: "0",
      expiryDays: 0
    },
  ]);

  const handleSaveItem = (itemId: string) => {
    setCheckoutItems(
      checkoutItems.map((item) =>
        item.id === itemId ? { ...item, saved: true } : item
      )
    );
  };

  const handleCostChange = (itemId: string, costPerUnit: string) => {
    setCheckoutItems(
      checkoutItems.map((item) =>
        item.id === itemId ? { ...item, costPerUnit } : item
      )
    );
  };

  const handleTotalChange = (itemId: string, total: string) => {
    setCheckoutItems(
      checkoutItems.map((item) =>
        item.id === itemId ? { ...item, total } : item
      )
    );
  };

  const handleExpiryChange = (itemId: string, expiryDays: string) => {
    setCheckoutItems(
      checkoutItems.map((item) =>
        item.id === itemId ? { ...item, expiryDays: parseInt(expiryDays) || 0 } : item
      )
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
    >
      <IText bold size={16} style={styles.heading}>
        {name}
      </IText>

      {/* Checkout Items */}
      <FlatList
        data={checkoutItems}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={{
          gap: 0,
        }}
        renderItem={({ item }) => (
          <ShoppingItemCheckoutCard
            item={item}
            setAmount={() => {}}
            amount={parseInt(item.quantity)}
            onCostChange={(cost) => handleCostChange(item.id, cost)}
            onTotalChange={(total) => handleTotalChange(item.id, total)}
            onExpiryChange={(days) => handleExpiryChange(item.id, days)}
          />
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flex:1, 
    borderBottomWidth: 1,
    marginLeft: 2,
    paddingVertical: 4  
  },
});
