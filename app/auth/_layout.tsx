import { useAuth } from "@/services/auth/auth.context";
import { Redirect, Stack } from "expo-router";
import { Keyboard, Pressable } from "react-native";

export default function AuthLayout() {
  const { isLoggedIn } = useAuth();

  // Tránh redirect sớm khi context chưa load xong
  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#22C55E" />
  //     </View>
  //   );
  // }

  if (isLoggedIn) return <Redirect href="/home" />;
  return (<Stack screenOptions={{ headerShown: false }} />);
}

// const styles = StyleSheet.create({
//   loadingContainer: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F6FFF4",
//   },
// });

export const unstable_settings = {
  // Tự động bọc tất cả screens thuộc layout này, tự động dismiss keyboard khi nhấn ra ngoài
  wrapper: (children: React.ReactNode) => (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      {children}
    </Pressable>
  ),
};
