import { useAuth } from "@/services/auth/auth.context";
import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function HomeScreen() {
  const auth = useAuth();

  const handleLogout = async () => {
    await auth.logout();
    // router.replace('/');
  }
  const handleDebug = () => {
    console.log("auth:", auth);
    // console.log("path name:", pathname);
  }
  return (
    <View>
      <Text>Welcome Home!</Text>
      <Text>Welcome Home!</Text>
      <Text>Welcome Home!</Text>
      <Text>Welcome Home!</Text>
      <Button title="Go to Profile" onPress={() => router.push("/profile/profile")} />
      <Button title="Log out" onPress={handleLogout} />
      <Button title="Debug" onPress={handleDebug} />
      <Button title="Log out (manual)" onPress={() => router.replace("/auth/login")} />
    </View>
  );
}
