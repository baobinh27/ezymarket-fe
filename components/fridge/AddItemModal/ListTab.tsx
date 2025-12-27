import { CreateFridgeItemParams } from "@/api/fridge";
import { useCreateFridgeItem } from "@/hooks/fridge/useCreateFridgeItem";
// import { useSnackBar } from "@/services/auth/snackbar.context";
import { Entypo } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import IButton from "../../IButton";
import QuantitySelector from "../../QuantitySelector";
import { ItemCard, ItemImageWithFallback, IText } from "../../styled";
import UnitSelector from "../../UnitSelector";
import { Ingredient } from "./BrowseTab";

interface SelectedIngredientItem extends Ingredient {
  id: string; // unique identifier for this instance in the list
  quantity: number;
  selectedUnit: string;
  purchaseDate: string;
  dateToExpire: number;
  price: string;
}

interface ListTabProps {
  selectedIngredients: Ingredient[];
  onRemoveIngredient: (ingredientId: string) => void;
  onClose: () => void;
}

const ListTab = ({
  selectedIngredients,
  onRemoveIngredient,
  onClose,
}: ListTabProps) => {
  const [items, setItems] = useState<SelectedIngredientItem[]>(
    selectedIngredients.map((ing, idx) => ({
      ...ing,
      id: `${ing._id}-${idx}-${Date.now()}`,
      quantity: 1,
      selectedUnit: "",
      purchaseDate: "",
      dateToExpire: ing.defaultExpireDays,
      price: "0",
    }))
  );

  const [creatingIds, setCreatingIds] = useState<Set<string>>(new Set());
  const { mutate: createItem } = useCreateFridgeItem();
  //   const { showSnackBar } = useSnackBar();

  const handleQuantityChange = useCallback(
    (id: string, newQuantity: number) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    },
    []
  );

  const handleUnitChange = useCallback((id: string, newUnit: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selectedUnit: newUnit } : item
      )
    );
  }, []);

  const handlePurchaseDateChange = useCallback((id: string, date: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, purchaseDate: date } : item
      )
    );
  }, []);

  const handleDateToExpireChange = useCallback((id: string, days: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, dateToExpire: days } : item
      )
    );
  }, []);

  const handlePriceChange = useCallback((id: string, priceStr: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price: priceStr } : item))
    );
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleAddItem = useCallback(
    (item: SelectedIngredientItem) => {
      if (!item.selectedUnit || !item.dateToExpire) {
        // showSnackBar("Please fill in all required fields", "warning");
        return;
      }

      setCreatingIds((prev) => new Set([...prev, item.id]));

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + item.dateToExpire);

      const createParams: CreateFridgeItemParams = {
        foodId: item._id,
        unitId: item.selectedUnit,
        quantity: item.quantity,
        purchaseDate: item.purchaseDate || undefined,
        expiryDate: expiryDate.toISOString().split("T")[0],
        price: parseFloat(item.price) || 0,
        status: "in-stock",
      };

      createItem(createParams, {
        onSuccess: () => {
          //   showSnackBar(
          //     `${item.name} added to fridge successfully!`,
          //     "success"
          //   );
          // Remove the item from list after successful creation
          handleRemoveItem(item.id);
        },
        onError: (error) => {
          //   showSnackBar(
          //     `Failed to add ${item.name}: ${
          //       error instanceof Error ? error.message : "Unknown error"
          //     }`,
          //     "error"
          //   );
        },
        onSettled: () => {
          setCreatingIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(item.id);
            return newSet;
          });
        },
      });
    },
    // [createItem, showSnackBar, handleRemoveItem]
    [createItem, handleRemoveItem]
  );

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <IText>Select ingredients from Browse tab to continue</IText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {items.map((item) => {
          const isCreating = creatingIds.has(item.id);
          return (
            <ItemCard key={item.id} style={styles.itemPanel}>
              <View style={styles.panelHeader}>
                <View style={styles.itemInfo}>
                  <ItemImageWithFallback
                    source={item.imageURL}
                    style={styles.itemImage}
                  />
                  <IText semiBold size={14}>
                    {item.name}
                  </IText>
                </View>
                <IButton
                  variant="none"
                  onPress={() => handleRemoveItem(item.id)}
                  style={styles.removeButton}
                >
                  <Entypo name="trash" size={18} color="#000000B4" />
                </IButton>
                <IButton
                  variant="primary"
                  onPress={() => handleAddItem(item)}
                  style={styles.addButton}
                >
                  {isCreating ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <>
                      <Entypo name="plus" size={16} color="white" />
                      <IText semiBold color="white" size={12}>
                        Done
                      </IText>
                    </>
                  )}
                </IButton>
              </View>

              <View style={styles.fieldRow}>
                <View style={styles.fieldGroup}>
                  <IText size={12} color="#666">
                    Quantity *
                  </IText>
                  <QuantitySelector
                    state={item.quantity}
                    setState={(setterOrValue) => {
                      const newQuantity =
                        typeof setterOrValue === "function"
                          ? setterOrValue(item.quantity)
                          : setterOrValue;
                      handleQuantityChange(item.id, newQuantity);
                    }}
                  />
                </View>

                <View style={[styles.fieldGroup, styles.unitField]}>
                  <IText size={12} color="#666">
                    Unit *
                  </IText>
                  <UnitSelector
                    value={item.selectedUnit}
                    onChange={(unit) => handleUnitChange(item.id, unit)}
                    maxModalHeight="40%"
                    buttonStyle={{ height: 20 }}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <IText size={12} color="#666">
                    Days to Expire *
                  </IText>
                  <QuantitySelector
                    state={item.dateToExpire}
                    setState={(setterOrValue) => {
                      const newDays =
                        typeof setterOrValue === "function"
                          ? setterOrValue(item.dateToExpire)
                          : setterOrValue;
                      handleDateToExpireChange(item.id, newDays);
                    }}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <View style={styles.fieldGroup}>
                  <IText size={12} color="#666">
                    Purchase Date (optional)
                  </IText>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={item.purchaseDate}
                    onChangeText={(date) =>
                      handlePurchaseDateChange(item.id, date)
                    }
                  />
                </View>
                <View style={styles.fieldGroup}>
                  <IText size={12} color="#666">
                    Price (total)
                  </IText>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    value={item.price}
                    onChangeText={(price) => handlePriceChange(item.id, price)}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>
            </ItemCard>
          );
        })}
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 0,
    paddingVertical: 8,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  itemPanel: {
    flexDirection: "column",
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  panelHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 4,
  },
  itemInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  removeButton: {
    padding: 6,
    borderRadius: 4,
  },
  fieldsContainer: {
    gap: 12,
  },
  fieldRow: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
  },
  fieldGroup: {
    flex: 1,
    gap: 6,
  },
  unitField: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "white",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: "#000000B4",
  },
  panelActions: {
    flexDirection: "row",
    gap: 8,
  },
  addButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  spacer: {
    height: 20,
  },
});

export default ListTab;
