import IButton from "@/components/IButton";
import { CreateOption, CreateShoppingListModal } from "@/components/shopping/CreateShoppingListModal";
import ShoppingListCard from "@/components/shopping/ShoppingListCard";
import { CardGroup, ItemCard, IText } from "@/components/styled";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import BottomSheet from '@gorhom/bottom-sheet';
import React, { useCallback, useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const shoppingLists = [
{ id: "1", name: "Weekly Groceries" },
{ id: "2", name: "Dinner Party" },
{ id: "3", name: "Breakfast Items" },
{ id: "4", name: "Pantry Staples" },
{ id: "5", name: "Weekly Groceries" },
{ id: "6", name: "Dinner Party" },
{ id: "7", name: "Breakfast Items" },
{ id: "8", name: "Pantry Staples" },
];

export default function ShoppingScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleDismiss = useCallback(() => {
    console.log('Sheet dismissed');
  }, []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  // const handleSheetChanges = useCallback((index: number) => {
  //   console.log('handleSheetChanges', index);
  // }, []);

  const createOptions: CreateOption[] = [
    {
      id: "checklist",
      title: "Shopping Checklist",
      description: "This will create a shopping checklist to help you track your items while shopping.",
      icon: <Octicons size={24} name="checklist" color="#46982D" />,
      onPress: () => {
        console.log("Create Shopping Checklist");
        // Navigate to checklist creation
      },
    },
    {
      id: "receipt",
      title: "Instant Receipt",
      description: "Use this when you don't want to plan and already has the complete shopping receipt.",
      icon: <MaterialCommunityIcons size={24} name="receipt" color="#46982D" />,
      onPress: () => {
        console.log("Create Instant Receipt");
        // Navigate to receipt creation
      },
    },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView
            contentContainerStyle={{
                padding: 16,
                gap: 16
            }}
        >
            <View style={{
                flexDirection: "row",
                gap: 8
            }}>
                 <IButton variant="secondary" style={{ borderRadius: 10, paddingVertical: 10, flex: 1.8 }} onPress={() => {}}>
                    <IText color="#46982D" semiBold>Search</IText>
                </IButton>
                <IButton variant="primary" style={{ borderRadius: 10, paddingVertical: 16, paddingHorizontal: 12, flex: 1, flexDirection:"row", alignItems: "center", justifyContent: "space-evenly"}} onPress={handlePresentModalPress}>
                    <View style={{backgroundColor: "white", padding: 5, borderRadius: 4}}><Octicons size={24} name="plus" color="#46982D" /></View>
                    <IText color="white" semiBold>Create</IText>
                </IButton>
            </View>



            <ItemCard primary>
                <ShoppingListCard id={"0"} name={"My shopping list"} active />
            </ItemCard>

            <CardGroup>
                {
                    shoppingLists.map((item) => {
                        return <ItemCard key={item.id}><ShoppingListCard  id={item.id} name={item.name} /></ItemCard>
                    })
                }
            </CardGroup>
        </ScrollView>
        
        <CreateShoppingListModal
          bottomSheetRef={bottomSheetRef}
          options={createOptions}
        />
    </GestureHandlerRootView>
  );
}
   
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});