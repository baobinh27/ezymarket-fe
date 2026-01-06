import TopTabsLayout from "@/components/TopTabsLayout";
import { MealPlanningProvider } from "@/services/meals/mealPlanning.context";

const MealLayout = () => {
  const tabs = [
    {
      name: "planning/index",
      title: "Planning",
    },
    {
      name: "cooking/index",
      title: "Cooking",
    },
  ];

  return (
    <MealPlanningProvider>
      <TopTabsLayout tabs={tabs} />
    </MealPlanningProvider>
  );
};

export default MealLayout;
