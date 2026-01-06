import IBottomSheetModal from "@/components/IBottomSheetModal";
import IButton from "@/components/IButton";
import CreateOptionCard, { useCreateOptions } from "@/components/shopping/CreateOptionCard";
import ShoppingListCard from "@/components/shopping/ShoppingListCard";
import { CardGroup, ItemCard, IText } from "@/components/styled";
import { Octicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import SearchBar from "@/components/SearchBar";
import useGetMyGroups from "@/hooks/group/useGetMyGroups";
import { useShoppingLists } from "@/hooks/shopping/useShopping";
// import { useAuth } from "@/services/auth/auth.context";

export default function ShoppingScreen() {
  // const { user } = useAuth();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [searchText, setSearchText] = useState("");

  const { data: groupsData, isLoading: groupsLoading } = useGetMyGroups();

  const { data: shoppingLists = [], isLoading } = useShoppingLists(groupsData?.groups?.[0]?.id);

  const handleDismissModal = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const createOptions = useCreateOptions(handleDismissModal);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const filteredActiveLists = useMemo(() => {
    return shoppingLists
      .filter((list) => list.status === "active")
      .filter((list) => list.title.toLowerCase().includes(searchText.toLowerCase()));
  }, [searchText, shoppingLists]);

  const filteredSavedLists = useMemo(() => {
    return shoppingLists
      .filter((list) => list.status !== "active")
      .filter((list) => list.title.toLowerCase().includes(searchText.toLowerCase()));
  }, [searchText, shoppingLists]);

  return (
    <View
      style={{
        padding: 16,
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 8,
        }}
      >
        {/* Search box */}
        {/* <SearchBox
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search..."
          containerStyle={{ flex: 1.8 }}
        /> */}
        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search..."
          containerStyle={{ flex: 2 }}
        />

        <IButton
          variant="primary"
          style={{
            borderRadius: 10,
            // paddingVertical: 16,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
          onPress={handlePresentModalPress}
        >
          <Octicons size={24} name="plus" color="white" />
          <IText size={15} color="white" semiBold>
            Create
          </IText>
        </IButton>
      </View>
      <ScrollView style={{ paddingTop: 16 }} contentContainerStyle={{ gap: 16 }}>
        {isLoading && <ActivityIndicator size="large" />}

        {/* Active list */}
        {filteredActiveLists.length > 0 && (
          <CardGroup>
            {filteredActiveLists.map((item) => {
              return (
                <ItemCard primary key={item._id}>
                  <ShoppingListCard
                    id={item._id}
                    name={item.title}
                    itemsCount={item.items?.length || 0}
                    date={item.updatedAt}
                    active
                  />
                </ItemCard>
              );
            })}
          </CardGroup>
        )}

        {/* Saved list */}
        {filteredSavedLists.length > 0 && (
          <CardGroup>
            {filteredSavedLists.map((item) => {
              return (
                <ItemCard key={item._id}>
                  <ShoppingListCard
                    id={item._id}
                    name={item.title}
                    itemsCount={item.items?.length || 0}
                    date={item.updatedAt}
                  />
                </ItemCard>
              );
            })}
          </CardGroup>
        )}

        {filteredSavedLists.length === 0 && !isLoading && (
          <View style={styles.emptyStateContainer}>
            <Octicons name="inbox" size={48} color="#CCCCCC" />
            <IText color="#999999" style={styles.emptyStateText}>
              No saved lists yet
            </IText>
          </View>
        )}

        <IBottomSheetModal ref={bottomSheetRef} title="Create">
          <View style={styles.optionsContent}>
            {createOptions.map((option, id) => (
              <CreateOptionCard
                key={id}
                title={option.title}
                description={option.description}
                icon={option.icon}
                onPress={option.onPress}
              />
            ))}
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
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 14,
  },
});
