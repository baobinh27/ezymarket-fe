import { ItemCard, ItemImage, IText } from "@/components/styled";
import { useAuth } from "@/services/auth/auth.context";
import { router } from "expo-router";
import { Button, ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
  const auth = useAuth();

  const handleLogout = async () => {
    await auth.logout();
  }
  const handleDebug = () => {
    console.log("auth:", auth);
  }
  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        gap: 16,
      }}
    >
      <Text style={{ fontFamily: "Inter", fontWeight: '700' }}>Welcome Home!</Text>
      <Text style={{ fontFamily: 'system-ui', fontWeight: '700' }}>Welcome Home! 2</Text>
      <Text className="text-red-500 text-xl border-6">Welcome Home! 3</Text>
      <Text>Welcome Home!4</Text>
      <IText semiBold size={14} style={{ fontWeight: 'black' }}>CustomText (Inter)</IText>
      <IText>CustomText regular</IText>
      <IText bold>CustomText bold</IText>
      <ItemCard>
        <ItemImage src="https://imgs.search.brave.com/ZyTalHbd6ylc6QNmPc_567ZkdaIA2fOjPirg0xv5rNY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAxNi8w/NS9DYWJiYWdlLUZy/ZWUtUE5HLUltYWdl/LnBuZw" />
        <View
          style={{ flexDirection: 'column' }}
        >

          <IText semiBold>Cabbage</IText>
          <IText>Amount: 3</IText>
        </View>
      </ItemCard>
      <ItemCard>
        <ItemImage src="https://imgs.search.brave.com/ZyTalHbd6ylc6QNmPc_567ZkdaIA2fOjPirg0xv5rNY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAxNi8w/NS9DYWJiYWdlLUZy/ZWUtUE5HLUltYWdl/LnBuZw" />
        <View
          style={{ flexDirection: 'column' }}
        >

          <IText semiBold>Cabbage</IText>
          <IText>Amount: 3</IText>
        </View>
      </ItemCard>
      <ItemCard>
        <ItemImage src="https://imgs.search.brave.com/ZyTalHbd6ylc6QNmPc_567ZkdaIA2fOjPirg0xv5rNY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAxNi8w/NS9DYWJiYWdlLUZy/ZWUtUE5HLUltYWdl/LnBuZw" />
        <View
          style={{ flexDirection: 'column' }}
        >

          <IText semiBold>Cabbage</IText>
          <IText>Amount: 3</IText>
        </View>
      </ItemCard>
      <ItemCard>
        <ItemImage src="https://imgs.search.brave.com/ZyTalHbd6ylc6QNmPc_567ZkdaIA2fOjPirg0xv5rNY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAxNi8w/NS9DYWJiYWdlLUZy/ZWUtUE5HLUltYWdl/LnBuZw" />
        <View
          style={{ flexDirection: 'column' }}
        >

          <IText semiBold>Cabbage</IText>
          <IText>Amount: 3</IText>
        </View>
      </ItemCard>
      <ItemCard>
        <ItemImage src="https://imgs.search.brave.com/ZyTalHbd6ylc6QNmPc_567ZkdaIA2fOjPirg0xv5rNY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAxNi8w/NS9DYWJiYWdlLUZy/ZWUtUE5HLUltYWdl/LnBuZw" />
        <View
          style={{ flexDirection: 'column' }}
        >

          <IText semiBold>Cabbage</IText>
          <IText>Amount: 3</IText>
        </View>
      </ItemCard>
      <ItemCard>
        <ItemImage src="https://imgs.search.brave.com/ZyTalHbd6ylc6QNmPc_567ZkdaIA2fOjPirg0xv5rNY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAxNi8w/NS9DYWJiYWdlLUZy/ZWUtUE5HLUltYWdl/LnBuZw" />
        <View
          style={{ flexDirection: 'column' }}
        >

          <IText semiBold>Cabbage</IText>
          <IText>Amount: 3</IText>
        </View>
      </ItemCard>
      <ItemCard>
        <ItemImage src="https://imgs.search.brave.com/ZyTalHbd6ylc6QNmPc_567ZkdaIA2fOjPirg0xv5rNY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAxNi8w/NS9DYWJiYWdlLUZy/ZWUtUE5HLUltYWdl/LnBuZw" />
        <View
          style={{ flexDirection: 'column' }}
        >

          <IText semiBold>Cabbage</IText>
          <IText>Amount: 3</IText>
        </View>
      </ItemCard>
      <ItemCard>
        <ItemImage src="https://imgs.search.brave.com/ZyTalHbd6ylc6QNmPc_567ZkdaIA2fOjPirg0xv5rNY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAxNi8w/NS9DYWJiYWdlLUZy/ZWUtUE5HLUltYWdl/LnBuZw" />
        <View
          style={{ flexDirection: 'column' }}
        >

          <IText semiBold>Cabbage</IText>
          <IText>Amount: 3</IText>
        </View>
      </ItemCard>
      <Button title="Go to Profile" onPress={() => router.push("/profile")} />
      <Button title="Log out" onPress={handleLogout} />
      <Button title="Debug" onPress={handleDebug} />
      <Button title="Log out (manual)" onPress={() => router.replace("/auth/login")} />
    </ScrollView>
  );
}
