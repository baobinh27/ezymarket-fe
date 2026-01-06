import { useGetAllIngredients } from "@/hooks/dictionary/useGetAllIngredients";
import { useGetAllRecipes } from "@/hooks/dictionary/useGetAllRecipes";
import useCreateMealItem from "@/hooks/meal/useCreateMealItem";
import useCreateMealItemBulk from "@/hooks/meal/useCreateMealItemBulk";
import { useSnackBar } from "@/services/auth/snackbar.context";
import { Ingredient, MealType, Recipe } from "@/types/types";
import { Entypo } from "@expo/vector-icons";
import { Ref, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import IBottomSheetModal from "../IBottomSheetModal";
import IButton from "../IButton";
import QuantitySelector from "../QuantitySelector";
import SearchBar from "../SearchBar";
import UnitSelector from "../UnitSelector";
import { ItemCard, ItemImageWithFallback, IText } from "../styled";

type PlanningAddItemModalProps = {
  ref: Ref<any>;
  mealType: MealType;
  selectedDate: string;
  onItemsAdded?: () => Promise<any>;
};

type SelectableItem = (Ingredient | Recipe) & { quantity?: number; type?: "ingredient" | "recipe" };

type SelectedItemEntry = {
  item: SelectableItem;
  quantity: number;
  unitId?: string;
};

const PlanningAddItemModal = ({
  ref,
  mealType,
  selectedDate,
  onItemsAdded,
}: PlanningAddItemModalProps) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [hasModalLoaded, setHasModalLoaded] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Map<string, SelectedItemEntry>>(
    new Map()
  );
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { showSnackBar } = useSnackBar();

  const {
    data: ingredientsData,
    isFetching: ingredientsFetching,
    isError: ingredientsError,
    refetch: refetchIngredients,
  } = useGetAllIngredients({
    search: searchInput,
    limit: 100,
  });

  const {
    data: recipesData,
    isFetching: recipesFetching,
    isError: recipesError,
    refetch: refetchRecipes,
  } = useGetAllRecipes({
    search: searchInput,
    limit: 100,
  });

  useEffect(() => {
    if (ingredientsData) console.log("ingredientsData:", ingredientsData);
    
  }, [ingredientsData])

  const { mutateAsync: createMealItem, isPending: createMealItemIsPending } = useCreateMealItem();
  const { mutateAsync: createMealItemBulk, isPending: createMealItemBulkIsPending } =
    useCreateMealItemBulk();

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      await refetchIngredients();
      await refetchRecipes();
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchInput, refetchIngredients, refetchRecipes]);

  const allItems = useMemo(() => {
    const ingredients = (ingredientsData?.ingredients || []).map((item: Ingredient) => ({
      ...item,
      type: "ingredient" as const,
    }));
    const recipes = (recipesData?.recipes || []).map((item: Recipe) => ({
      ...item,
      type: "recipe" as const,
    }));
    return [...ingredients, ...recipes];
  }, [ingredientsData, recipesData]);

  const handleChangeSearchInput = (newValue: string) => {
    setSearchInput(newValue);
  };

  const handleSelectItem = (item: SelectableItem, type: "ingredient" | "recipe") => {
    const itemKey = type === "ingredient" ? (item as Ingredient)._id : (item as Recipe)._id;
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(itemKey)) {
        newMap.delete(itemKey);
      } else {
        newMap.set(itemKey, {
          item: { ...item, type },
          quantity: 1,
          unitId: type === "ingredient" ? (item as any).defaultUnitId : undefined,
        });
      }
      return newMap;
    });
  };

  const handleQuantityChange = (itemKey: string, newValue: number) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      const entry = newMap.get(itemKey);
      if (entry && newValue > 0) {
        newMap.set(itemKey, { ...entry, quantity: newValue });
      } else {
        newMap.delete(itemKey);
      }
      return newMap;
    });
  };

  const handleUnitChange = (itemKey: string, newUnitId: string) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      const entry = newMap.get(itemKey);
      if (entry) {
        newMap.set(itemKey, { ...entry, unitId: newUnitId });
      }
      return newMap;
    });
  };

  const bottomSheetRef = useRef<any>(null);

  const handleAddSingleItem = async (item: SelectableItem, type: "ingredient" | "recipe") => {
    console.log(item);
    
    try {
      const itemKey = type === "ingredient" ? (item as Ingredient)._id : (item as Recipe)._id;
      const selectedEntry = selectedItems.get(itemKey);
      const quantity = selectedEntry?.quantity || 1;
      const unitId = selectedEntry?.unitId;

      if (!unitId) throw Error("Missing unit.")

      await createMealItem({
        itemType: type,
        quantity,
        ingredientId: type === "ingredient" ? (item as Ingredient)._id : undefined,
        recipeId: type === "recipe" ? (item as Recipe)._id : undefined,
        unitId: unitId,
        date: selectedDate,
        mealType,
      });

      const itemKey2 = type === "ingredient" ? (item as Ingredient)._id : (item as Recipe)._id;
      setSelectedItems((prev) => {
        const newMap = new Map(prev);
        newMap.delete(itemKey2);
        return newMap;
      });

      const itemName = type === "ingredient" ? (item as Ingredient).name : (item as Recipe).title;
      showSnackBar(`${itemName} added to ${mealType}!`, "success");

      if (onItemsAdded) {
        await onItemsAdded();
      }
    } catch (error) {
      showSnackBar(`${error}`, "error");
    }
  };

  const handleAddAllItems = async () => {
    try {
      const items = Array.from(selectedItems.values()).map(({ item, quantity, unitId }) => ({
        itemType: (item as any).type as "ingredient" | "recipe",
        quantity,
        ingredientId: (item as any).type === "ingredient" ? (item as Ingredient)._id : undefined,
        recipeId: (item as any).type === "recipe" ? (item as Recipe)._id : undefined,
        unitId:
          (item as any).type === "ingredient" ? unitId : undefined,
      }));

      await createMealItemBulk({
        date: selectedDate,
        mealType,
        items,
      });

      setSelectedItems(new Map());
      bottomSheetRef?.current?.close();
      showSnackBar(`All items added to ${mealType}!`, "success");

      if (onItemsAdded) {
        await onItemsAdded();
      }
    } catch (error) {
      showSnackBar("Failed to add items: " + error, "error");
    }
  };

  const handleCloseModal = () => {
    setHasModalLoaded(false);
    setSearchInput("");
    setSelectedItems(new Map());
  };

  const showInitialLoading = !hasModalLoaded;
  const showRefetchLoading = ingredientsFetching || recipesFetching;
  const hasError = ingredientsError || recipesError;

  useImperativeHandle(ref, () => bottomSheetRef.current);

  return (
    <IBottomSheetModal
      title="Add to Meal Plan"
      ref={bottomSheetRef}
      snapPoints={["70%"]}
      onChange={async (index: number) => {
        if (index === 0) {
          setHasModalLoaded(true);
          await refetchIngredients();
          await refetchRecipes();
        }
      }}
      onClose={handleCloseModal}
    >
      {showInitialLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      ) : hasError ? (
        <View style={styles.loadingContainer}>
          <View style={styles.errorBox}>
            <Entypo name="circle-with-cross" size={24} />
            <IText style={styles.errorText}>Something went wrong. Please try again later.</IText>
          </View>
        </View>
      ) : (
        <View style={styles.content}>
          <SearchBar value={searchInput} onChangeText={handleChangeSearchInput} />
          {showRefetchLoading ? (
            <View>
              <ActivityIndicator color="#82CD47" />
            </View>
          ) : allItems.length === 0 ? (
            <IText>No items found. Try searching for something else.</IText>
          ) : (
            <>
              {allItems.map((item: any) => {
                const itemKey = item._id;
                const isSelected = selectedItems.has(itemKey);
                const selectedQuantity = selectedItems.get(itemKey)?.quantity || 1;
                const isIngredient = "imageURL" in item;

                return (
                  <ItemCard key={itemKey} style={isSelected && styles.selectedItem}>
                    <View style={styles.leftGroup}>
                      <ItemImageWithFallback
                        source={isIngredient ? item.imageURL : item.imageUrl}
                      />
                      <View>
                        <IText semiBold>{isIngredient ? item.name : item.title}</IText>
                        {isIngredient && (
                          <IText size={11} color="#666">
                            Ingredient
                          </IText>
                        )}
                        {!isIngredient && (
                          <IText size={11} color="#666">
                            Recipe · {item.prepTime + item.cookTime || 0} min
                          </IText>
                        )}
                      </View>
                    </View>

                    <View style={styles.rightGroup}>
                      {isSelected && (
                        <View style={styles.selectorGroup}>
                          <View>
                            <IText size={11}>Quantity</IText>
                            <QuantitySelector
                              state={selectedQuantity}
                              setState={(setterOrValue) => {
                                const newQuantity =
                                  typeof setterOrValue === "function"
                                    ? setterOrValue(selectedQuantity)
                                    : setterOrValue;
                                handleQuantityChange(itemKey, newQuantity);
                              }}
                            />
                          </View>
                          {isIngredient && (
                            <View>
                              <IText size={11}>Unit</IText>
                              <UnitSelector
                                value={selectedItems.get(itemKey)?.unitId}
                                onChange={(unitId) => handleUnitChange(itemKey, unitId)}
                                placeholder="Select Unit"
                              />
                            </View>
                          )}
                        </View>
                      )}
                      <View style={styles.buttonGroup}>
                        {isSelected && (
                          <IButton
                            variant="primary"
                            style={[styles.addButton, styles.addToMealButton]}
                            onPress={() => handleAddSingleItem(item, isIngredient ? "ingredient" : "recipe")}
                            disabled={createMealItemIsPending}
                          >
                            <IText semiBold size={11} color="white">
                              {createMealItemIsPending ? "Adding..." : "Add"}
                            </IText>
                          </IButton>
                        )}
                        <IButton
                          variant="none"
                          style={styles.addButton}
                          onPress={() =>
                            handleSelectItem(item, isIngredient ? "ingredient" : "recipe")
                          }
                        >
                          <Entypo
                            name={isSelected ? "minus" : "plus"}
                            size={24}
                            color={isSelected ? "#ff7777" : "#82CD47"}
                          />
                        </IButton>
                      </View>
                    </View>
                  </ItemCard>
                );
              })}
              {selectedItems.size > 0 && (
                <IButton
                  variant="primary"
                  style={styles.addAllButton}
                  onPress={handleAddAllItems}
                  disabled={createMealItemBulkIsPending}
                >
                  <IText semiBold color="white">
                    {createMealItemBulkIsPending
                      ? "Adding All..."
                      : `Add All (${selectedItems.size} items)`}
                  </IText>
                </IButton>
              )}
            </>
          )}
        </View>
      )}
    </IBottomSheetModal>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: "column",
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorBox: {
    flexDirection: "column",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#ff00004B",
    padding: 8,
    borderRadius: 8,
  },
  errorText: {
    textAlign: "center",
  },
  selectedItem: {
    backgroundColor: "#F0F7F0",
    borderLeftWidth: 3,
    borderLeftColor: "#4CAF50",
  },
  leftGroup: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  rightGroup: {
    flexDirection: "column",
    gap: 8,
    alignItems: "flex-end",
    marginLeft: "auto",
  },
  selectorGroup: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-end",
  },
  addButton: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 6,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  addToMealButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 0,
  },
  addAllButton: {
    paddingVertical: 12,
    marginTop: 8,
    borderRadius: 6,
  },
});

export default PlanningAddItemModal;
