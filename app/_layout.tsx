import { AuthProvider } from "@/services/auth/auth.context";
import { SnackBarProvider } from "@/services/auth/snackbar.context";
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { ActivityIndicator, StatusBar, View } from "react-native";

const queryClient = new QueryClient();

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <SnackBarProvider>
          <StatusBar />
          <Slot />
        </SnackBarProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
