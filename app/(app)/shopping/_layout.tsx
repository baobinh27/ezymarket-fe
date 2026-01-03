import CheckoutHeader from "@/components/shopping/CheckoutHeader";
import ShoppingDetailHeader from "@/components/shopping/ShoppingDetailHeader";
import { Stack, useRouter } from "expo-router";
import { Text } from "react-native";

export default function ShoppingLayout() {
  const router = useRouter();

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
              onSave={() => { }}
            />
          ),
          headerShown: true,
          header: () => (
            <CheckoutHeader
              onBack={() => router.back()}
              onSave={() => { }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="[id]"
        options={({ route }) => ({
          header: (props) => <ShoppingDetailHeader {...props} items={(route.params as any)?.items} />
        })}
      />
      <Stack.Screen
        name="saved/[id]"
        options={{
          title: "",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Octicons size={24} name="chevron-left" color="black" />
                <IText color="black" semiBold size={16}>
                  Back
                </IText>
              </View>
            </TouchableOpacity>
          )
        }}
      />
      <Stack.Screen
        name="update/[id]"
        options={{
          title: "",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Octicons size={24} name="chevron-left" color="black" />
                <IText color="black" semiBold size={16}>
                  Back
                </IText>
              </View>
            </TouchableOpacity>
          )
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          headerShown: true,
          title: "",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Octicons size={24} name="chevron-left" color="black" />
                <IText color="black" semiBold size={16}>
                  Back
                </IText>
              </View>
            </TouchableOpacity>
          )

        }}
      />
      {/* <Stack.Screen
        name="update/[id]"
        options={{
          title: "",
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Octicons size={24} name="chevron-left" color="black" />
                <IText color="black" semiBold size={16}>
                  Back
                </IText>
              </View>
            </TouchableOpacity>
          )
        }}
      /> */}
    </Stack>
  );
}
