import SavedShoppingItemCard from "@/components/shopping/SavedShoppingItemCard";
import { IText } from "@/components/styled";
import { useShoppingList } from "@/hooks/shopping/useShopping";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, View } from "react-native";

export default function SavedShoppingListScreen() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // Fetch shopping list data
  const { data: list, isLoading, error } = useShoppingList(id);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    if (!list?.items) return { totalItems: 0, totalCost: 0 };

    const totalItems = list.items.length;
    const totalCost = list.items.reduce((sum, item) => {
      const cost = item.price || 0;
      return sum + cost;
    }, 0);

    return { totalItems, totalCost };
  }, [list?.items]);

  // Get current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  if (error || !list) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <IText color="#C41E3A" semiBold>
          Error loading shopping list
        </IText>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 16, paddingBottom: 24 }}
    >
      <IText bold size={16} style={styles.heading}>
        {list.title}
      </IText>

      {list.description && (
        <IText size={12} color="#6B7280" style={{ fontStyle: "italic", marginTop: -12 }}>
          {list.description}
        </IText>
      )}

      {/* Items List */}
      {list.items.length > 0 ? (
        <FlatList
          data={list.items}
          keyExtractor={(item) => item._id || ""}
          scrollEnabled={false}
          contentContainerStyle={{
            gap: 16,
          }}
          renderItem={({ item }) => (
            <SavedShoppingItemCard
              item={{
                id: item._id || "",
                name: item.name,
                quantity: item.quantity.toString(),
                unit: item.unitId?.abbreviation || "unit",
                cost: item.price ? `${item.price.toLocaleString("vi-VN")}đ` : "",
                // isPurchased: item.isPurchased,
                imageUrl: item.ingredientId.imageURL
              }}
              isPurchased={item.isPurchased}
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

      {/* Summary Footer */}
      <View style={styles.footer}>
        <IText size={15}>{currentDate}</IText>
        <IText bold size={15}>
          {summaryStats.totalItems} items,{" "}
          {summaryStats.totalCost.toLocaleString("vi-VN")}đ
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
    marginTop: 6,
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginTop: 8,
  },
});
