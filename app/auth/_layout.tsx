import { useAuth } from "@/services/auth/auth.context";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function AuthLayout() {
  const { isLoggedIn, loading } = useAuth();

  // Tránh redirect sớm khi context chưa load xong
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22C55E" />
      </View>
    );
  }

  if (isLoggedIn) return <Redirect href="/home" />;
  return (<Stack screenOptions={{ headerShown: false }} />);
}

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6FFF4",
  },
});
