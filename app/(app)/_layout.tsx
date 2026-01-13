import IButton from "@/components/IButton";
import { IText } from "@/components/styled";
import { useNotifications } from "@/hooks/notifications/useNotifications";
import { useAuth } from "@/services/auth/auth.context";
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from "@expo/vector-icons";
import { Redirect, router, Tabs } from "expo-router";
import { OpaqueColorValue, StyleSheet, View } from "react-native";

export default function AppLayout() {
  const { isLoggedIn, loading } = useAuth();
  const { unreadCount } = useNotifications();

  if (loading) return null;

  if (!isLoggedIn) return <Redirect href="/auth/login" />;

  const handleGoNotifications = () => {
    router.push("/notifications");
  };

  const handleNotificationsBack = () => {
    router.back();
  }

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
      name: "profile",
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

      {tabs.map((tab) => {
        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              headerShown: true,
              tabBarIcon: ({ color }) => tab.icon(color),
              header: () => (
                <View style={styles.headerContainer}>
                  <IText bold color="black" size={24}>
                    {tab.title}
                  </IText>
                  <IButton
                    variant="tertiary"
                    style={styles.notificationButton}
                    onPress={handleGoNotifications}
                  >
                    <MaterialIcons name="notifications-none" size={24} />
                    {unreadCount > 0 && (
                      <View
                        style={{
                          position: "absolute",
                          top: -4,
                          right: -4,
                          backgroundColor: "#FF6B6B",
                          borderRadius: 12,
                          width: 20,
                          height: 20,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <IText color="white" size={10} semiBold>
                          {unreadCount}
                        </IText>
                      </View>
                    )}
                  </IButton>
                </View>
              ),
            }}
          />
        );
      })}

      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
          header: () => (
            <View style={styles.headerContainer}>
              <IText bold color="black" size={24}>
                Notifications
              </IText>
              <IButton
                variant="tertiary"
                style={styles.notificationButton}
                onPress={handleNotificationsBack}
              >
                <Feather name="x" size={24} />
              </IButton>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 18,
  },
  notificationButton: {
    padding: 0,
    borderRadius: 8,
    width: 32,
    height: 32,
  },
});
