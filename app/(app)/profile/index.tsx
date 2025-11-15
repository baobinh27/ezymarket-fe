import IButton from "@/components/IButton";
import QuantitySelector from "@/components/QuantitySelector";
import { CardGroup, ItemCard, ItemImage, IText } from "@/components/styled";
import UnitSelector from "@/components/UnitSelector";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function Profile() {

  const [count, setCount] = useState(1);
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
          <View>
            <IText>text</IText>
            <QuantitySelector state={count} setState={setCount} maxState={50}/>
          </View>
          <IText bold color="white">user1234</IText>
        </ItemCard>
        <ItemCard>
          <ItemImage src="https://imgs.search.brave.com/mDztPWayQWWrIPAy2Hm_FNfDjDVgayj73RTnUIZ15L0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE1Lzg0LzQz/LzM2MF9GXzIxNTg0/NDMyNV90dFg5WWlJ/SXllYVI3TmU2RWFM/TGpNQW15NEd2UEM2/OS5qcGc" />
          <View>
            <IText>text</IText>
            <QuantitySelector state={count} setState={setCount} maxState={50}/>
          </View>
          <IText bold>user1234</IText>
        </ItemCard>
        <ItemCard>
          <ItemImage src="https://imgs.search.brave.com/mDztPWayQWWrIPAy2Hm_FNfDjDVgayj73RTnUIZ15L0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE1Lzg0LzQz/LzM2MF9GXzIxNTg0/NDMyNV90dFg5WWlJ/SXllYVI3TmU2RWFM/TGpNQW15NEd2UEM2/OS5qcGc" />
          <View>
            <IText>text</IText>
            <UnitSelector />
          </View>
          <IText bold>user1234</IText>
        </ItemCard>
      </CardGroup>

      <IButton variant="primary" style={{ borderRadius: 5, paddingVertical: 10, width: '50%' }} onPress={() => router.replace("/home")}>
        <IText color="white" semiBold>Go to Home (primary)</IText>
      </IButton>
      <IButton variant="secondary" style={{ borderRadius: 5, paddingVertical: 10, width: '50%' }} onPress={() => router.replace("/home")}>
        <IText color="#46982D" semiBold>Go to Home (secondary)</IText>
      </IButton>
      <IButton variant="tertiary" style={{ borderRadius: 5, paddingVertical: 10, width: '50%' }} onPress={() => router.replace("/home")}>
        <IText color="#000000B4" semiBold>Go to Home (tertiary)</IText>
      </IButton>
      <IButton variant="none" style={{ borderRadius: 5, paddingVertical: 10, width: '50%' }} onPress={() => router.replace("/home")}>
        <IText color="#000000B4" semiBold>Go to Home (none style)</IText>
      </IButton>
    </ScrollView>
  );
}
