import IButton from "@/components/IButton";
import QuantitySelector from "@/components/QuantitySelector";
import { CardGroup, ItemCard, ItemImage, IText } from "@/components/styled";
import UnitSelector from "@/components/UnitSelector";
import { Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

export default function Profile() {

  const [count, setCount] = useState(1);
  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        gap: 16,
      }}
    >
      {/* User Info & Dictionary Group */}
      <CardGroup>
        {/* User Info Card */}
        <ItemCard primary>
          <View style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <IText size={24} bold color="#46982D">u1</IText>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', marginLeft: 12 }}>
            <IText color="white" size={18} bold>user123</IText>
            <IText color="white" size={14} style={{ marginTop: 4 }}>example@gmail.com</IText>
          </View>
        </ItemCard>

        {/* Dictionary Card */}
        <ItemCard primary>
          <TouchableOpacity
            onPress={() => router.push("/profile/dictionary")}
            style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
          >
            <View style={{
              width: 64,
              height: 64,
              borderRadius: 12,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Octicons name="book" size={32} color="white" />
            </View>
            <View style={{ flex: 1, justifyContent: 'center', marginLeft: 12 }}>
              <IText color="white" size={16} semiBold>Your items dictionary</IText>
            </View>
            <Octicons name="chevron-right" size={24} color="white" />
          </TouchableOpacity>
        </ItemCard>
      </CardGroup>

      {/* Preferences Section */}
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <IText size={20} bold>Preferences</IText>
          <View style={{ flex: 1, height: 1, backgroundColor: '#00000033', marginLeft: 12 }} />
        </View>
        <CardGroup>
          <ItemCard>
            <ItemImage source={{ uri: "https://imgs.search.brave.com/mDztPWayQWWrIPAy2Hm_FNfDjDVgayj73RTnUIZ15L0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE1Lzg0LzQz/LzM2MF9GXzIxNTg0/NDMyNV90dFg5WWlJ/SXllYVI3TmU2RWFM/TGpNQW15NEd2UEM2/OS5qcGc" }} />
            <View>
              <IText>text</IText>
              <QuantitySelector state={count} setState={setCount} maxState={50}/>
            </View>
            <IText bold>user1234</IText>
          </ItemCard>
          <ItemCard>
            <ItemImage source={{ uri: "https://imgs.search.brave.com/mDztPWayQWWrIPAy2Hm_FNfDjDVgayj73RTnUIZ15L0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAyLzE1Lzg0LzQz/LzM2MF9GXzIxNTg0/NDMyNV90dFg5WWlJ/SXllYVI3TmU2RWFM/TGpNQW15NEd2UEM2/OS5qcGc" }} />
            <View>
              <IText>text</IText>
              <UnitSelector />
            </View>
            <IText bold>user1234</IText>
          </ItemCard>
        </CardGroup>
      </View>

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
