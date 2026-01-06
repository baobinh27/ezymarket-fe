import { IText } from "@/components/styled";
import { Octicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

function DictionaryHeader({ onBack }: { onBack: () => void }) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Octicons name="chevron-left" size={20} color="#000000" />
        <IText size={16} color="#000000" style={styles.backText}>
          Back
        </IText>
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <IText style={styles.title}>Dictionary</IText>
      </View>

      <View style={styles.placeholder} />
    </View>
  );
}

export default function DictionaryLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "white" },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: "white" },
        animation: "slide_from_right",
        presentation: "card",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerBackVisible: false,
          header: () => <DictionaryHeader onBack={() => router.navigate("/profile")} />,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingTop: 20,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backText: {
    marginLeft: 4,
  },
  titleContainer: {
    flex: 2,
    alignItems: "center",
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
  },
  placeholder: {
    flex: 1,
  },
});
