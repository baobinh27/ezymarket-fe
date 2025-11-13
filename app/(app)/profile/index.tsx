import { CardGroup, ItemCard, ItemImage, IText } from "@/components/styled";
import { router } from "expo-router";
import { Button, ScrollView } from "react-native";

export default function Profile() {
  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        gap: 16,
      }}
    >
      <CardGroup>
        <ItemCard primary>
          <ItemImage src="https://imgs.search.brave.com/mDztPWayQWWrIPAy2Hm_FNfDjDVgayj73RTnUIZ15L0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE1Lzg0LzQz/LzM2MF9GXzIxNTg0/NDMyNV90dFg5WWlJ/SXllYVI3TmU2RWFM/TGpNQW15NEd2UEM2/OS5qcGc" />
          <IText>text</IText>
          <IText bold color="white">user1234</IText>
        </ItemCard>
        <ItemCard primary>
          <ItemImage src="https://imgs.search.brave.com/mDztPWayQWWrIPAy2Hm_FNfDjDVgayj73RTnUIZ15L0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE1Lzg0LzQz/LzM2MF9GXzIxNTg0/NDMyNV90dFg5WWlJ/SXllYVI3TmU2RWFM/TGpNQW15NEd2UEM2/OS5qcGc" />
          <IText>text</IText>
          <IText bold color="white">user1234</IText>
        </ItemCard>
      </CardGroup>

      <Button title="Go to Home" onPress={() => router.replace("/home")} />
    </ScrollView>
  );
}
