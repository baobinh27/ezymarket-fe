import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "white" },
        headerTitleAlign: "left",
        animation: "simple_push",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="dictionary"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="notification-setting/index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
