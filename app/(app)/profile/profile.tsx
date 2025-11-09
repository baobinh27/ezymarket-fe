import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Profile() {
  return (
    <View>
      <Text>Profile</Text>
      <Text>Profile</Text>
      <Text>Profile</Text>
      <Text>Profile</Text>
      <Button title="Go to Home" onPress={() => router.replace("/home/home")} />
    </View>
  );
}
