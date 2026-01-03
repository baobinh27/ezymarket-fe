import CheckoutHeader from "@/components/shopping/CheckoutHeader";
import RemoveItemCard from "@/components/shopping/RemoveItemCard";
import { ShoppingItemCheckoutCard } from "@/components/shopping/ShoppingItemCheckoutCard";
import { IText } from "@/components/styled";
import { useCheckoutShoppingList } from "@/hooks/shopping/useShopping";
import { ShoppingItem } from "@/types/types";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useLayoutEffect, useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";

export default function CheckoutScreen() {
  const { id, name, items: itemsParam } = useLocalSearchParams();

  const initialItems = useMemo(() => {
    if (itemsParam) {
      try {
        const parsedItems = JSON.parse(Array.isArray(itemsParam) ? itemsParam[0] : itemsParam);
        return parsedItems.map((item: any) => ({
          ...item,
          quantity: parseFloat(item.quantity) || 0,
          price: 0,
          // We don't store expiryDays or total in ShoppingItem, handled in component or derived
        }));
      } catch (e) {
        console.error('Failed to parse items:', e);
      }
    }
  }, [itemsParam]);

  const [checkoutItems, setCheckoutItems] = useState<ShoppingItem[]>(initialItems);
  const checkoutMutation = useCheckoutShoppingList();
  const navigation = useNavigation();
  const router = useRouter();

  const savedItems = useMemo(() => checkoutItems.filter(item => item.isPurchased), [checkoutItems]);
  const removedItems = useMemo(() => checkoutItems.filter(item => !item.isPurchased), [checkoutItems]);

  const handleCheckout = () => {
    // Check if any items are selected
    if (!savedItems.length) {
      alert("Please select items to checkout");
      return;
    }

    const payload = savedItems.map(item => ({
      itemId: item._id!,
      price: item.price,
      servingQuantity: item.servingQuantity,
      expiryDate: item.expiryDate
    }));

    checkoutMutation.mutate({
      listId: id as string,
      items: payload
    }, {
      onSuccess: () => {
        router.dismissAll();
        router.push("/shopping");
      },
      onError: (error) => {
        console.error("Checkout failed:", error);
        alert("Failed to checkout. Please try again.");
      }
    });

  };

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CheckoutHeader
          onBack={() => router.back()}
          onSave={handleCheckout}
        />
      ),
    });
  }, [navigation, savedItems, checkoutItems]); // Depend on state for handleCheckout closure

  const handleSaveItem = (itemId: string) => {
    setCheckoutItems(
      checkoutItems.map((item) =>
        item._id === itemId ? { ...item, isPurchased: true } : item
      )
    );
  };

  const handlePriceChange = (itemId: string, price: string) => {
    setCheckoutItems(
      checkoutItems.map((item) =>
        item._id === itemId ? { ...item, price: parseFloat(price) || 0 } : item
      )
    );
  };

  const handleTotalChange = (itemId: string, total: string) => {
    // If total changes, we might update price (unit cost)
    // price = total / quantity
    setCheckoutItems(
      checkoutItems.map((item) => {
        if (item._id === itemId) {
          const t = parseFloat(total) || 0;
          const q = item.quantity || 1;
          return { ...item, price: t / q };
        }
        return item;
      })
    );
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setCheckoutItems(
      checkoutItems.map((item) => {
        if (item._id === itemId) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const handleExpiryChange = (itemId: string, expiryDays: string) => {
    const days = parseInt(expiryDays) || 0;
    const date = new Date();
    date.setDate(date.getDate() + days);

    setCheckoutItems(
      checkoutItems.map((item) =>
        item._id === itemId ? { ...item, expiryDate: date.toISOString() } : item
      )
    );
  };

  const handleServingQuantityChange = (itemId: string, servingQuantity: number) => {
    setCheckoutItems(
      checkoutItems.map((item) =>
        item._id === itemId ? { ...item, servingQuantity } : item
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

      {/* Saved Checkout Items */}
      {savedItems.length > 0 && (
        <FlatList
          data={savedItems}
          keyExtractor={(item) => item._id || ""}
          scrollEnabled={false}
          contentContainerStyle={{
            gap: 10,
          }}
          renderItem={({ item }) => (
            <ShoppingItemCheckoutCard
              item={item}
              onQuantityChange={(qty) => handleQuantityChange(item._id!, qty)}
              onServingQuantityChange={(qty) => handleServingQuantityChange(item._id!, qty)}
              onPriceChange={(cost) => handlePriceChange(item._id!, cost)}
              onTotalChange={(total) => handleTotalChange(item._id!, total)}
              onExpiryChange={(days) => handleExpiryChange(item._id!, days)}
            />
          )}
        />
      )}

      {/* Remove items */}
      {removedItems.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <FlatList
            data={removedItems}
            keyExtractor={(item) => item._id || ""}
            scrollEnabled={false}
            contentContainerStyle={{
              gap: 10,
            }}
            renderItem={({ item }) => (
              <RemoveItemCard
                item={item}
              />
            )}
          />
        </View>
      )}


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flex: 1,
    borderBottomWidth: 1,
    marginLeft: 2,
    paddingVertical: 4
  },
  dashedSearchContainer: {
    borderStyle: "dashed",
    paddingVertical: 20,
  },
});
