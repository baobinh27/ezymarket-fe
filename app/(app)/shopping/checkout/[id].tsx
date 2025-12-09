import { SearchBox } from "@/components/SearchBox";
import RemoveItemCard from "@/components/shopping/RemoveItemCard";
import { CheckoutItem, ShoppingItemCheckoutCard } from "@/components/shopping/ShoppingItemCheckoutCard";
import { IText } from "@/components/styled";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";

export default function CheckoutScreen() {
  const { id, name, items: itemsParam } = useLocalSearchParams();

  const initialItems = useMemo(() => {
    if (itemsParam) {
      try {
        const parsedItems = JSON.parse(Array.isArray(itemsParam) ? itemsParam[0] : itemsParam);
        return parsedItems.map((item: any) => ({
          ...item,
          costPerUnit: "0",
          total: "0",
          expiryDays: item.expiryDays || 7
        }));
      } catch (e) {
        console.error('Failed to parse items:', e);
      }
    }
    // Fallback mock data
    return [
      {
        id: "1",
        name: "Cabbage",
        quantity: "2",
        unit: "pieces",
        isPurchased: false,
        costPerUnit: "0",
        total: "0",
        expiryDays: 3
      },
      {
        id: "2",
        name: "Egg",
        quantity: "10",
        unit: "pieces",
        isPurchased: false,
        costPerUnit: "0",
        total: "0",
        expiryDays: 21
      },
      {
        id: "3",
        name: "Milk",
        quantity: "1",
        unit: "carton",
        isPurchased: true,
        costPerUnit: "0",
        total: "0",
        expiryDays: 0
      },
    ];
  }, [itemsParam]);

  const [checkoutItems, setCheckoutItems] = useState<CheckoutItem[]>(initialItems);

  const handleSaveItem = (itemId: string) => {
    setCheckoutItems(
      checkoutItems.map((item) =>
        item.id === itemId ? { ...item, isPurchased: true } : item
      )
    );
  };

  const handleCostChange = (itemId: string, costPerUnit: string) => {
    setCheckoutItems(
      checkoutItems.map((item) => (item.id === itemId ? { ...item, costPerUnit } : item))
    );
  };

  const handleTotalChange = (itemId: string, total: string) => {
    setCheckoutItems(checkoutItems.map((item) => (item.id === itemId ? { ...item, total } : item)));
  };

  const handleExpiryChange = (itemId: string, expiryDays: string) => {
    setCheckoutItems(
      checkoutItems.map((item) =>
        item.id === itemId ? { ...item, expiryDays: parseInt(expiryDays) || 0 } : item
      )
    );
  };

  const savedItems = useMemo(() => checkoutItems.filter(item => item.isPurchased), [checkoutItems]);
  const removedItems = useMemo(() => checkoutItems.filter(item => !item.isPurchased), [checkoutItems]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
    >
      <IText bold size={16} style={styles.heading}>
        {name}
      </IText>

      {/* Saved Checkout Items */}
      {savedItems.length > 0 && (
        <FlatList
          data={savedItems}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={{
            gap: 10,
          }}
          renderItem={({ item }) => (
            <ShoppingItemCheckoutCard
              item={item}
              setAmount={() => { }}
              amount={parseInt(item.quantity)}
              onCostChange={(cost) => handleCostChange(item.id, cost)}
              onTotalChange={(total) => handleTotalChange(item.id, total)}
              onExpiryChange={(days) => handleExpiryChange(item.id, days)}
            />
          )}
        />
      )}

      {/* Remove items */}
      {removedItems.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <FlatList
            data={removedItems}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{
              gap: 10,
            }}
            renderItem={({ item }) => (
              <RemoveItemCard
                name={item.name}
                quantity={item.quantity}
                unit={item.unit}
              />
            )}
          />
        </View>
      )}

      {/* Search box */}
      <SearchBox
        value=""
        onChangeText={() => { }}
        placeholder="Items that was not in the list......"
        containerStyle={styles.dashedSearchContainer}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flex: 1,
    borderBottomWidth: 1,
    marginLeft: 2,
    paddingVertical: 4,
  },
  dashedSearchContainer: {
    borderStyle: "dashed",
    paddingVertical: 20,
  },
});
