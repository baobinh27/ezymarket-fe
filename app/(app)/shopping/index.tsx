import IButton from "@/components/IButton";
import ShoppingListCard from "@/components/shopping/ShoppingListCard";
import { CardGroup, ItemCard, IText } from "@/components/styled";
import { Octicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, View } from "react-native";

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
      return (
      
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
                <IButton variant="primary" style={{ borderRadius: 10, paddingVertical: 16, paddingHorizontal: 12, flex: 1, flexDirection:"row", alignItems: "center", justifyContent: "space-evenly"}} onPress={() => {}}>
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
    );
}
   
   