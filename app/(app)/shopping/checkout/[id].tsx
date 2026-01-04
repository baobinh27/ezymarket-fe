import CheckoutHeader from "@/components/shopping/CheckoutHeader";
import RemoveItemCard from "@/components/shopping/RemoveItemCard";
import { ShoppingItemCheckoutCard } from "@/components/shopping/ShoppingItemCheckoutCard";
import { IText } from "@/components/styled";
import { useCheckoutShoppingList } from "@/hooks/shopping/useShopping";
import { ShoppingItem } from "@/types/types";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, View } from "react-native";

export default function CheckoutScreen() {
  const { id, name, items: itemsParam } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const checkoutMutation = useCheckoutShoppingList();

  // Parse initial items safely
  const initialItems = useMemo(() => {
    if (!itemsParam) {
      console.warn("No items passed to checkout");
      return [];
    }
    try {
      const parsed = JSON.parse(Array.isArray(itemsParam) ? itemsParam[0] : itemsParam);
      if (!Array.isArray(parsed)) {
        console.warn("Parsed items is not an array:", parsed);
        return [];
      }
      const items = parsed.map((item: any) => ({
        ...item,
        quantity: parseFloat(item.quantity) || 0,
        price: 0,
        isPurchased: true, // All items coming from shopping list are pre-purchased
      }));
      console.log("Initialized checkout items:", items);
      return items;
    } catch (e) {
      console.error("Failed to parse items:", e);
      return [];
    }
  }, [itemsParam]);

  const [checkoutItems, setCheckoutItems] = useState<ShoppingItem[]>(initialItems);

  // Memoize item splits
  const savedItems = useMemo(() => checkoutItems.filter((item) => item.isPurchased), [checkoutItems]);
  const removedItems = useMemo(() => checkoutItems.filter((item) => !item.isPurchased), [checkoutItems]);

  // Update item with validation
  const updateItem = useCallback(
    (itemId: string, updates: Partial<ShoppingItem>) => {
      setCheckoutItems((prev) =>
        prev.map((item) => (item._id === itemId ? { ...item, ...updates } : item))
      );
    },
    []
  );

  // Handlers with proper parameter passing
  const handleQuantityChange = useCallback(
    (itemId: string, quantity: number) => {
      const validQuantity = Math.max(0, quantity);
      updateItem(itemId, { quantity: validQuantity });
    },
    [updateItem]
  );

  const handleServingQuantityChange = useCallback(
    (itemId: string, servingQuantity: number) => {
      const validQuantity = Math.max(0, servingQuantity);
      updateItem(itemId, { servingQuantity: validQuantity });
    },
    [updateItem]
  );

  const handlePriceChange = useCallback(
    (itemId: string, price: string) => {
      const validPrice = Math.max(0, parseFloat(price) || 0);
      updateItem(itemId, { price: validPrice });
    },
    [updateItem]
  );

  const handleTotalChange = useCallback(
    (itemId: string, total: string) => {
      const validTotal = Math.max(0, parseFloat(total) || 0);
      const item = checkoutItems.find((i) => i._id === itemId);
      if (item) {
        const quantity = item.quantity || 1;
        const price = quantity > 0 ? validTotal / quantity : 0;
        updateItem(itemId, { price: Math.max(0, price) });
      }
    },
    [checkoutItems, updateItem]
  );

  const handleExpiryChange = useCallback(
    (itemId: string, expiryDays: string) => {
      const days = Math.max(0, parseInt(expiryDays) || 0);
      const date = new Date();
      date.setDate(date.getDate() + days);
      updateItem(itemId, { expiryDate: date.toISOString() });
    },
    [updateItem]
  );

  // Handle checkout action
  const handleCheckout = useCallback(() => {
    if (savedItems.length === 0) {
      alert("Please select items to checkout");
      return;
    }

    const payload = savedItems.map((item) => ({
      itemId: item._id!,
      price: item.price || 0,
      servingQuantity: item.servingQuantity || item.quantity || 0,
      expiryDate: item.expiryDate || new Date().toISOString(),
    }));

    checkoutMutation.mutate(
      {
        listId: Array.isArray(id) ? id[0] : id,
        items: payload,
      },
      {
        onSuccess: () => {
          router.dismissAll();
          router.push("/shopping");
        },
        onError: (error) => {
          console.error("Checkout failed:", error);
          alert("Failed to checkout. Please try again.");
        },
      }
    );
  }, [savedItems, id, checkoutMutation, router]);

  // Update header only on mutation state change
  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <CheckoutHeader
          onBack={() => router.back()}
          onSave={handleCheckout}
          isLoading={checkoutMutation.isPending}
        />
      ),
    });
  }, [navigation, handleCheckout, checkoutMutation.isPending, router]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 16, paddingVertical: 16 }}
    >
      <IText bold size={16} style={styles.heading}>
        {name || "Checkout"}
      </IText>

      {/* Loading overlay during checkout */}
      {checkoutMutation.isPending && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0066CC" />
        </View>
      )}

      {/* Saved Checkout Items */}
      {savedItems.length > 0 ? (
        <FlatList
          data={savedItems}
          keyExtractor={(item) => item._id || ""}
          scrollEnabled={false}
          contentContainerStyle={{ gap: 10 }}
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
      ) : null}

      {/* Removed items section */}
      {removedItems.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <IText size={14} color="#6B7280" style={{ marginBottom: 8 }}>
            Not Selected ({removedItems.length})
          </IText>
          <FlatList
            data={removedItems}
            keyExtractor={(item) => item._id || ""}
            scrollEnabled={false}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => <RemoveItemCard item={item} />}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginLeft: 2,
    paddingBottom: 8,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});
