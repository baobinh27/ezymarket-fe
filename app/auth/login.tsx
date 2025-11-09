import { useAuth } from "@/services/auth/auth.context";
import { router, usePathname } from "expo-router";
import { Button, Text, View } from "react-native";

export default function LoginScreen() {
  const auth = useAuth();
  const pathname = usePathname();

  const handleLogin = async () => {
    await auth.login('test@test.com', '123456');
    console.log("auth:", auth);
    router.replace('/');
  }

  const handleDebug = () => {
    console.log("auth:", auth);
    // console.log("path name:", pathname);
  }

  const handleLogout = async () => {
    await auth.logout();
  }

  return (
    <View>
      <Text>Login Screen 2</Text>
      <Text>Login Screen</Text>
      <Text>Login Screen</Text>
      <Text>Login Screen</Text>
      <Button title="Go to Register" onPress={() => router.push("/auth/register")} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Logout" onPress={handleLogout} />
      <Button title="Debug" onPress={handleDebug} />
      <Button title="Go to Home" onPress={() => router.push("/")} />
    </View>
  );
}
