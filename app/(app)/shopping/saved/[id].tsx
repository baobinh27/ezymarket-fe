import SavedShoppingItemCard from "@/components/shopping/SavedShoppingItemCard";
import { IText } from "@/components/styled";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";

interface SavedItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  cost: string;
  isPurchased: boolean;
}

export default function SavedShoppingListScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const name = Array.isArray(params.name) ? params.name[0] : params.name;
  
  const [items, setItems] = useState<SavedItem[]>([
    { id: "1", name: "Cabbage", quantity: "2", unit: "pieces", cost: "32,192đ", isPurchased: false },
    { id: "2", name: "Egg", quantity: "10", unit: "pieces", cost: "33,000đ", isPurchased: false },
    { id: "3", name: "Milk", quantity: "1", unit: "carton", cost: "", isPurchased: true },
    { id: "4", name: "Bread", quantity: "3", unit: "loafs", cost: "78,540đ", isPurchased: false },
  ]);

  const totalItems = items.length;
  const totalCost = items.reduce((sum, item) => {
    const cost = parseInt(item.cost.replace(/[^\d]/g, '')) || 0;
    return sum + cost;
  }, 0);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 16, paddingBottom: 24 }}
    >
      <IText bold size={16} style={styles.heading}>
        {name}
      </IText>

      {/* Items List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={{
          gap: 16,
        }}
        renderItem={({ item }) => (
          <SavedShoppingItemCard 
            item={item} 
            isPurchased={item.isPurchased}
          />
        )}
      />

      {/* Summary Footer */}
      <View style={styles.footer}>
        <IText size={15}>
          Oct 19
        </IText>
        <IText bold size={15}>
          {totalItems} items, {totalCost.toLocaleString('vi-VN')}đ
        </IText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flex: 1, 
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginLeft: 2,
    paddingVertical: 4,
    marginTop: 6  
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginTop: 8,
  }
});
