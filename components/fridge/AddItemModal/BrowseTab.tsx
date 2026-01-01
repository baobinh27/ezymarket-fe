import useGetAllIngredients from "@/hooks/ingredients/useGetAllIngredients";
import { Ingredient } from "@/types/types";
import { Entypo } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import IButton from "../../IButton";
import ISelect from "../../ISelect";
import SearchBar from "../../SearchBar";
import { ItemCard, ItemImageWithFallback, IText } from "../../styled";

type ItemType = "ingredients" | "dishes";

const ItemOptions = [
  { value: "ingredients", label: "Ingredients" },
  { value: "dishes", label: "Dishes" },
];

interface BrowseTabProps {
  onSelectIngredient: (ingredient: Ingredient) => void;
  selectedIngredientIds: Set<string>;
}

const BrowseTab = ({ onSelectIngredient, selectedIngredientIds }: BrowseTabProps) => {
  const [itemType, setItemType] = useState<ItemType>("ingredients");
  const [searchInput, setSearchInput] = useState("");
  const [isReady, setIsReady] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Memoize params so they're only recreated when searchInput changes
  const params = useMemo(
    () => ({
      search: searchInput,
    }),
    [searchInput]
  );

  const {
    data,
    isFetching,
    refetch: fetchIngredients,
  } = useGetAllIngredients({
    params,
    enabled: false,
  });

  // Debounce search with proper cleanup
  useEffect(() => {
    setIsReady(false);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      await fetchIngredients();
      setIsReady(true);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchInput, fetchIngredients]);

  const handleItemTypeChange = useCallback((newValue: any) => {
    setItemType(typeof newValue === "string" ? (newValue as ItemType) : "ingredients");
  }, []);

  const handleSearchChange = useCallback((text: string) => {
    setSearchInput(text);
  }, []);

  const handleGoDictionary = useCallback(() => {
    // TODO: route to dict
  }, []);

  const handleSelectIngredient = useCallback(
    (ingredient: Ingredient) => {
      onSelectIngredient(ingredient);
    },
    [onSelectIngredient]
  );

  const showRefetchLoading = isFetching;

  return (
    <View style={styles.content}>
      <View style={styles.selection}>
        <ISelect
          buttonStyle={styles.selectButton}
          buttonTextStyle={styles.selectButtonText}
          value={itemType}
          options={ItemOptions}
          onChange={handleItemTypeChange}
        />
        <SearchBar
          containerStyle={styles.searchBar}
          onChangeText={handleSearchChange}
          value={searchInput}
        />
      </View>

      {showRefetchLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#82CD47" />
        </View>
      ) : data && Array.isArray(data.ingredients) && data.ingredients.length === 0 ? (
        <View style={styles.content}>
          <Entypo style={{ alignSelf: "center" }} name="emoji-sad" color="#000000B4" size={32} />
          <IText style={styles.emptyListMessage}>
            The list is empty. This could be a result of lacking various items in our database. You
            might want to add your own items in your personal list below.
          </IText>
          <IButton
            variant="secondary"
            onPress={handleGoDictionary}
            style={styles.goToDictionaryBtn}
          >
            <IText semiBold color="#46982D">
              Go to Dictionary
            </IText>
          </IButton>
        </View>
      ) : data && isReady && Array.isArray(data.ingredients) && data.ingredients.length !== 0 ? (
        <>
          {data.ingredients.map((ingredient: Ingredient) => {
            const isSelected = selectedIngredientIds.has(ingredient._id);
            return (
              <ItemCard key={ingredient._id} style={isSelected && styles.selectedItem}>
                <View style={styles.leftGroup}>
                  <ItemImageWithFallback source={ingredient.imageURL} />
                  <IText semiBold>{ingredient.name}</IText>
                </View>

                <IButton
                  variant="secondary"
                  style={styles.addButton}
                  onPress={() => handleSelectIngredient(ingredient)}
                >
                  <Entypo
                    name={isSelected ? "check" : "plus"}
                    size={24}
                    color={isSelected ? "#4CAF50" : "#82CD47"}
                  />
                </IButton>
              </ItemCard>
            );
          })}
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#82CD47" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  goToDictionaryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "center",
  },
  emptyListMessage: {
    width: "80%",
    textAlign: "center",
    alignSelf: "center",
  },
  content: {
    flexDirection: "column",
    gap: 12,
  },
  selection: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  selectButton: {
    borderColor: "#82CD47",
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selectButtonText: {
    fontSize: 12,
  },
  searchBar: {
    flex: 1,
  },
  leftGroup: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  addButton: {
    padding: 4,
    borderRadius: 6,
  },
  itemButton: {
    width: "100%",
  },
  selectedItem: {
    backgroundColor: "#F0F7F0",
    borderLeftWidth: 3,
    borderLeftColor: "#4CAF50",
  },
});

export default BrowseTab;
