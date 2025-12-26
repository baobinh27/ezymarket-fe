import IButton from "@/components/IButton";
import AddItemModal from "@/components/meals/AddItemModal";
import WeekPicker from "@/components/meals/WeekPicker";
import { CardGroup, ItemCard, IText } from "@/components/styled";
import { useSnackBar } from "@/services/auth/snackbar.context";
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

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

const mockData: MealDay = {
  breakfast: [
    {
      name: "Apple",
      quantity: 1,
      unit: "fruit",
    },
  ],
  lunch: [
    {
      name: "Rice",
      quantity: 2,
      unit: "bowl",
    },
    {
      name: "Egg",
      quantity: 2,
      unit: "piece",
    },
  ],
  dinner: [
    {
      name: "Rice",
      quantity: 2,
      unit: "bowl",
    },
    {
      name: "Egg",
      quantity: 2,
      unit: "piece",
    },
  ],
  snacks: [
    {
      name: "Banana",
      quantity: 3,
      unit: "piece",
    },
  ],
};

type Dish = {
  name: string;
  quantity: number;
  unit: string;
};

type MealDay = {
  breakfast: Dish[];
  lunch: Dish[];
  dinner: Dish[];
  snacks: Dish[];
};

const MealPlanning = () => {
  const [isExpanded, setIsExpanded] = useState<MealEditType>({
    breakfast: false,
    lunch: false,
    dinner: false,
    snacks: false,
  });
  // const [showAddItemModal, setShowAddItemModal] = useState(false);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [mealDay, setMealDay] = useState<MealDay>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });

  const { showSnackBar } = useSnackBar();

  useEffect(() => {
    // fetch new data when user change date
    setMealDay(mockData);
    setIsExpanded({
      breakfast: false,
      lunch: false,
      dinner: false,
      snacks: false,
    });
  }, [selectedDate]);

  const mealDayUI = useMemo(
    () =>
      [
        {
          key: Meals.Breakfast,
          label: "Breakfast",
          icon: <Feather name="sunrise" size={24} />,
          expandedKey: "breakfast",
          data: mealDay.breakfast,
        },
        {
          key: Meals.Lunch,
          label: "Lunch",
          icon: <Feather name="sun" size={24} />,
          expandedKey: "lunch",
          data: mealDay.lunch,
        },
        {
          key: Meals.Dinner,
          label: "Dinner",
          icon: <Feather name="moon" size={24} />,
          expandedKey: "dinner",
          data: mealDay.dinner,
        },
        {
          key: Meals.Snacks,
          label: "Snacks",
          icon: <Feather name="sunrise" size={24} />,
          expandedKey: "snacks",
          data: mealDay.snacks,
        },
      ] as const,
    [mealDay]
  );

  const handleGoToday = () => {
    setSelectedDate(dayjs());
    showSnackBar("Done!", "error");
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
    setMealDay((prev) => ({
      ...prev,
      [meal]: prev[meal].filter((_, i) => i !== index),
    }));
  };

  const handleOpenModal = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  // const handleCloseModal = () => {
  //     setShowAddItemModal(false);
  // }

  return (
    <View style={{ height: "100%" }}>
      <AddItemModal ref={bottomSheetRef} />

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
        {mealDayUI.map((meal) => (
          <CardGroup key={meal.key}>
            <ItemCard>
              <View style={styles.mealName}>
                <View style={styles.iconSquare}>{meal.icon}</View>
                <IText semiBold>{meal.label}</IText>
              </View>

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
            </ItemCard>

            {isExpanded[meal.expandedKey] && (
              <ItemCard>
                <View
                  style={{ flexDirection: "column", gap: 8, width: "100%" }}
                >
                  {meal.data.map((foodItem, index) => (
                    <View key={index} style={styles.foodItem}>
                      <IButton style={styles.iconButton}>
                        <Entypo name="plus" size={24} color="#000000B4" />
                      </IButton>

                      <View style={{ flexDirection: "column", gap: 4 }}>
                        <IText semiBold>{foodItem.name}</IText>
                        <IText size={11}>
                          {foodItem.quantity} {foodItem.unit}
                        </IText>
                      </View>

                      <IButton
                        style={[styles.iconButton, styles.placeEnd]}
                        onPress={() => handleDeleteFoodItem(meal.key, index)}
                      >
                        <Feather name="trash-2" size={24} color="#000000B4" />
                      </IButton>
                    </View>
                  ))}

                  <View style={styles.foodItem}>
                    <IButton
                      style={styles.iconButton}
                      onPress={handleOpenModal}
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

        {/* <CardGroup>
                <ItemCard>
                    <View style={styles.mealName}>
                        <Feather style={styles.iconSquare} name="sunrise" size={24} />
                        <IText semiBold>Breakfast</IText>
                    </View>

                    <IButton
                        variant="primary"
                        onPress={() => handleExpand(Meals.Breakfast)}
                        style={styles.iconButton}
                    >
                        {isExpanded.breakfast ?
                            <MaterialCommunityIcons name="playlist-check" size={24} color='white' />
                            :
                            <Feather name="edit-3" size={24} color='white' />
                        }
                    </IButton>
                </ItemCard>

                {isExpanded.breakfast && <ItemCard><View style={{ flexDirection: 'column', gap: 8, width: '100%' }}>
                    {mealDay.breakfast.map((foodItem, index) =>
                        <View
                            key={index}
                            style={styles.foodItem}
                        >
                            <IButton style={styles.iconButton}>
                                <Entypo name="plus" size={24} color='#000000B4' />
                            </IButton>

                            <View style={{ flexDirection: 'column', gap: 4 }}>
                                <IText semiBold>{foodItem.name}</IText>
                                <IText size={11}>{foodItem.quantity} {foodItem.unit}</IText>
                            </View>

                            <IButton
                                style={[styles.iconButton, styles.placeEnd]}
                                onPress={() => handleDeleteFoodItem(Meals.Breakfast, index)}
                            >
                                <Feather name="trash-2" size={24} color='#000000B4' />
                            </IButton>
                        </View>)}

                    <View style={styles.foodItem}>
                        <IButton
                            style={styles.iconButton}
                            onPress={handleOpenModal}
                        >
                            <Entypo name="plus" size={24} color='#000000B4' />
                        </IButton>
                        <IText size={12}>Add a dish or an item</IText>
                    </View>
                </View></ItemCard>}
            </CardGroup>

            <CardGroup>
                <ItemCard>
                    <View style={styles.mealName}>
                        <Feather style={styles.iconSquare} name="sun" size={24} />
                        <IText semiBold>Lunch</IText>
                    </View>

                    <IButton
                        variant="primary"
                        onPress={() => handleExpand(Meals.Lunch)}
                        style={styles.iconButton}
                    >
                        {isExpanded.lunch ?
                            <MaterialCommunityIcons name="playlist-check" size={24} color='white' />
                            :
                            <Feather name="edit-3" size={24} color='white' />
                        }
                    </IButton>
                </ItemCard>

                {isExpanded.lunch && <ItemCard><View style={{ flexDirection: 'column', gap: 8, width: '100%' }}>
                    {mealDay.lunch.map((foodItem, index) =>
                        <View
                            key={index}
                            style={styles.foodItem}
                        >
                            <IButton style={styles.iconButton}>
                                <Entypo name="plus" size={24} color='#000000B4' />
                            </IButton>

                            <View style={{ flexDirection: 'column', gap: 4 }}>
                                <IText semiBold>{foodItem.name}</IText>
                                <IText size={11}>{foodItem.quantity} {foodItem.unit}</IText>
                            </View>

                            <IButton
                                style={[styles.iconButton, styles.placeEnd]}
                                onPress={() => handleDeleteFoodItem(Meals.Lunch, index)}
                            >
                                <Feather name="trash-2" size={24} color='#000000B4' />
                            </IButton>
                        </View>)}

                    <View style={styles.foodItem}>
                        <IButton style={styles.iconButton}>
                            <Entypo name="plus" size={24} color='#000000B4' />
                        </IButton>
                        <IText size={12}>Add a dish or an item</IText>
                    </View>
                </View></ItemCard>}
            </CardGroup>

            <CardGroup>
                <ItemCard>
                    <View style={styles.mealName}>
                        <Feather style={styles.iconSquare} name="moon" size={24} />
                        <IText semiBold>Dinner</IText>
                    </View>

                    <IButton
                        variant="primary"
                        onPress={() => handleExpand(Meals.Dinner)}
                        style={styles.iconButton}
                    >
                        {isExpanded.dinner ?
                            <MaterialCommunityIcons name="playlist-check" size={24} color='white' />
                            :
                            <Feather name="edit-3" size={24} color='white' />
                        }
                    </IButton>
                </ItemCard>

                {isExpanded.dinner && <ItemCard><View style={{ flexDirection: 'column', gap: 8, width: '100%' }}>
                    {mealDay.dinner.map((foodItem, index) =>
                        <View
                            key={index}
                            style={styles.foodItem}
                        >
                            <IButton style={styles.iconButton}>
                                <Entypo name="plus" size={24} color='#000000B4' />
                            </IButton>

                            <View style={{ flexDirection: 'column', gap: 4 }}>
                                <IText semiBold>{foodItem.name}</IText>
                                <IText size={11}>{foodItem.quantity} {foodItem.unit}</IText>
                            </View>

                            <IButton
                                style={[styles.iconButton, styles.placeEnd]}
                                onPress={() => handleDeleteFoodItem(Meals.Dinner, index)}
                            >
                                <Feather name="trash-2" size={24} color='#000000B4' />
                            </IButton>
                        </View>)}

                    <View style={styles.foodItem}>
                        <IButton style={styles.iconButton}>
                            <Entypo name="plus" size={24} color='#000000B4' />
                        </IButton>
                        <IText size={12}>Add a dish or an item</IText>
                    </View>
                </View></ItemCard>}
            </CardGroup>

            <CardGroup>
                <ItemCard>
                    <View style={styles.mealName}>
                        <Feather style={styles.iconSquare} name="sunrise" size={24} />
                        <IText semiBold>Snacks</IText>
                    </View>

                    <IButton
                        variant="primary"
                        onPress={() => handleExpand(Meals.Snacks)}
                        style={styles.iconButton}
                    >
                        {isExpanded.snacks ?
                            <MaterialCommunityIcons name="playlist-check" size={24} color='white' />
                            :
                            <Feather name="edit-3" size={24} color='white' />
                        }
                    </IButton>
                </ItemCard>

                {isExpanded.snacks && <ItemCard><View style={{ flexDirection: 'column', gap: 8, width: '100%' }}>
                    {mealDay.snacks.map((foodItem, index) =>
                        <View
                            key={index}
                            style={styles.foodItem}
                        >
                            <IButton style={styles.iconButton}>
                                <Entypo name="plus" size={24} color='#000000B4' />
                            </IButton>

                            <View style={{ flexDirection: 'column', gap: 4 }}>
                                <IText semiBold>{foodItem.name}</IText>
                                <IText size={11}>{foodItem.quantity} {foodItem.unit}</IText>
                            </View>

                            <IButton
                                style={[styles.iconButton, styles.placeEnd]}
                                onPress={() => handleDeleteFoodItem(Meals.Snacks, index)}
                            >
                                <Feather name="trash-2" size={24} color='#000000B4' />
                            </IButton>
                        </View>)}

                    <View style={styles.foodItem}>
                        <IButton style={styles.iconButton}>
                            <Entypo name="plus" size={24} color='#000000B4' />
                        </IButton>
                        <IText size={12}>Add a dish or an item</IText>
                    </View>
                </View></ItemCard>}
            </CardGroup> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mealName: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconSquare: {
    padding: 6,
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
