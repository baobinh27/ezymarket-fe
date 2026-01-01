import useGetAllIngredients from "@/hooks/ingredients/useGetAllIngredients";
import { Entypo } from "@expo/vector-icons";
import { Ref, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import IBottomSheetModal from "../IBottomSheetModal";
import IButton from "../IButton";
import ISelect from "../ISelect";
import SearchBar from "../SearchBar";
import { ItemCard, ItemImageWithFallback, IText } from "../styled";

type AddItemModalProps = {
  ref: Ref<any>;
  // onClose: () => void
};

type ItemType = "ingredients" | "dishes";

const ItemOptions = [
  { value: "ingredients", label: "Ingredients" },
  { value: "dishes", label: "Dishes" },
];

// Don't use this
const AddItemModal = ({ ref }: AddItemModalProps) => {
  const [hasModalLoaded, setHasModalLoaded] = useState(false);
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
    isError,
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

  const handleAddItem = () => {};

  const handleCloseModal = useCallback(() => {
    setIsReady(false);
    setHasModalLoaded(false);
    setSearchInput("");
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  const handleModalChange = useCallback(
    async (index: number) => {
      if (index === 0 && !hasModalLoaded) {
        await fetchIngredients();
        setHasModalLoaded(true);
        setIsReady(true);
      }
    },
    [hasModalLoaded, fetchIngredients]
  );

  const showInitialLoading = !hasModalLoaded;
  const showRefetchLoading = isFetching;

  return (
    <IBottomSheetModal
      title="New item"
      ref={ref}
      snapPoints={["75%", "100%"]}
      onChange={handleModalChange}
      onClose={handleCloseModal}
    >
      {showInitialLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      ) : isError ? (
        <View style={styles.loadingContainer}>
          <View style={styles.errorBox}>
            <Entypo name="circle-with-cross" size={24} />
            <IText style={styles.errorText}>Something went wrong. Please try again later.</IText>
          </View>
        </View>
      ) : (
        <View>
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
              <View>
                <ActivityIndicator color="#82CD47" />
              </View>
            ) : data && Array.isArray(data.ingredients) && data.ingredients.length === 0 ? (
              <>
                <IText>
                  The list is empty. This could be a result of lacking various items in our
                  database. You might want to add your own items in your personal list below.
                </IText>
                <IButton
                  variant="secondary"
                  onPress={handleGoDictionary}
                  style={styles.goToFridgeBtn}
                >
                  <IText semiBold color="#46982D">
                    Go to Dictionary
                  </IText>
                </IButton>
              </>
            ) : data &&
              isReady &&
              Array.isArray(data.ingredients) &&
              data.ingredients.length !== 0 ? (
              <>
                {data.ingredients.map((ingredient) => {
                  return (
                    <ItemCard key={ingredient._id}>
                      <View style={styles.leftGroup}>
                        <ItemImageWithFallback source={ingredient.imageURL} />
                        <IText semiBold>{ingredient.name}</IText>
                      </View>

                      <IButton variant="secondary" style={styles.addButton} onPress={handleAddItem}>
                        <Entypo name="plus" size={24} color="#82CD47" />
                      </IButton>
                    </ItemCard>
                  );
                })}
              </>
            ) : (
              <View>
                <ActivityIndicator color="#82CD47" />
              </View>
            )}
          </View>
        </View>
      )}
    </IBottomSheetModal>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorBox: {
    flexDirection: "column",
    gap: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#ff00004B",
    padding: 8,
    borderRadius: 8,
  },
  errorText: {
    textAlign: "center",
  },
  goToFridgeBtn: {
    paddingVertical: 8,
    borderRadius: 6,
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
});

export default AddItemModal;
