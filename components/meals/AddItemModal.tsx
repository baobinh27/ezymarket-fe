import { GetAllFridgeItemsParams } from "@/api/fridge";
import { useGetAllFridgeItems } from "@/hooks/fridge/useGetAllFridgeItems";
import useCreateMealItem from "@/hooks/meal/useCreateMealItem";
import useCreateMealItemBulk from "@/hooks/meal/useCreateMealItemBulk";
import { useMarkMealItemAsEaten } from "@/hooks/meal/useMarkMealItemAsEaten";
import { useSnackBar } from "@/services/auth/snackbar.context";
import { FridgeItem, MealType } from "@/types/types";
import { getFridgeItemImage, getFridgeItemName } from "@/utils/getFridgeItemImage";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import { Ref, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import IBottomSheetModal from "../IBottomSheetModal";
import IButton from "../IButton";
import QuantitySelector from "../QuantitySelector";
import SearchBar from "../SearchBar";
import { ItemCard, ItemImageWithFallback, IText } from "../styled";

type AddItemModalProps = {
  ref: Ref<any>;
  mealType: MealType;
  selectedDate: string;
  onItemsAdded?: () => Promise<any>;
  isFutureDate?: boolean;
};

const AddItemModal = ({ 
  ref, 
  mealType, 
  selectedDate, 
  onItemsAdded,
  isFutureDate = false 
}: AddItemModalProps) => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [hasModalLoaded, setHasModalLoaded] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { showSnackBar } = useSnackBar();

  const params = useMemo(
    () => ({
      sortBy: "expiryDate_desc",
      search: searchInput,
    }),
    [searchInput]
  ) as GetAllFridgeItemsParams;

  const {
    data,
    isFetching,
    isError,
    refetch: fetchItems,
  } = useGetAllFridgeItems({
    params,
    enabled: false,
  }) as any;

  useEffect(() => {
    console.log("fridge items:", data);
  }, [data]);

  const { mutateAsync: createMealItem, isPending: createMealItemIsPending } = useCreateMealItem();
  const { mutateAsync: createMealItemBulk, isPending: createMealItemBulkIsPending } =
    useCreateMealItemBulk();
  const { mutateAsync: markMealItemAsEaten } = useMarkMealItemAsEaten();

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      await fetchItems();
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchInput, fetchItems]);

  const handleGoFridge = () => {
    router.push("/(app)/fridge");
  };

  const handleChangeSearchInput = (newValue: string) => {
    setSearchInput(newValue);
  };

  const handleSelectItem = (item: FridgeItem) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(item._id)) {
        newMap.delete(item._id);
      } else {
        newMap.set(item._id, 1);
      }
      return newMap;
    });
  };

  const handleQuantityChange = (itemId: string, newValue: number) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      if (newValue > 0) {
        newMap.set(itemId, newValue);
      } else {
        newMap.delete(itemId);
      }
      return newMap;
    });
  };

  const bottomSheetRef = useRef<any>(null);

  const handleAddSingleItem = async (item: FridgeItem) => {
    try {
      const quantity = selectedItems.get(item._id) || 1;

      const response = await createMealItem({
        itemType: "ingredient",
        quantity,
        ingredientId: item.foodId?._id,
        unitId: item.unitId?._id,
        recipeId: item.recipeId?._id,
        date: selectedDate,
        mealType,
      });

      console.log("createMealItem response:", response);

      // If not a future date, mark as eaten immediately
      if (!isFutureDate && response) {
        const mealItemId = response.item._id || response.id;
        if (mealItemId) {
          await markMealItemAsEaten({ itemId: mealItemId });
        }
      }

      setSelectedItems((prev) => {
        const newMap = new Map(prev);
        newMap.delete(item._id);
        return newMap;
      });
      showSnackBar(`${getFridgeItemName(item)} added to ${mealType}!`, "success");

      if (onItemsAdded) {
        await onItemsAdded();
      }

      await fetchItems();
    } catch (error) {
      showSnackBar("Failed to add item: " + error, "error");
    }
  };

  const handleAddAllItems = async () => {
    try {
      const items = Array.from(selectedItems.entries()).map(([itemId, quantity]) => {
        const item = data?.items.find((i: FridgeItem) => i._id === itemId);
        return {
          itemType: "ingredient" as const,
          quantity,
          ingredientId: item?.foodId._id,
          unitId: item?.unitId._id,
        };
      });

      const response = await createMealItemBulk({
        date: selectedDate,
        mealType,
        items,
      });

      console.log("createMealItemBulk response:", response);

      // If not a future date, mark all as eaten immediately
      if (!isFutureDate && response) {
        const itemsToMark = response.items || response;
        if (Array.isArray(itemsToMark)) {
          for (const mealItem of itemsToMark) {
            const mealItemId = mealItem._id || mealItem.id;
            if (mealItemId) {
              await markMealItemAsEaten({ itemId: mealItemId });
            }
          }
        }
      }

      setSelectedItems(new Map());
      bottomSheetRef?.current?.close();
      showSnackBar(`All items added to ${mealType}!`, "success");

      if (onItemsAdded) {
        await onItemsAdded();
      }

      await fetchItems();
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
  const showRefetchLoading = isFetching;

  useImperativeHandle(ref, () => bottomSheetRef.current);

  return (
    <IBottomSheetModal
      title="Choose from Fridge"
      ref={bottomSheetRef}
      snapPoints={["70%"]}
      onChange={async (index: number) => {
        if (index === 0) {
          setHasModalLoaded(true);
          await fetchItems();
        }
      }}
      onClose={handleCloseModal}
    >
      {showInitialLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      ) : isError ? (
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
          ) : data && Array.isArray(data.items) && data.items.length === 0 ? (
            <>
              <IText>
                Your fridge is empty. You might want to have something in your fridge before using
                them.
              </IText>
              <IButton variant="secondary" onPress={handleGoFridge} style={styles.goToFridgeBtn}>
                <IText semiBold color="#46982D">
                  Go to Fridge
                </IText>
              </IButton>
            </>
          ) : data && Array.isArray(data.items) && data.items.length !== 0 ? (
            <>
              {data.items.map((item: FridgeItem) => {
                const isSelected = selectedItems.has(item._id);
                const selectedQuantity = selectedItems.get(item._id) || 1;
                return (
                  <ItemCard key={item._id} style={isSelected && styles.selectedItem}>
                    <View style={styles.leftGroup}>
                      <ItemImageWithFallback source={getFridgeItemImage(item)} />
                      <View>
                        <IText semiBold>{getFridgeItemName(item)}</IText>
                        <IText size={11}>
                          {item.quantity} {item.unitId?.abbreviation || "servings"} available
                        </IText>
                      </View>
                    </View>

                    <View style={styles.rightGroup}>
                      {isSelected && (
                        <View>
                          <IText size={11}>Amount to use</IText>
                          <QuantitySelector
                            state={selectedQuantity}
                            setState={(setterOrValue) => {
                              const newQuantity =
                                typeof setterOrValue === "function"
                                  ? setterOrValue(selectedQuantity)
                                  : setterOrValue;
                              handleQuantityChange(item._id, newQuantity);
                            }}
                            maxState={item.quantity}
                          />
                        </View>
                      )}
                      <View style={styles.buttonGroup}>
                        {isSelected && (
                          <IButton
                            variant="primary"
                            style={[styles.addButton, styles.addToMealButton]}
                            onPress={() => handleAddSingleItem(item)}
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
                          onPress={() => handleSelectItem(item)}
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
          ) : null}
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
  goToFridgeBtn: {
    paddingVertical: 8,
    borderRadius: 6,
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
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-end",
    marginLeft: "auto",
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

export default AddItemModal;
//   const [searchInput, setSearchInput] = useState<string>("");
//   const [hasModalLoaded, setHasModalLoaded] = useState(false);
//   const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());
//   const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const { showSnackBar } = useSnackBar();

//   const params = useMemo(
//     () => ({
//       sortBy: "expiryDate_desc",
//       search: searchInput,
//     }),
//     [searchInput]
//   ) as GetAllFridgeItemsParams;

//   const {
//     data,
//     isFetching,
//     isError,
//     refetch: fetchItems,
//   } = useGetAllFridgeItems({
//     params,
//     enabled: false,
//   }) as any;

//   useEffect(() => {
//     console.log("fridge items:", data);
//   }, [data]);

//   const { mutateAsync: createMealItem, isPending: createMealItemIsPending } = useCreateMealItem();

//   const { mutateAsync: createMealItemBulk, isPending: createMealItemBulkIsPending } =
//     useCreateMealItemBulk();

//   useEffect(() => {
//     if (debounceTimerRef.current) {
//       clearTimeout(debounceTimerRef.current);
//     }

//     debounceTimerRef.current = setTimeout(async () => {
//       await fetchItems();
//     }, 300);

//     return () => {
//       if (debounceTimerRef.current) {
//         clearTimeout(debounceTimerRef.current);
//       }
//     };
//   }, [searchInput, fetchItems]);

//   const handleGoFridge = () => {
//     // TODO: close the modal
//     router.push("/(app)/fridge");
//   };

//   const handleChangeSearchInput = (newValue: string) => {
//     setSearchInput(newValue);
//   };

//   const handleSelectItem = (item: FridgeItem) => {
//     setSelectedItems((prev) => {
//       const newMap = new Map(prev);
//       if (newMap.has(item._id)) {
//         newMap.delete(item._id);
//       } else {
//         newMap.set(item._id, 1);
//       }
//       return newMap;
//     });
//   };

//   const handleQuantityChange = (itemId: string, newValue: number) => {
//     setSelectedItems((prev) => {
//       const newMap = new Map(prev);
//       if (newValue > 0) {
//         newMap.set(itemId, newValue);
//       } else {
//         newMap.delete(itemId);
//       }
//       return newMap;
//     });
//   };

//   const bottomSheetRef = useRef<any>(null);

//   const handleAddSingleItem = async (item: FridgeItem) => {
//     try {
//       const quantity = selectedItems.get(item._id) || 1;

//       await createMealItem({
//         itemType: "ingredient",
//         quantity,
//         ingredientId: item.foodId._id,
//         unitId: item.unitId._id,
//         date: selectedDate,
//         recipeId: "",
//         mealType,
//       });
//       console.log("adding");
//       setSelectedItems((prev) => {
//         const newMap = new Map(prev);
//         newMap.delete(item._id);
//         return newMap;
//       });
//       showSnackBar(`${item.foodId.name} added to ${mealType}!`, "success");

//       // Refetch meal plan data after successful addition
//       if (onItemsAdded) {
//         await onItemsAdded();
//       }

//       // Refetch fridge items to update quantities
//       await fetchItems();
//     } catch (error) {
//       showSnackBar("Failed to add item: " + error, "error");
//     }
//   };

//   const handleAddAllItems = async () => {
//     try {
//       const items = Array.from(selectedItems.entries()).map(([itemId, quantity]) => {
//         const item = data?.items.find((i: FridgeItem) => i._id === itemId);
//         return {
//           itemType: "ingredient" as const,
//           quantity,
//           ingredientId: item?.foodId._id,
//           unitId: item?.unitId._id,
//         };
//       });

//       await createMealItemBulk({
//         date: selectedDate,
//         mealType,
//         items,
//       });
//       setSelectedItems(new Map());
//       bottomSheetRef?.current?.close();
//       showSnackBar(`All items added to ${mealType}!`, "success");

//       // Refetch meal plan data after successful addition
//       if (onItemsAdded) {
//         await onItemsAdded();
//       }

//       // Refetch fridge items to update quantities
//       await fetchItems();
//     } catch (error) {
//       showSnackBar("Failed to add items: " + error, "error");
//     }
//   };

//   const handleCloseModal = () => {
//     setHasModalLoaded(false);
//     setSearchInput("");
//     setSelectedItems(new Map());
//   };

//   const showInitialLoading = !hasModalLoaded;
//   const showRefetchLoading = isFetching;

//   useImperativeHandle(ref, () => bottomSheetRef.current);

//   return (
//     <IBottomSheetModal
//       title="Choose from Fridge"
//       ref={bottomSheetRef}
//       snapPoints={["70%"]}
//       // calls only if the sheet is open
//       onChange={async (index: number) => {
//         if (index === 0) {
//           setHasModalLoaded(true);
//           await fetchItems();
//         }
//       }}
//       onClose={handleCloseModal}
//     >
//       {showInitialLoading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#22C55E" />
//         </View>
//       ) : isError ? (
//         <View style={styles.loadingContainer}>
//           <View style={styles.errorBox}>
//             <Entypo name="circle-with-cross" size={24} />
//             <IText style={styles.errorText}>Something went wrong. Please try again later.</IText>
//           </View>
//         </View>
//       ) : (
//         <View style={styles.content}>
//           <SearchBar value={searchInput} onChangeText={handleChangeSearchInput} />
//           {showRefetchLoading ? (
//             <View>
//               <ActivityIndicator color="#82CD47" />
//             </View>
//           ) : data && Array.isArray(data.items) && data.items.length === 0 ? (
//             <>
//               <IText>
//                 Your fridge is empty. You might want to have something in your fridge before using
//                 them.
//               </IText>
//               <IButton variant="secondary" onPress={handleGoFridge} style={styles.goToFridgeBtn}>
//                 <IText semiBold color="#46982D">
//                   Go to Fridge
//                 </IText>
//               </IButton>
//             </>
//           ) : data && Array.isArray(data.items) && data.items.length !== 0 ? (
//             <>
//               {data.items.map((item: FridgeItem) => {
//                 const isSelected = selectedItems.has(item._id);
//                 const selectedQuantity = selectedItems.get(item._id) || 1;
//                 return (
//                   <ItemCard key={item._id} style={isSelected && styles.selectedItem}>
//                     <View style={styles.leftGroup}>
//                       <ItemImageWithFallback source={item.foodId.imageURL} />
//                       <View>
//                         <IText semiBold>{item.foodId.name}</IText>
//                         <IText size={11}>
//                           {item.quantity} {item.unitId.abbreviation} available
//                         </IText>
//                       </View>
//                     </View>

//                     <View style={styles.rightGroup}>
//                       {isSelected && (
//                         <View>
//                           <IText size={11}>Amount to use</IText>
//                           <QuantitySelector
//                             state={selectedQuantity}
//                             setState={(setterOrValue) => {
//                               const newQuantity =
//                                 typeof setterOrValue === "function"
//                                   ? setterOrValue(selectedQuantity)
//                                   : setterOrValue;
//                               handleQuantityChange(item._id, newQuantity);
//                             }}
//                             maxState={item.quantity}
//                           />
//                         </View>
//                       )}
//                       <View style={styles.buttonGroup}>
//                         {isSelected && (
//                           <IButton
//                             variant="primary"
//                             style={[styles.addButton, styles.addToMealButton]}
//                             onPress={() => handleAddSingleItem(item)}
//                             disabled={createMealItemIsPending}
//                           >
//                             <IText semiBold size={11} color="white">
//                               {createMealItemIsPending ? "Adding..." : "Add"}
//                             </IText>
//                           </IButton>
//                         )}
//                         <IButton
//                           variant="none"
//                           style={styles.addButton}
//                           onPress={() => handleSelectItem(item)}
//                         >
//                           <Entypo
//                             name={isSelected ? "minus" : "plus"}
//                             size={24}
//                             color={isSelected ? "#ff7777" : "#82CD47"}
//                           />
//                         </IButton>
//                       </View>
//                     </View>
//                   </ItemCard>
//                 );
//               })}
//               {selectedItems.size > 0 && (
//                 <IButton
//                   variant="primary"
//                   style={styles.addAllButton}
//                   onPress={handleAddAllItems}
//                   disabled={createMealItemBulkIsPending}
//                 >
//                   <IText semiBold color="white">
//                     {createMealItemBulkIsPending
//                       ? "Adding All..."
//                       : `Add All (${selectedItems.size} items)`}
//                   </IText>
//                 </IButton>
//               )}
//             </>
//           ) : null}
//         </View>
//       )}
//     </IBottomSheetModal>
//   );
// };

// const styles = StyleSheet.create({
//   content: {
//     flexDirection: "column",
//     gap: 12,
//   },
//   loadingContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   errorBox: {
//     flexDirection: "column",
//     gap: 16,
//     justifyContent: "center",
//     alignItems: "center",
//     width: "100%",
//     backgroundColor: "#ff00004B",
//     padding: 8,
//     borderRadius: 8,
//   },
//   errorText: {
//     textAlign: "center",
//   },
//   goToFridgeBtn: {
//     paddingVertical: 8,
//     borderRadius: 6,
//   },
//   selectedItem: {
//     backgroundColor: "#F0F7F0",
//     borderLeftWidth: 3,
//     borderLeftColor: "#4CAF50",
//   },
//   leftGroup: {
//     flexDirection: "row",
//     gap: 12,
//     alignItems: "center",
//   },
//   rightGroup: {
//     flexDirection: "row",
//     gap: 8,
//     alignItems: "flex-end",
//     marginLeft: "auto",
//   },
//   addButton: {
//     marginLeft: 8,
//     padding: 4,
//     borderRadius: 6,
//   },
//   buttonGroup: {
//     flexDirection: "row",
//     gap: 8,
//     alignItems: "center",
//   },
//   addToMealButton: {
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     marginLeft: 0,
//   },
//   addAllButton: {
//     paddingVertical: 12,
//     marginTop: 8,
//     borderRadius: 6,
//   },
// });

// export default AddItemModal;
