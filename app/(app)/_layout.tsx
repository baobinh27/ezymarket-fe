import { useAuth } from "@/services/auth/auth.context";
import { Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { OpaqueColorValue } from "react-native";

export default function AppLayout() {
    const { isLoggedIn, loading } = useAuth();
    // loading animation i guess
    if (loading) return null;

    if (!isLoggedIn) return <Redirect href="/auth/login" />;

    const tabs = [
        {
            name: 'home/index',
            title: 'Home',
            icon: (color: string | OpaqueColorValue | undefined) => <Octicons size={20} name="home" color={color} />
        },
        {
            name: 'shopping/index',
            title: 'Shopping',
            icon: (color: string | OpaqueColorValue | undefined) => <Octicons size={20} name="checklist" color={color} />
        },
        {
            name: 'fridge/index',
            title: 'Fridge',
            icon: (color: string | OpaqueColorValue | undefined) => <MaterialCommunityIcons name="fridge-outline" size={24} color={color} />
        },
        {
            name: 'meals',
            title: 'Meals',
            icon: (color: string | OpaqueColorValue | undefined) => <Ionicons name="restaurant-outline" size={20} color={color} />
        },
        {
            name: 'profile/index',
            title: 'Profile',
            icon: (color: string | OpaqueColorValue | undefined) => <Octicons name="person" size={20} color={color} />
        },
    ]

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerTitleAlign: 'left',
                headerTitleStyle: {
                    fontFamily: 'Inter',
                    fontSize: 24,
                    fontWeight: 700
                },
                sceneStyle: { backgroundColor: "white" },
                tabBarActiveBackgroundColor: '#82CD47',
                tabBarActiveTintColor: '#FFFFFF',
                animation: 'shift',
                tabBarStyle: {
                    backgroundColor: "#ffffff",
                    height: 64,
                },
                headerShadowVisible: false,
            }}
            // Make the tab bar flush with bottom of screen
            safeAreaInsets={{ bottom: 0 }}
        >
            {/* href=null: Hidden route */}
            <Tabs.Screen name="index" options={{ href: null }} />

            {tabs.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        title: tab.title,
                        tabBarIcon: ({ color }) => tab.icon(color),
                    }}

                />
            ))}

        </Tabs>
    )
}
