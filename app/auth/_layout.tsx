import { useAuth } from "@/services/auth/auth.context";
import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  const { isLoggedIn, loading } = useAuth();

  // Tránh redirect sớm khi context chưa load xong
  if (loading) return null;

  if (isLoggedIn) return <Redirect href="/home" />;
  return (<Stack screenOptions={{ headerShown: false }} />);
}
