import { IText } from "@/components/styled";
import { Stack } from "expo-router";
import { View } from "react-native";


export default function NotificationLayout() {
    return <Stack screenOptions={{header: () => (<View>
        <IText bold size={24} color="black">Notifications</IText>
    </View>)}} />
}

