import IButton from "@/components/IButton";
import AddItemModal from "@/components/meals/AddItemModal";
import ConfirmDeleteModal from "@/components/meals/ConfirmDeleteModal";
import MissingItemModal from "@/components/meals/MissingItemModal";
import PlanningAddItemModal from "@/components/meals/PlanningAddItemModal";
import WeekPicker from "@/components/meals/WeekPicker";
import { CardGroup, ItemCard, ItemImageWithFallback, IText } from "@/components/styled";
import useDeleteMealItem from "@/hooks/meal/useDeleteMealItem";
import useGetMealByDateRange from "@/hooks/meal/useGetMealByDateRange";
import { useMarkMealItemAsEaten } from "@/hooks/meal/useMarkMealItemAsEaten";
import { MealItem, MealType } from "@/types/types";
import { getFridgeItemImage } from "@/utils/getFridgeItemImage";
import { getDateFormat } from "@/utils/utils";
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

enum Meals {
  Breakfast = "breakfast",
  Lunch = "lunch",
  Dinner = "dinner",
  Snacks = "snacks",
}

type MealEditType = {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  snacks: boolean;
};

const MealPlanning = () => {
  const [isExpanded, setIsExpanded] = useState<MealEditType>({
    breakfast: false,
    lunch: false,
    dinner: false,
    snacks: false,
  });
  const [selectedMealType, setSelectedMealType] = useState<Meals | null>(null);
  const fridgeModalRef = useRef<BottomSheetModal>(null);
  const planningModalRef = useRef<BottomSheetModal>(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [viewingWeekDate, setViewingWeekDate] = useState(dayjs());
  const [isReady, setIsReady] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    itemId: string;
    itemName: string;
    mealType: MealType;
  } | null>(null);
  const [missingItemModal, setMissingItemModal] = useState<{
    visible: boolean;
    itemId: string;
    itemName: string;
  } | null>(null);

  const {
    data: mealDay,
    isFetching,
    refetch: fetchMealDay,
  } = useGetMealByDateRange({
    params: {
      startDate: getDateFormat(selectedDate),
      endDate: getDateFormat(selectedDate),
    },
    enabled: false,
  });

  const { mutateAsync: deleteMealItem, isPending: isDeleting } = useDeleteMealItem();

  const { mutateAsync: markMealItemAsEaten, isPending: isMarkingAsEaten } =
    useMarkMealItemAsEaten();

  // useEffect(() => {
  //   // console.log("iso:", selectedDate.toISOString());
  //   const date = `${selectedDate.year()}-${selectedDate.month()}-${selectedDate.date()}`;
  //   console.log("date:", date);

  // }, [selectedDate])

  // useEffect(() => {
  //   if (!isFetching) console.log("mealDay =", mealDay);
  // }, [isFetching, mealDay]);

  useEffect(() => {
    setIsReady(false);
    setIsExpanded({
      breakfast: false,
      lunch: false,
      dinner: false,
      snacks: false,
    });
    const timer = setTimeout(async () => {
      await fetchMealDay();
      setIsReady(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedDate, fetchMealDay]);

  const mealDayUI = useMemo(() => {
    // FUTURE: refine API calls to return the exact date
    const mealData =
      mealDay && mealDay.length > 0
        ? mealDay.find((d) => d.date.split("T")[0] === selectedDate.format("YYYY-MM-DD"))
        : null;

    // console.log("mealData for", selectedDate.format("YYYY-MM-DD"), ":", mealData);

    const getMealItems = (mealType: MealType) => {
      if (!mealData) return [];
      const meal = mealData.meals.find((m) => m.mealType === mealType);
      return meal?.items || [];
    };

    return [
      {
        key: Meals.Breakfast,
        label: "Breakfast",
        icon: <Feather name="sunrise" size={24} />,
        expandedKey: "breakfast",
        data: getMealItems("breakfast"),
      },
      {
        key: Meals.Lunch,
        label: "Lunch",
        icon: <Feather name="sun" size={24} />,
        expandedKey: "lunch",
        data: getMealItems("lunch"),
      },
      {
        key: Meals.Dinner,
        label: "Dinner",
        icon: <Feather name="moon" size={24} />,
        expandedKey: "dinner",
        data: getMealItems("dinner"),
      },
      {
        key: Meals.Snacks,
        label: "Snacks",
        icon: <Feather name="sunrise" size={24} />,
        expandedKey: "snacks",
        data: getMealItems("snacks"),
      },
    ] as const;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mealDay]);

  const handleGoToday = () => {
    const today = dayjs();
    setSelectedDate(today);
    setViewingWeekDate(today);
  };

  const handleGoPrevWeek = () => {
    setViewingWeekDate(viewingWeekDate.subtract(1, "week"));
  };

  const handleGoNextWeek = () => {
    setViewingWeekDate(viewingWeekDate.add(1, "week"));
  };

  const handleDayPicking = (day: Dayjs) => {
    setSelectedDate(day);
    setViewingWeekDate(day);
  };

  const handleExpand = (meal: Meals) => {
    const updated = {
      ...isExpanded,
      [meal]: !isExpanded[meal],
    };
    setIsExpanded(updated);
  };

  const handleDeleteFoodItem = (itemId: string, itemName: string, mealType: MealType) => {
    setDeleteTarget({ itemId, itemName, mealType });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    await deleteMealItem(deleteTarget.itemId, {
      onSuccess: async () => {
        setDeleteTarget(null);
        await fetchMealDay();
      },
      onError: () => {
        setDeleteTarget(null);
      },
    });
  };

  const handleOpenModal = useCallback(
    (meal: Meals) => {
      setSelectedMealType(meal);

      // Determine if the selected date is today or has passed
      const isFutureDate = selectedDate.isAfter(dayjs());

      if (isFutureDate) {
        planningModalRef.current?.present();
      } else {
        fridgeModalRef.current?.present();
      }
    },
    [selectedDate]
  );

  const handleUseMealItem = async (mealItem: MealItem) => {
    try {
      await markMealItemAsEaten({
        itemId: mealItem._id,
        forceEat: false,
      });
      await fetchMealDay();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      const itemName =
        mealItem.itemType === "ingredient"
          ? mealItem.ingredientId?.name || "Item"
          : mealItem.recipeId?.title || "Item";
      setMissingItemModal({
        visible: true,
        itemId: mealItem._id,
        itemName,
      });
    }
  };

  // const handleCloseModal = () => {
  //     setShowAddItemModal(false);
  // }

  return (
    <View style={{ height: "100%" }}>
      {selectedMealType && (
        <>
          <AddItemModal
            ref={fridgeModalRef}
            mealType={selectedMealType}
            selectedDate={getDateFormat(selectedDate)}
            onItemsAdded={fetchMealDay}
            isFutureDate={false}
          />
          <PlanningAddItemModal
            ref={planningModalRef}
            mealType={selectedMealType}
            selectedDate={getDateFormat(selectedDate)}
            onItemsAdded={fetchMealDay}
          />
        </>
      )}

      <ConfirmDeleteModal
        visible={deleteTarget !== null}
        itemName={deleteTarget?.itemName || ""}
        mealType={deleteTarget?.mealType}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />

      {missingItemModal && (
        <MissingItemModal
          visible={missingItemModal.visible}
          itemName={missingItemModal.itemName}
          onCancel={() => setMissingItemModal(null)}
          onConfirm={async () => {
            try {
              await markMealItemAsEaten({
                itemId: missingItemModal.itemId,
                forceEat: true,
              });
              setMissingItemModal(null);
              await fetchMealDay();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error: any) {
              setMissingItemModal(null);
            }
          }}
          isLoading={isMarkingAsEaten}
        />
      )}

      <WeekPicker
        currentDate={viewingWeekDate}
        selectedDate={selectedDate}
        onGoNextWeek={handleGoNextWeek}
        onGoPrevWeek={handleGoPrevWeek}
        onGoToday={handleGoToday}
        onDayPicking={handleDayPicking}
      />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          gap: 16,
        }}
      >
        {isFetching || !isReady ? (
          <View>
            <ActivityIndicator color="#82CD47" />
          </View>
        ) : (
          <>
            {mealDayUI.map((meal) => (
              <CardGroup key={meal.key}>
                <ItemCard>
                  <View style={styles.mealActionGroup}>
                    <View style={styles.iconSquare}>{meal.icon}</View>
                    <IText semiBold>{meal.label}</IText>
                  </View>

                  <View style={styles.mealActionGroup}>
                    {!isExpanded[meal.expandedKey] && (
                      <>
                        {meal.data[0] && (
                          <View style={styles.previewItemContainer}>
                            <ItemImageWithFallback source={getFridgeItemImage(meal.data[0])} />
                            {meal.data[0].isEaten && (
                              <View style={styles.eatenBadge}>
                                <Feather name="check" size={12} color="white" />
                              </View>
                            )}
                          </View>
                        )}
                        {meal.data[1] && (
                          <View style={styles.previewItemContainer}>
                            <ItemImageWithFallback source={getFridgeItemImage(meal.data[1])} />
                            {meal.data[1].isEaten && (
                              <View style={styles.eatenBadge}>
                                <Feather name="check" size={12} color="white" />
                              </View>
                            )}
                          </View>
                        )}
                        {meal.data.length === 3 && (
                          <View style={styles.previewItemContainer}>
                            <ItemImageWithFallback source={getFridgeItemImage(meal.data[2])} />
                            {meal.data[2].isEaten && (
                              <View style={styles.eatenBadge}>
                                <Feather name="check" size={12} color="white" />
                              </View>
                            )}
                          </View>
                        )}
                        {meal.data.length > 3 && (
                          <View style={styles.iconSquare}>
                            <IText size={12} semiBold>{`+${meal.data.length - 2}`}</IText>
                          </View>
                        )}
                      </>
                    )}
                    <IButton
                      variant="primary"
                      onPress={() => handleExpand(meal.key)}
                      style={styles.iconButton}
                    >
                      {isExpanded[meal.expandedKey] ? (
                        <MaterialCommunityIcons name="playlist-check" size={24} color="white" />
                      ) : (
                        <Feather name="edit-3" size={24} color="white" />
                      )}
                    </IButton>
                  </View>
                </ItemCard>

                {isExpanded[meal.expandedKey] && (
                  <ItemCard>
                    <View style={{ flexDirection: "column", gap: 8, width: "100%" }}>
                      {meal.data.map((mealItem: MealItem, index) => {
                        const isFutureDate = selectedDate.isAfter(dayjs());
                        const isEaten = mealItem.isEaten;

                        return (
                          <View key={mealItem._id} style={styles.foodItem}>
                            <ItemImageWithFallback
                              source={
                                mealItem.ingredientId
                                  ? mealItem.ingredientId.imageURL
                                  : mealItem.recipeId?.imageUrl
                              }
                            />

                            <View style={{ flexDirection: "column", gap: 4 }}>
                              <View
                                style={{ flexDirection: "row", gap: 4, alignItems: "flex-end" }}
                              >
                                <IText semiBold>
                                  {mealItem.itemType === "ingredient"
                                    ? mealItem.ingredientId?.name
                                    : mealItem.recipeId?.title}
                                </IText>
                                <IButton
                                  variant={isEaten ? "primary" : "secondary"}
                                  style={styles.chip}
                                >
                                  <IText size={10} color={isEaten ? "white" : "#82CD47"}>
                                    {isEaten ? "Done" : "Not Eaten"}
                                  </IText>
                                </IButton>
                              </View>
                              <IText size={11}>
                                {mealItem.quantity} {mealItem.unitId.abbreviation}
                              </IText>
                            </View>

                            <View
                              style={[
                                styles.placeEnd,
                                { flexDirection: "row", gap: 8, alignItems: "center" },
                              ]}
                            >
                              {isFutureDate && !isEaten && (
                                <IButton
                                  variant="primary"
                                  style={[
                                    styles.iconButton,
                                    { paddingHorizontal: 10, paddingVertical: 6 },
                                  ]}
                                  onPress={() => handleUseMealItem(mealItem)}
                                  disabled={isMarkingAsEaten}
                                >
                                  <IText size={11} semiBold color="white">
                                    {isMarkingAsEaten ? "..." : "Use"}
                                  </IText>
                                </IButton>
                              )}
                              <IButton
                                style={[styles.iconButton]}
                                onPress={() => {
                                  const itemName =
                                    mealItem.itemType === "ingredient"
                                      ? mealItem.ingredientId?.name || "Item"
                                      : mealItem.recipeId?.title || "Item";
                                  handleDeleteFoodItem(mealItem._id, itemName, meal.key);
                                }}
                              >
                                <Feather name="trash-2" size={24} color="#000000B4" />
                              </IButton>
                            </View>
                          </View>
                        );
                      })}

                      <View style={styles.foodItem}>
                        <IButton
                          style={styles.iconButton}
                          onPress={() => handleOpenModal(meal.key)}
                        >
                          <Entypo name="plus" size={24} color="#000000B4" />
                        </IButton>
                        <IText size={12}>Add a dish or an item</IText>
                      </View>
                    </View>
                  </ItemCard>
                )}
              </CardGroup>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mealActionGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconSquare: {
    // padding: 6,
    height: 36,
    width: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 6,
    color: "#000000B4",
  },
  previewItemContainer: {
    position: "relative",
  },
  eatenBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#82CD47",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  iconButton: {
    padding: 6,
    borderRadius: 6,
  },
  foodItem: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 12,
  },
  placeEnd: {
    position: "absolute",
    right: 0,
  },
  chip: {
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});

export default MealPlanning;
