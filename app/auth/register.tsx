import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function RegisterScreen() {
  return (
    <View>
      <Text>Register Screen</Text>
      <Text>Register Screen</Text>
      <Text>Register Screen</Text>
      <Text>Register Screen</Text>
      <Button title="Login" onPress={() => router.push("/auth/login")} />
    </View>
  );
}
