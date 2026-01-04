import IButton from "@/components/IButton";
import { ShoppingItemCard } from "@/components/shopping/ShoppingItemCard";
import { IText } from "@/components/styled";
import { useDeleteItem, useShoppingList, useUpdateItem } from "@/hooks/shopping/useShopping";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, View } from "react-native";

interface PendingUpdate {
  itemId: string;
  isPurchased: boolean;
}

export default function ShoppingListDetailScreen() {
  const params = useLocalSearchParams();
  const listId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  // Data fetching
  const { data: list, isLoading } = useShoppingList(listId);
  const updateMutation = useUpdateItem();
  const deleteMutation = useDeleteItem();

  // State management
  const [pendingUpdates, setPendingUpdates] = useState<Record<string, boolean>>({});
  const pendingUpdatesRef = useRef<PendingUpdate[]>([]);

  // Display items with optimistic updates
  const displayItems = useMemo(() => {
    if (!list?.items) return [];
    return list.items.map((item) => ({
      ...item,
      isPurchased:
        pendingUpdates[item._id!] !== undefined ? pendingUpdates[item._id!] : item.isPurchased,
    }));
  }, [list?.items, pendingUpdates]);

  // Calculate purchased items for checkout
  const purchasedItems = useMemo(() => {
    return displayItems.filter((item) => item.isPurchased);
  }, [displayItems]);

  // Track pending updates in ref for cleanup
  useEffect(() => {
    pendingUpdatesRef.current = Object.entries(pendingUpdates).map(([itemId, isPurchased]) => ({
      itemId,
      isPurchased,
    }));
  }, [pendingUpdates]);

  // Persist updates when leaving screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (!list?._id) return;

        const updates = pendingUpdatesRef.current;
        updates.forEach(({ itemId, isPurchased }) => {
          const originalItem = list.items.find((i) => i._id === itemId);
          if (originalItem && originalItem.isPurchased !== isPurchased) {
            updateMutation.mutate({
              listId: list._id,
              itemId,
              data: { isPurchased },
            });
          }
        });

        // Clear pending updates after submission
        setPendingUpdates({});
      };
    }, [list, updateMutation])
  );

  // Toggle item purchase status with optimistic update
  const handleTogglePurchased = useCallback((itemId: string, currentStatus: boolean) => {
    setPendingUpdates((prev) => ({
      ...prev,
      [itemId]: !currentStatus,
    }));
  }, []);

  // Delete item with confirmation
  const handleDeleteItem = useCallback(
    (itemId: string) => {
      if (!list?._id) return;

      // Remove from pending updates first
      setPendingUpdates((prev) => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });

      // Send delete request
      deleteMutation.mutate({
        listId: list._id,
        itemId,
      });
    },
    [list?._id, deleteMutation]
  );

  // Navigate to checkout with purchased items
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
      {displayItems.length > 0 ? (
        <FlatList
          data={displayItems}
          keyExtractor={(item) => item._id || ""}
          scrollEnabled={false}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <ShoppingItemCard
              item={item}
              onToggle={() => handleTogglePurchased(item._id!, item.isPurchased)}
              onDelete={() => handleDeleteItem(item._id!)}
            />
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <IText size={14} color="#9CA3AF">
            No items in this list
          </IText>
        </View>
      )}

      {/* Checkout button - shown when items are selected */}
      {purchasedItems.length > 0 && (
        <View style={styles.checkoutFooter}>
          <IButton
            variant="primary"
            onPress={handleCheckout}
            style={styles.checkoutButton}
            // backgroundColor="#0066CC"
          >
            <IText size={16} semiBold color="white">{`Checkout (${purchasedItems.length})`}</IText>
          </IButton>
        </View>
      )}

      {/* Mutation error handling */}
      {updateMutation.isError && (
        <View style={styles.errorBanner}>
          <IText size={12} color="#DC2626">
            Failed to update item. Please try again.
          </IText>
        </View>
      )}

      {deleteMutation.isError && (
        <View style={styles.errorBanner}>
          <IText size={12} color="#DC2626">
            Failed to delete item. Please try again.
          </IText>
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
