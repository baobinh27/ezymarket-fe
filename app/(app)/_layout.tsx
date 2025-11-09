import { useAuth } from "@/services/auth/auth.context";
import { Redirect, Tabs } from "expo-router";

export default function AppLayout() {
    const { isLoggedIn, loading } = useAuth();
    // loading animation i guess
    if (loading) return null;

    if (!isLoggedIn) return <Redirect href="/auth/login" />;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                animation: 'shift'
            }}
        >
            <Tabs.Screen
                name="home/home"
                options={{
                    title: 'Home',
                }}
            />
            <Tabs.Screen
                name="profile/profile"
                options={{
                    title: 'Profile',
                }}
            />
            <Tabs.Screen
                name="shopping/shopping"
                options={{
                    title: 'Shopping',
                }}
            />
        </Tabs>
    )
}
