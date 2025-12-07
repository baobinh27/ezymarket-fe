import { Tabs } from "expo-router";

export interface TopTabItem {
    name: string;     // đường dẫn ví dụ: "planning/planning"
    title: string;    // tên hiển thị
}

interface TopTabsLayoutProps {
    tabs: TopTabItem[];
}

export default function TopTabsLayout({ tabs }: TopTabsLayoutProps) {
    return (
        <Tabs
            screenOptions={{
                tabBarPosition: "top",
                headerShown: false,
                animation: "shift",

                tabBarInactiveBackgroundColor: "#EEEEEE",
                tabBarInactiveTintColor: "#000000B4",
                tabBarActiveBackgroundColor: "#82CD47",
                tabBarActiveTintColor: "#FFFFFF",

                tabBarIconStyle: { display: "none" },

                tabBarLabelStyle: {
                    fontFamily: "Inter_600SemiBold",
                    fontSize: 12,
                    marginVertical: "auto",
                },

                tabBarStyle: {
                    backgroundColor: "#ffffff",
                    height: 32,
                    borderRadius: 10,
                    marginHorizontal: 20,
                    marginVertical: 12,
                    overflow: "hidden",
                },

                sceneStyle: { backgroundColor: "white" },
            }}
            safeAreaInsets={{ top: 0 }}
        >
            {/* Ẩn route index nếu có */}
            <Tabs.Screen name="index" options={{ href: null }} />

            {tabs.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{ title: tab.title }}
                />
            ))}
        </Tabs>
    );
}
