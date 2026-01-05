import IButton from "@/components/IButton";
import { ShoppingItemCard } from "@/components/shopping/ShoppingItemCard";
import { IText } from "@/components/styled";
import { useDeleteItem, useShoppingList, useUpdateItem } from "@/hooks/shopping/useShopping";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, View } from "react-native";

export default function ShoppingListDetailScreen() {
  const params = useLocalSearchParams();
  const listId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  // Data fetching
  const { data: list, isLoading } = useShoppingList(listId);
  const updateMutation = useUpdateItem();
  const deleteMutation = useDeleteItem();

  // 1. Local state to hold the items
  const [localItems, setLocalItems] = useState<any[]>([]);


  useEffect(() => {
    if (list?.items) {
      setLocalItems(list.items);
    }
  }, [list?.items]);


  // 3. Simple toggle handler locally
  const handleTogglePurchased = useCallback((itemId: string) => {
    setLocalItems((prevItems) => {
      return prevItems.map(item => {
        if (item._id === itemId) {
          return { ...item, isPurchased: !item.isPurchased };
        }
        return item;
      })
    });
  }, []);

  // Navigate to checkout with purchased items*/
  const purchasedItems = useMemo(() => {
    return localItems.filter((item) => item.isPurchased);
  }, [localItems]);

  const handleCheckout = useCallback(() => {
    if (purchasedItems.length === 0) {
      alert("Please select items to checkout");
      return;
    }

    router.push({
      pathname: "/shopping/checkout/[id]",
      params: {
        id: listId,
        name: list?.title,
        items: JSON.stringify(purchasedItems),
      },
    });
  }, [purchasedItems, listId, list?.title, router]);

  // Stable Render Item
  const renderItem = useCallback(({ item }: { item: any }) => (
    <ShoppingItemCard
      item={item}
      onToggle={handleTogglePurchased}
    // onDelete={handleDeleteItem}
    />
  ), [handleTogglePurchased]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 16, paddingVertical: 16 }}
    >
      {/* Header */}
      <View style={styles.heading}>
        <IText bold size={16}>
          {list?.title || "Shopping List"}
        </IText>
        {list?.description ? (
          <IText size={12} color="#6B7280" style={{ fontStyle: "italic", marginTop: 4 }}>
            {list.description}
          </IText>
        ) : null}
      </View>

      {/* Items List */}
      {localItems.length > 0 ? (
        <FlatList
          data={localItems}
          keyExtractor={(item) => item._id || ""}
          scrollEnabled={false}
          contentContainerStyle={{ gap: 12 }}
          renderItem={renderItem}
        />
      ) : (
        <View style={styles.emptyState}>
          <IText size={14} color="#9CA3AF">
            No items in this list
          </IText>
        </View>
      )}
      {purchasedItems.length > 0 && (
        <View style={styles.checkoutFooter}>
          <IButton
            variant="primary"
            onPress={handleCheckout}
            style={styles.checkoutButton}
          >
            <IText size={16} semiBold color="white">{`Checkout (${purchasedItems.length})`}</IText>
          </IButton>
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
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  errorBanner: {
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  checkoutFooter: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  checkoutButton: {
    paddingVertical: 12,
    borderRadius: 8,
  },
});
