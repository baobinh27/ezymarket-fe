import IButton from "@/components/IButton";
import { ShoppingItem, ShoppingItemCard } from "@/components/shopping/ShoppingItemCard";
import { IText } from "@/components/styled";
import { Octicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function ShoppingListDetailScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams();
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
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
      {/* Header */}
      <View style={{
        paddingTop: 20,
      }}>
        <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
        }}>
            <TouchableOpacity onPress={() => router.back()}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Octicons size={24} name="chevron-left" color="black"/>
                    <IText color="black" semiBold size={16}>Back</IText>
                </View>     
            </TouchableOpacity>
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10
            }}>
                <IButton variant="secondary" style={{ borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 }} onPress={() => {}}>
                    <IText color="#46982D" semiBold>Edit</IText>
                </IButton>
                 <IButton variant="primary" style={{ borderRadius: 10, paddingVertical: 8, paddingHorizontal: 14 }} onPress={() => {}}>
                    <IText color="white" semiBold>Checkout</IText>
                </IButton>
            </View>
        </View>

        <IText bold size={16} style={styles.heading}>
          {name}
        </IText>
      </View>


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
        marginTop: 30, 
        flex:1, 
        borderBottomWidth: 1,
        marginLeft: 2,
        paddingVertical: 4  
    } 
     
 });