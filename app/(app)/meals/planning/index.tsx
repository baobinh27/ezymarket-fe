import IButton from "@/components/IButton";
import AddItemModal from "@/components/meals/AddItemModal";
import WeekPicker from "@/components/meals/WeekPicker";
import {
  CardGroup,
  ItemCard,
  ItemImageWithFallback,
  IText,
} from "@/components/styled";
import useGetMealByDateRange from "@/hooks/meal/useGetMealByDateRange";
import { MealItem, MealType } from "@/types/types";
import { getFridgeItemImage } from "@/utils/getFridgeItemImage";
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

// const mockData: MealDay = {
//   breakfast: [
//     {
//       name: "Apple",
//       quantity: 1,
//       unit: "fruit",
//     },
//   ],
//   lunch: [
//     {
//       name: "Rice",
//       quantity: 2,
//       unit: "bowl",
//     },
//     {
//       name: "Egg",
//       quantity: 2,
//       unit: "piece",
//     },
//   ],
//   dinner: [
//     {
//       name: "Rice",
//       quantity: 2,
//       unit: "bowl",
//     },
//     {
//       name: "Egg",
//       quantity: 2,
//       unit: "piece",
//     },
//   ],
//   snacks: [
//     {
//       name: "Banana",
//       quantity: 3,
//       unit: "piece",
//     },
//   ],
// };

// type Dish = {
//   name: string;
//   quantity: number;
//   unit: string;
// };

// type MealDay = {
//   breakfast: Dish[];
//   lunch: Dish[];
//   dinner: Dish[];
//   snacks: Dish[];
// };

const MealPlanning = () => {
  const [isExpanded, setIsExpanded] = useState<MealEditType>({
    breakfast: false,
    lunch: false,
    dinner: false,
    snacks: false,
  });
  const [selectedMealType, setSelectedMealType] = useState<Meals | null>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isReady, setIsReady] = useState(false);

  const {
    data: mealDay,
    isFetching,
    refetch: fetchMealDay,
  } = useGetMealByDateRange({
    params: {
      startDate: `${selectedDate.year()}-${selectedDate.month() + 1}-${selectedDate.date()}`,
      endDate: `${selectedDate.year()}-${selectedDate.month() + 1}-${selectedDate.date()}`,
    },
    enabled: false,
  });

  // useEffect(() => {    
  //   // console.log("iso:", selectedDate.toISOString());
  //   const date = `${selectedDate.year()}-${selectedDate.month()}-${selectedDate.date()}`;
  //   console.log("date:", date);
    
  // }, [selectedDate])

  // useEffect(() => {
  //   console.log("mealDay =", mealDay);
  // }, [mealDay]);

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
      // const data = mealDay?.[0];
      // console.log("fetch:", data);
      
      setIsReady(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedDate, fetchMealDay]);

  const mealDayUI = useMemo(() => {
    // FUTURE: refine API calls to return the exact date
    const mealData = mealDay && mealDay.length > 0 ? mealDay.find(d => d.date.split("T")[0] === selectedDate.format("YYYY-MM-DD")) : null;

    console.log("mealData for", selectedDate.format("YYYY-MM-DD"), ":", mealData);
    
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
    setSelectedDate(dayjs());
  };

  const handleGoPrevWeek = () => {
    setSelectedDate(selectedDate.subtract(1, "week"));
  };

  const handleGoNextWeek = () => {
    setSelectedDate(selectedDate.add(1, "week"));
  };

  const handleDayPicking = (day: Dayjs) => {
    setSelectedDate(day);
  };

  const handleExpand = (meal: Meals) => {
    const updated = {
      ...isExpanded,
      [meal]: !isExpanded[meal],
    };
    setIsExpanded(updated);
  };

  const handleDeleteFoodItem = (meal: Meals, index: number) => {
    // setMealDay((prev) => ({
    //   ...prev,
    //   [meal]: prev[meal].filter((_, i) => i !== index),
    // }));
  };

  const handleOpenModal = useCallback((meal: Meals) => {
    setSelectedMealType(meal);
    bottomSheetRef.current?.present();
  }, []);

  // const handleCloseModal = () => {
  //     setShowAddItemModal(false);
  // }

  return (
    <View style={{ height: "100%" }}>
      {selectedMealType && (
        <AddItemModal
          ref={bottomSheetRef}
          mealType={selectedMealType}
          selectedDate={`${selectedDate.year()}-${selectedDate.month() + 1}-${selectedDate.date()}`}
        />
      )}

      <WeekPicker
        currentDate={selectedDate}
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
                          <ItemImageWithFallback
                            source={getFridgeItemImage(meal.data[0])}
                          />
                        )}
                        {meal.data[1] && (
                          <ItemImageWithFallback
                            source={getFridgeItemImage(meal.data[1])}
                          />
                        )}
                        {meal.data.length === 3 && (
                          <ItemImageWithFallback
                            source={getFridgeItemImage(meal.data[2])}
                          />
                        )}
                        {meal.data.length > 3 && (
                          <View style={styles.iconSquare}>
                            <IText size={12} semiBold>{`+${
                              meal.data.length - 2
                            }`}</IText>
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
                        <MaterialCommunityIcons
                          name="playlist-check"
                          size={24}
                          color="white"
                        />
                      ) : (
                        <Feather name="edit-3" size={24} color="white" />
                      )}
                    </IButton>
                  </View>
                </ItemCard>

                {isExpanded[meal.expandedKey] && (
                  <ItemCard>
                    <View
                      style={{ flexDirection: "column", gap: 8, width: "100%" }}
                    >
                      {meal.data.map((mealItem: MealItem, index) => (
                        <View key={mealItem._id} style={styles.foodItem}>
                          <ItemImageWithFallback
                            source={
                              mealItem.ingredientId
                                ? mealItem.ingredientId.imageURL
                                : mealItem.recipeId?.imageUrl
                            }
                          />

                          <View style={{ flexDirection: "column", gap: 4 }}>
                            <IText semiBold>
                              {mealItem.itemType === "ingredient"
                                ? mealItem.ingredientId?.name
                                : mealItem.recipeId?.title}
                            </IText>
                            <IText size={11}>
                              {mealItem.quantity} {mealItem.unitId.abbreviation}
                            </IText>
                          </View>

                          <IButton
                            style={[styles.iconButton, styles.placeEnd]}
                            onPress={() =>
                              handleDeleteFoodItem(meal.key, index)
                            }
                          >
                            <Feather
                              name="trash-2"
                              size={24}
                              color="#000000B4"
                            />
                          </IButton>
                        </View>
                      ))}

                      <View style={styles.foodItem}>
                        <IButton
                          style={styles.iconButton}
                          onPress={() => handleOpenModal(meal.key)}
                        >
                          <Entypo name="plus" size={24} color="#000000B4" />
                        </IButton>
                        <IText size={12}>
                          Add a dish or an item
                        </IText>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "white",
    borderRadius: 6,
    color: "#000000B4",
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
});

export default MealPlanning;
