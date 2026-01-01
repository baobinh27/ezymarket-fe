import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Pressable, ScrollView, TextInput, TouchableOpacity, View } from "react-native";

import IButton from "@/components/IButton";
import dictionaryStyles from "@/components/dictionary/dictionary.styles";
import { IText } from "@/components/styled";
import DictionaryFridgeItems from "./fridge-items";
import DictionaryRecipes from "./recipes";
import DictionaryUnits from "./units";

type DictionaryTab = "fridge-items" | "recipes" | "units";

interface DictionaryTabItem {
  name: DictionaryTab;
  title: string;
}

export default function DictionaryScreen() {
  const [activeTab, setActiveTab] = useState<DictionaryTab>("fridge-items");
  const [searchQuery, setSearchQuery] = useState("");

  const fridgeItemsRef = useRef<any>(null);
  const recipesRef = useRef<any>(null);
  const unitsRef = useRef<any>(null);

  const tabs: DictionaryTabItem[] = [
    { name: "fridge-items", title: "Fridge Items" },
    { name: "recipes", title: "Recipes" },
    { name: "units", title: "Units" },
  ];

  const handleCreateNew = () => {
    if (activeTab === "fridge-items") {
      fridgeItemsRef.current?.handleCreateNew();
    } else if (activeTab === "recipes") {
      recipesRef.current?.handleCreateNew();
    } else if (activeTab === "units") {
      unitsRef.current?.handleCreateNew();
    }
  };

  return (
    <View style={dictionaryStyles.container}>
      {/* Tabs */}
      <View style={dictionaryStyles.tabsContainer}>
        {tabs.map((tab) => (
          <Pressable
            key={tab.name}
            onPress={() => setActiveTab(tab.name)}
            style={[dictionaryStyles.tab, activeTab === tab.name && dictionaryStyles.tabActive]}
          >
            <IText size={12} semiBold color={activeTab === tab.name ? "white" : "#000000B4"}>
              {tab.title}
            </IText>
          </Pressable>
        ))}
      </View>

      {/* Search Bar with New Button */}
      <View style={dictionaryStyles.searchBarContainer}>
        <View style={dictionaryStyles.searchInputContainer}>
          <Octicons name="search" size={20} color="#000000B4" style={dictionaryStyles.searchIcon} />
          <TextInput
            style={dictionaryStyles.searchInput}
            placeholder="Search the dictionary..."
            placeholderTextColor="#000000B4"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={dictionaryStyles.filterIcon}>
            <MaterialCommunityIcons name="filter-outline" size={20} color="#000000B4" />
          </TouchableOpacity>
        </View>

        <IButton variant="primary" onPress={handleCreateNew} style={dictionaryStyles.newButton}>
          <IText color="white" semiBold>
            + New
          </IText>
        </IButton>
      </View>

      {/* Content - Each tab component handles its own modal */}
      <ScrollView style={dictionaryStyles.content} showsVerticalScrollIndicator={false}>
        {activeTab === "fridge-items" && (
          <DictionaryFridgeItems ref={fridgeItemsRef} searchQuery={searchQuery} />
        )}
        {activeTab === "recipes" && (
          <DictionaryRecipes ref={recipesRef} searchQuery={searchQuery} />
        )}
        {activeTab === "units" && <DictionaryUnits ref={unitsRef} searchQuery={searchQuery} />}
      </ScrollView>
    </View>
  );
}
