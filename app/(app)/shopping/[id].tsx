import { ShoppingItem, ShoppingItemCard } from "@/components/shopping/ShoppingItemCard";
import { IText } from "@/components/styled";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, ScrollView, StyleSheet } from "react-native";

export default function ShoppingListDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const name = Array.isArray(params.name) ? params.name[0] : params.name;
  const [items, setItems] = useState<ShoppingItem[]>([
    { id: "1", name: "Milk", quantity: "2", unit: "L", purchased: false },
    { id: "2", name: "Bread", quantity: "1", unit: "loaf", purchased: false },
    { id: "3", name: "Eggs", quantity: "12", unit: "pieces", purchased: false },
  ]);
  const [newItemName, setNewItemName] = useState("");

  const handleTogglePurchased = (itemId: string) => {
    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, purchased: !item.purchased } : item
      )
    );
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleAddItem = () => {
    if (newItemName.trim()) {
      const newItem: ShoppingItem = {
        id: Date.now().toString(),
        name: newItemName,
        quantity: "1",
        unit: "piece",
        purchased: false,
      };
      setItems([...items, newItem]);
      setNewItemName("");
    }
  };

  const purchasedCount = items.filter((i) => i.purchased).length;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
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
                gap: 16
            }}
            renderItem={({ item }) => (
                <ShoppingItemCard item={item} />
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
    } 
     
 });