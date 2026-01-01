import { useAuth } from "@/services/auth/auth.context";
import { Ionicons, MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { Redirect, Tabs, usePathname } from "expo-router";
import { OpaqueColorValue } from "react-native";

export default function AppLayout() {
  const { isLoggedIn, loading } = useAuth();
  const pathname = usePathname();
  // loading animation i guess
  if (loading) return null;

  if (!isLoggedIn) return <Redirect href="/auth/login" />;

  // Kiểm tra nếu đang ở dictionary thì giữ highlight tab Profile
  const isDictionaryRoute = pathname?.startsWith("/profile/dictionary");

  const tabs = [
    {
      name: "home/index",
      title: "Home",
      icon: (color: string | OpaqueColorValue | undefined) => (
        <Octicons size={20} name="home" color={color} />
      ),
    },
    {
      name: "shopping",
      title: "Shopping",
      icon: (color: string | OpaqueColorValue | undefined) => (
        <Octicons size={20} name="checklist" color={color} />
      ),
    },
    {
      name: "fridge/index",
      title: "Fridge",
      icon: (color: string | OpaqueColorValue | undefined) => (
        <MaterialCommunityIcons name="fridge-outline" size={24} color={color} />
      ),
    },
    {
      name: "meals",
      title: "Meals",
      icon: (color: string | OpaqueColorValue | undefined) => (
        <Ionicons name="restaurant-outline" size={20} color={color} />
      ),
    },
    {
      name: "profile/index",
      title: "Profile",
      icon: (color: string | OpaqueColorValue | undefined) => (
        <Octicons name="person" size={20} color={color} />
      ),
    },
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "left",
        headerTitleStyle: {
          fontFamily: "Inter_700Bold",
          fontSize: 24,
          fontWeight: 700,
        },
        sceneStyle: { backgroundColor: "white" },
        tabBarActiveBackgroundColor: "#82CD47",
        tabBarActiveTintColor: "#FFFFFF",
        animation: "shift",
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
      {/* Ẩn dictionary route khỏi tab bar và header */}
      <Tabs.Screen name="profile/dictionary" options={{ href: null, headerShown: false }} />

      {tabs.map((tab) => {
        const isProfileTab = tab.name === "profile/index";
        const shouldHighlight = isProfileTab && isDictionaryRoute;

        return (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            headerShown: tab.name !== "shopping",
              tabBarIcon: ({ color, focused }) => {
                // Nếu đang ở dictionary và là tab Profile, dùng màu trắng
                const iconColor = shouldHighlight ? "#FFFFFF" : focused ? "#FFFFFF" : "#000000B4";
                return tab.icon(iconColor);
              },
              tabBarLabelStyle: {
                color: shouldHighlight ? "#FFFFFF" : undefined,
              },
              tabBarItemStyle: shouldHighlight
                ? {
                    backgroundColor: "#82CD47",
                  }
                : undefined,
          }}
        />
        );
      })}
    </Tabs>
  );
}
