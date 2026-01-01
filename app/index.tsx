import { useAuth } from "@/services/auth/auth.context";
import { localStorage } from "@/utils/storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const { isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [hasShownWelcomePage, setHasShownWelcomePage] = useState<boolean | null>(null);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      const welcomeState = await localStorage.get("hasShownWelcomePage");
      setHasShownWelcomePage(welcomeState);
      if (welcomeState === null) {
        await localStorage.set("hasShownWelcomePage", false);
      }
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!hasShownWelcomePage) {
    return <Redirect href="/welcome" />;
  }

  if (!isLoggedIn) {
    return <Redirect href="/auth/login" />;
  }

  return <Redirect href="/home" />;
}
