import IBottomSheetModal from "@/components/IBottomSheetModal";
import IButton from "@/components/IButton";
import { SearchBox } from "@/components/SearchBox";
import CreateOptionCard, { useCreateOptions } from "@/components/shopping/CreateOptionCard";
import ShoppingListCard from "@/components/shopping/ShoppingListCard";
import { CardGroup, ItemCard, IText } from "@/components/styled";
import { Octicons } from "@expo/vector-icons";
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const shoppingLists = [
  { id: "1", name: "Weekly Groceries", active: true },
  { id: "2", name: "Dinner Party", active: true },
  { id: "3", name: "Breakfast Items", active: true },
  { id: "4", name: "Pantry Staples", active: true },
  { id: "5", name: "Monthly Shopping", active: false },
  { id: "6", name: "Party Supplies", active: false },
  { id: "7", name: "Snack Items", active: false },
  { id: "8", name: "Kitchen Essentials", active: false },
];

export default function ShoppingScreen() {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [searchText, setSearchText] = useState("");

  const handleDismissModal = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const createOptions = useCreateOptions(handleDismissModal);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const filteredActiveLists = useMemo(() => {
    return shoppingLists
      .filter(list => list.active)
      .filter(list => list.name.toLowerCase().includes(searchText.toLowerCase()));
  }, [searchText]);

  const filteredSavedLists = useMemo(() => {
    return shoppingLists
      .filter(list => !list.active)
      .filter(list => list.name.toLowerCase().includes(searchText.toLowerCase()));
  }, [searchText]);



  return (
    <View
      style={{
        padding: 16,
        flex: 1
      }}>
      <View style={{
        flexDirection: "row",
        gap: 8,
        // marginBottom: 10
      }}>
        {/* Search box */}
        <SearchBox
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search..."
          containerStyle={{ flex: 1.8 }}
        />

        <IButton variant="primary" style={{ borderRadius: 10, paddingVertical: 16, flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-evenly" }} onPress={handlePresentModalPress}>
          <View style={{ backgroundColor: "white", padding: 5, borderRadius: 4 }}><Octicons size={24} name="plus" color="#46982D" /></View>
          <IText color="white" semiBold>Create</IText>
        </IButton>
      </View>
      <ScrollView
        style={{ paddingTop: 16 }}
        contentContainerStyle={{ gap: 16 }}
      >


        {/* Active list */}
        {filteredActiveLists.length > 0 && (
          <CardGroup>
            {filteredActiveLists.map((item) => {
              return <ItemCard primary key={item.id}><ShoppingListCard id={item.id} name={item.name} active /></ItemCard>
            })}
          </CardGroup>
        )}

        {/* Saved list */}
        {filteredSavedLists.length > 0 && (
          <CardGroup>
            {filteredSavedLists.map((item) => {
              return <ItemCard key={item.id}><ShoppingListCard id={item.id} name={item.name} /></ItemCard>
            })}
          </CardGroup>
        )}

        <IBottomSheetModal
          ref={bottomSheetRef}
          title="Create"
        >
          <View style={styles.optionsContent}>

            {createOptions.map((option, id) => (
              <CreateOptionCard
                key={id}
                title={option.title}
                description={option.description}
                icon={option.icon}
                onPress={option.onPress}
              />)
            )}
          </View>
        </IBottomSheetModal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  optionsContent: {
    gap: 12,
    paddingBottom: 24,
  },
});
