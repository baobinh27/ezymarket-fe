import { localStorage } from "@/utils/storage";
import { router } from "expo-router";
import { Button, Text, View } from "react-native";


export default function WelcomeScreen() {

    const handleFinishWelcome = async () => {
        await localStorage.set('hasShownWelcomePage', true);
        router.replace('/')
    }
    return <View>
        <Text>Welcome</Text>
        <Text>Welcome</Text>
        <Text>Welcome</Text>
        <Button title="Done" onPress={handleFinishWelcome}></Button>
    </View>
}