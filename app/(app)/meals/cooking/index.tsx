import IButton from "@/components/IButton";
import RecipeIngredientsModal from "@/components/meals/RecipeIngredientsModal";
import { CardGroup, ItemCard, ItemImageWithFallback, IText } from "@/components/styled";
import useGetMealByDateRange from "@/hooks/meal/useGetMealByDateRange";
import { useMarkMealItemAsCooked } from "@/hooks/meal/useMarkMealItemAsCooked";
import { useMealPlanningContext } from "@/services/meals/mealPlanning.context";
import { MealItem } from "@/types/types";
import { getDateFormat } from "@/utils/utils";
import { Feather } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

const MealCooking = () => {
  const { viewingWeekDate } = useMealPlanningContext();
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [ingredientsModalVisible, setIngredientsModalVisible] = useState(false);

  const weekStart = viewingWeekDate.startOf("week");
  const weekEnd = viewingWeekDate.endOf("week");

  const {
    data: mealDay,
    isFetching,
    refetch: fetchMealDay,
  } = useGetMealByDateRange({
    params: {
      startDate: getDateFormat(weekStart),
      endDate: getDateFormat(weekEnd),
    },
    enabled: true,
  });

  const { mutateAsync: markMealItemAsCooked, isPending: isCooking } = useMarkMealItemAsCooked();

  // Get all recipe-type meal items from the week
  const recipeMealItems = useMemo(() => {
    if (!mealDay) return [];

    const items: (MealItem & { date: string })[] = [];

    mealDay.forEach((day) => {
      day.meals.forEach((meal) => {
        meal.items.forEach((item) => {
          if (item.itemType === "recipe") {
            items.push({
              ...item,
              date: day.date,
            });
          }
        });
      });
    });

    return items;
  }, [mealDay]);

  // Determine status for each item
  const itemsWithStatus = useMemo(() => {
    return recipeMealItems.map((item) => {
      let status: "planned" | "cooked" | "eaten";

      if (item.isEaten) {
        status = "eaten";
      } else if ((item as any).isCooked || (item as any).cookedAt) {
        status = "cooked";
      } else {
        status = "planned";
      }

      return { ...item, status };
    });
  }, [recipeMealItems]);

  // Group by status
  const groupedItems = useMemo(() => {
    return {
      planned: itemsWithStatus.filter((item) => item.status === "planned"),
      cooked: itemsWithStatus.filter((item) => item.status === "cooked"),
      eaten: itemsWithStatus.filter((item) => item.status === "eaten"),
    };
  }, [itemsWithStatus]);

  const handleCookItem = async (itemId: string) => {
    try {
      await markMealItemAsCooked(itemId);
      await fetchMealDay();
    } catch (error) {
      console.error("Error marking item as cooked:", error);
    }
  };

  const handleShowIngredients = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setIngredientsModalVisible(true);
  };

  const renderMealItem = (item: any) => {
    const isToday = dayjs(item.date).isSame(dayjs(), "day");
    const itemDate = dayjs(item.date).format("MMM DD");

    return (
      <ItemCard key={item._id} style={styles.mealCard}>
        <View style={styles.itemGroup}>
          <ItemImageWithFallback source={item.recipeId?.imageUrl} style={styles.recipeImage} />

          <View style={styles.itemInfo}>
            <View style={{ gap: 4 }}>
              <IText semiBold>{item.recipeId?.title}</IText>
              <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                <IText size={11} color="#666">
                  {isToday ? "Today" : itemDate}
                </IText>
                <IButton
                  variant={item.status === "planned" ? "secondary" : "primary"}
                  style={styles.statusBadge}
                >
                  <IText size={10} color={item.status === "planned" ? "#82CD47" : "#22C55E"}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </IText>
                </IButton>
              </View>
            </View>
          </View>
        </View>

        {item.status === "planned" && (
          <View style={styles.itemGroup}>
            <IButton
              variant="primary"
              style={styles.ingredientsButton}
              onPress={() => handleShowIngredients(item.recipeId._id)}
            >
              <Feather name="list" size={18} color="white" />
            </IButton>
            <IButton
              variant="primary"
              style={styles.cookButton}
              onPress={() => handleCookItem(item._id)}
              disabled={isCooking}
            >
              <IText size={11} semiBold color="white">
                {isCooking ? "..." : "Cook"}
              </IText>
            </IButton>
          </View>
        )}
      </ItemCard>
    );
  };

  // const weekStart = viewingWeekDate.startOf("week");
  // const weekEnd = viewingWeekDate.endOf("week");
  const weekRange = `${weekStart.format("MMM DD")} - ${weekEnd.format("MMM DD, YYYY")}`;

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        gap: 16,
        paddingBottom: 32,
      }}
    >
      <View style={styles.weekHeader}>
        <IText bold size={18}>
          Week of {weekRange}
        </IText>
      </View>
      {isFetching ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#82CD47" />
        </View>
      ) : (
        <>
          {/* Planned Items */}
          {groupedItems.planned.length > 0 && (
            <CardGroup>
              <ItemCard primary style={styles.sectionHeader}>
                <IText semiBold color="white" style={styles.sectionTitle}>
                  To Cook ({groupedItems.planned.length})
                </IText>
              </ItemCard>
              {groupedItems.planned.map((item) => renderMealItem(item))}
            </CardGroup>
          )}

          {/* Cooked Items */}
          {groupedItems.cooked.length > 0 && (
            <CardGroup>
              <ItemCard primary style={[styles.sectionHeader, styles.cookedHeader]}>
                <IText semiBold color="white" style={styles.sectionTitle}>
                  Cooked ({groupedItems.cooked.length})
                </IText>
              </ItemCard>
              {groupedItems.cooked.map((item) => renderMealItem(item))}
            </CardGroup>
          )}

          {/* Eaten Items */}
          {groupedItems.eaten.length > 0 && (
            <CardGroup>
              <ItemCard primary style={[styles.sectionHeader, styles.eatenHeader]}>
                <IText semiBold color="white" style={styles.sectionTitle}>
                  Eaten ({groupedItems.eaten.length})
                </IText>
              </ItemCard>
              {groupedItems.eaten.map((item) => renderMealItem(item))}
            </CardGroup>
          )}

          {/* Empty State */}
          {recipeMealItems.length === 0 && (
            <View style={styles.emptyContainer}>
              <Feather name="inbox" size={48} color="#CCCCCC" />
              <IText color="#999999" style={styles.emptyText}>
                No recipes planned for this week
              </IText>
            </View>
          )}
        </>
      )}

      <RecipeIngredientsModal
        visible={ingredientsModalVisible}
        recipeId={selectedRecipeId || undefined}
        onClose={() => setIngredientsModalVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  weekHeader: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  sectionHeader: {
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 16,
  },
  cookedHeader: {
    backgroundColor: "#4CAF50",
  },
  eatenHeader: {
    backgroundColor: "#22C55E",
  },
  mealCard: {
    marginBottom: 2,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  recipeImage: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    justifyContent: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  itemGroup: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  ingredientsButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cookButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
  },
});

export default MealCooking;
