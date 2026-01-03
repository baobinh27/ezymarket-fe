import { ShoppingItemCard } from "@/components/shopping/ShoppingItemCard";
import { IText } from "@/components/styled";
import { useAddShoppingItem, useDeleteItem, useShoppingList, useUpdateItem } from "@/hooks/shopping/useShopping";
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, View } from "react-native";

export default function ShoppingListDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: list, isLoading } = useShoppingList(id);
  const addMutation = useAddShoppingItem();
  const updateMutation = useUpdateItem();
  const deleteMutation = useDeleteItem();

  const [newItemName, setNewItemName] = useState("");
  const [pendingUpdates, setPendingUpdates] = useState<Record<string, boolean>>({});
  const updatesRef = useRef<Record<string, boolean>>({});

  const navigation = useNavigation();
  // Merge pending updates for display
  const displayItems = useMemo(() => list?.items.map(item => ({
    ...item,
    isPurchased: pendingUpdates[item._id!] !== undefined
      ? pendingUpdates[item._id!]
      : item.isPurchased
  })) || [], [list, pendingUpdates]);

  useEffect(() => {
    navigation.setParams({ items: displayItems } as any);
  }, [displayItems]);

  useEffect(() => {
    updatesRef.current = pendingUpdates;
  }, [pendingUpdates]);


  useFocusEffect(
    useCallback(() => {
      return () => {
        const updates = updatesRef.current;
        const currentList = list;

        if (!currentList || !currentList._id) return;

        Object.entries(updates).forEach(([itemId, isPurchased]) => {
          const originalItem = currentList.items.find(i => i._id === itemId);
          if (originalItem && originalItem.isPurchased !== isPurchased) {
            updateMutation.mutate({
              listId: currentList._id,
              itemId,
              data: { isPurchased }
            });
          }
        });
      };
    }, [list])
  );

  const handleTogglePurchased = (itemId: string) => {
    // Current state is from pending or original
    const item = list?.items.find(i => i._id === itemId);
    const currentStatus = pendingUpdates[itemId] !== undefined ? pendingUpdates[itemId] : item?.isPurchased;
    const newStatus = !currentStatus;

    setPendingUpdates(prev => ({
      ...prev,
      [itemId]: newStatus
    }));
  };

  const handleDeleteItem = (itemId: string) => {
    // Also remove from pending updates if present
    if (pendingUpdates[itemId] !== undefined) {
      setPendingUpdates(prev => {
        const next = { ...prev };
        delete next[itemId];
        return next;
      });
    }

    if (list?._id) {
      deleteMutation.mutate({ listId: list._id, itemId });
    }
  };


  if (isLoading) return <ActivityIndicator style={{ marginTop: 20 }} />;



  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
    >


      <View style={styles.heading}>
        <IText bold size={16}>
          {list?.title}
        </IText>
        {list?.description ? (
          <IText size={12} color="#6B7280" style={{ fontStyle: "italic", marginTop: 2 }}>
            {list.description}
          </IText>
        ) : null}
      </View>

      {/* Items List */}
      <FlatList
        data={displayItems}
        keyExtractor={(item) => item._id || ""}
        scrollEnabled={false}
        contentContainerStyle={{
          gap: 16
        }}
        renderItem={({ item }) => (
          <ShoppingItemCard
            item={item}
            onToggle={() => handleTogglePurchased(item._id!)}
            onDelete={() => handleDeleteItem(item._id!)}
          />
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flex: 1,
    borderBottomWidth: 1,
    marginLeft: 2,
    paddingVertical: 4
  }

});