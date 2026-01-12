import { IText } from "@/components/styled";
import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "white" },
        headerTitleAlign: 'left',
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
          header: () => (
            <IText>Dictionary</IText>
          ),
        }}
      />
    </Stack>
  );
}
