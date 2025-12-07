import CheckoutHeader from "@/components/shopping/CheckoutHeader";
import ShoppingDetailHeader from "@/components/shopping/ShoppingDetailHeader";
import { Stack, useRouter } from "expo-router";
import { Text } from "react-native";

export default function ShoppingLayout() {
  const router = useRouter();

  return (
    <Stack
        screenOptions={{
            contentStyle: {backgroundColor: "white"},
            headerTitleAlign: 'left',
            
        }}
    >
      <Stack.Screen
        name="index"
        options={{
            title: "",
            headerShown: true,
            headerLeft: () => (
                <Text style={{
                    fontFamily: 'Inter_700Bold',
                    fontSize: 24,
                    fontWeight: '700',
                }}>
                    Shopping
                </Text>
            )
        }}
      />
      <Stack.Screen
        name="checkout/[id]"
        options={{
            headerShown: true,
            header: () => (
              <CheckoutHeader 
                onBack={() => router.back()} 
                onSave={() => {}} 
              />
            ),
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
            header: (props) => <ShoppingDetailHeader {...props} />
        }}
      />
    </Stack>
  );
}
