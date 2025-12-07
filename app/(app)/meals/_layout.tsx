import TopTabsLayout from "@/components/TopTabsLayout";

const MealLayout = () => {
    const tabs = [
        {
            name: 'planning/index',
            title: 'Planning',
        },
        {
            name: 'cooking/index',
            title: 'Cooking',
        },
    ]

    return <TopTabsLayout tabs={tabs} />;
}

export default MealLayout;