// import AddItemModal from "@/components/fridge/AddItemModal";
import AddItemModal from "@/components/fridge/AddItemModal/index";
import EmptyFridgeMessage from "@/components/fridge/EmptyFridgeMessage";
import FridgeItemCard from "@/components/fridge/FridgeItemCard";
import IButton from "@/components/IButton";
import SearchBar from "@/components/SearchBar";
import { ItemCard, IText } from "@/components/styled";
import { useGetAllFridgeItems } from "@/hooks/fridge/useGetAllFridgeItems";
import { FridgeItem } from "@/types/types";
import { Entypo, Feather, FontAwesome6 } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, View } from "react-native";

type EditingItem = {
  [key: string]: number;
};

const mockFridgeItem: FridgeItem[] = [
  {
    _id: "1",
    foodId: {
      _id: "1",
      name: "BanAnA",
      imageURL:
        "https://static.vecteezy.com/system/resources/thumbnails/012/909/735/small/bunch-of-bananas-free-png.png",
    },
    expiryDate: new Date(2025, 11, 30).toDateString(),
    quantity: 3,
    status: "in-stock",
    unitId: {
      _id: "1",
      abbreviation: "pcs",
      name: "piece",
    },
    purchaseDate: new Date(2025, 11, 21).toDateString(),
    price: 12000,
  },
  {
    _id: "2",
    foodId: {
      _id: "2",
      name: "Egg",
      imageURL:
        "https://imgs.search.brave.com/diwp7S5Gw9OU3k_BPaE0WgppBr4_5PHHE-0c_BWO-Ps/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNDEv/Mjc3LzM0OS9zbWFs/bC9haS1nZW5lcmF0/ZWQtY2hpY2tlbi1l/Z2ctaXNvbGF0ZWQt/b24tdHJhbnNwYXJl/bnQtYmFja2dyb3Vu/ZC1wbmcucG5n",
    },
    expiryDate: new Date(2025, 11, 28).toDateString(),
    quantity: 12,
    status: "in-stock",
    unitId: {
      _id: "1",
      abbreviation: "pcs",
      name: "piece",
    },
    purchaseDate: new Date(2025, 11, 25).toDateString(),
    price: 36000,
  },
];

export default function FridgeScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingQuantities, setEditingQuantities] = useState<EditingItem>({});
  const [itemsToDelete, setItemsToDelete] = useState<string[]>([]);
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const { data, isLoading, error } = useGetAllFridgeItems({
    params: {
      sortBy: "expiryDate_asc",
      search: searchQuery,
      limit: 100,
      page: 1,
    },
  });

  const items = (data?.items || [...mockFridgeItem]) as FridgeItem[];

  const handleAddItem = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditingQuantities({});
    setItemsToDelete([]);
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditingQuantities({});
    setItemsToDelete([]);
  }, []);

  const handleQuantityChange = useCallback((itemId: string, newQuantity: number) => {
    setEditingQuantities((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));
  }, []);

  const handleDeleteItem = useCallback((itemId: string) => {
    setItemsToDelete((prev) => [...prev, itemId]);
  }, []);

  const handleDone = useCallback(async () => {
    // TODO: Implement API calls to update quantities and delete items
    // For now, just exit edit mode
    setIsEditing(false);
    setEditingQuantities({});
    setItemsToDelete([]);
  }, []);

  const handleUseInMeals = useCallback(() => {
    router.push("/(app)/meals");
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: FridgeItem; index: number }) => {
      return (
        <View
          key={item._id}
          style={[
            styles.itemWrapper,
            index === 0 && styles.firstItem,
            index === items.length - 1 && styles.lastItem,
          ]}
        >
          <FridgeItemCard
            item={item}
            isEditing={isEditing}
            onQuantityChange={handleQuantityChange}
            onDelete={handleDeleteItem}
            editQuantity={editingQuantities[item._id] ?? item.quantity}
            toBeDeleted={itemsToDelete.includes(item._id)}
          />
        </View>
      );
    },
    [
      isEditing,
      editingQuantities,
      itemsToDelete,
      items.length,
      handleQuantityChange,
      handleDeleteItem,
    ]
  );

  const filteredItems = items.filter(
    // (item) => !itemsToDelete.includes(item._id)
    (item) => item
  );

  return (
    <SafeAreaView style={styles.container}>
      <AddItemModal ref={bottomSheetRef} />
      {/* Header */}
      <View style={styles.header}>
        {/* TODO: implement the search logic */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search your fridge..."
          containerStyle={styles.searchBarContainer}
        />

        {isEditing ? (
          <>
            <IButton variant="secondary" style={styles.headerButton} onPress={handleCancel}>
              <IText semiBold size={14} color="#82CD47">
                Cancel
              </IText>
            </IButton>
            <IButton variant="primary" style={styles.headerButton} onPress={handleDone}>
              <IText semiBold size={14} color="white">
                Done
              </IText>
            </IButton>
          </>
        ) : (
          <>
            <IButton variant="secondary" style={styles.headerButton} onPress={handleEdit}>
              <IText semiBold size={14} color="#82CD47">
                Edit
              </IText>
            </IButton>
          </>
        )}
      </View>

      {/* Use in Meals Banner */}
      {!isEditing && filteredItems.length > 0 && (
        <ItemCard primary style={styles.banner}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerTextContainer}>
              <IText semiBold size={14} color="white">
                Use your items in Meals!
              </IText>
              {/* TODO: Style this and make this actually work */}
              <View style={{ flexDirection: "row" }}>
                <input type="checkbox" id="options-show-meal-use" style={styles.showTipsCheckbox} />
                <label htmlFor="options-show-meal-use">
                  <IText size={12} color="white" style={{ opacity: 0.9 }}>
                    Don&apos;t show again
                  </IText>
                </label>
              </View>
            </View>
            <IButton variant="tertiary" onPress={handleUseInMeals} style={styles.mealNavButton}>
              <FontAwesome6 name="arrow-right" size={16} color="#82CD47" />
            </IButton>
          </View>
        </ItemCard>
      )}

      {/* Edit Mode Warning */}
      {isEditing && (
        <View style={styles.header}>
          <View style={styles.editWarning}>
            <Feather name="info" size={16} color="#1370D1" />
            <IText size={11} color="#1370D1" style={{ flex: 1, marginLeft: 8 }}>
              This is for adding and removing items without using them in Meals.
            </IText>
          </View>
          <IButton
            variant="primary"
            style={{
              ...styles.headerButton,
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
              height: 40,
            }}
            onPress={handleAddItem}
          >
            <Entypo name="plus" size={16} color="white" />
            <IText semiBold size={14} color="white">
              New item
            </IText>
          </IButton>
        </View>
      )}

      {/* Content */}
      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#82CD47" />
        </View>
      ) : error ? (
        <View style={styles.centerContent}>
          <IText color="#C41E3A" semiBold>
            Error loading fridge items
          </IText>
        </View>
      ) : filteredItems.length === 0 ? (
        <EmptyFridgeMessage handleOpenAddItemModal={handleAddItem} />
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          scrollEnabled={true}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 16,
    // paddingVertical: 12,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bookmarkIcon: {
    marginLeft: 4,
  },
  banner: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  bannerContent: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerTextContainer: {
    flex: 1,
    gap: 4,
  },
  mealNavButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 8,
  },
  showTipsCheckbox: {
    backgroundColor: "black",
    color: "yellow",
  },
  editWarning: {
    flexDirection: "row",
    // marginHorizontal: 16,
    // marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  searchBarContainer: {
    flex: 1,
  },
  listContent: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  itemWrapper: {
    marginBottom: 12,
  },
  firstItem: {
    marginTop: 0,
  },
  lastItem: {
    marginBottom: 0,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});