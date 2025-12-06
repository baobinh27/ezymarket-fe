import { AuthProvider } from "@/services/auth/auth.context";
import { Inter_400Regular, Inter_600SemiBold, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
    <GestureHandlerRootView>     
      <BottomSheetModalProvider>
        
            <Slot />
    </BottomSheetModalProvider>
   </GestureHandlerRootView>
      </QueryClientProvider>
    </AuthProvider>
  );
}
