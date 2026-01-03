import { useToast } from "@/components/IToast";
import useGetAllIngredients from "@/hooks/ingredients/useGetAllIngredients";
import { Ingredient } from "@/types/types";
import { Entypo } from "@expo/vector-icons";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import IButton from "../../IButton";
import SearchBar from "../../SearchBar";
import { ItemCard, ItemImageWithFallback, IText } from "../../styled";

interface BrowseTabProps {
    onSelectIngredient: (ingredient: Ingredient) => void;
    selectedIngredientIds: Set<string>;
    existingIngredientIds?: Set<string>;
}

const BrowseTab = ({ onSelectIngredient, selectedIngredientIds, existingIngredientIds }: BrowseTabProps) => {
    const [searchInput, setSearchInput] = useState("");
    const [isReady, setIsReady] = useState(false);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { showToast } = useToast();

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
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.selection}>
                    <SearchBar
                        containerStyle={styles.searchBar}
                        onChangeText={handleSearchChange}
                        value={searchInput}
                    />
                </View>
            </View>

            {showRefetchLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#82CD47" />
                </View>
            ) : data &&
                Array.isArray(data.ingredients) &&
                data.ingredients.length === 0 ? (
                <View style={styles.content}>
                    <Entypo
                        style={{ alignSelf: "center" }}
                        name="emoji-sad"
                        color="#000000B4"
                        size={32}
                    />
                    <IText style={styles.emptyListMessage}>
                        The list is empty. This could be a result of lacking various items
                        in our database. You might want to add your own items in your
                        personal list below.
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
            ) : data &&
                isReady &&
                Array.isArray(data.ingredients) &&
                data.ingredients.length !== 0 ? (
                <BottomSheetScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {data.ingredients.map((ingredient: Ingredient) => {
                        const isSelected = selectedIngredientIds.has(ingredient._id);
                        const isAdded = existingIngredientIds?.has(ingredient._id);

                        return (
                            <ItemCard key={ingredient._id} style={(isSelected || isAdded) && styles.selectedItem}>
                                <View style={styles.leftGroup}>
                                    <ItemImageWithFallback source={ingredient.imageURL} />
                                    <IText semiBold>{ingredient.name}</IText>
                                </View>

                                {isAdded ? (
                                    <TouchableOpacity
                                        onPress={() => showToast(`${ingredient.name} is already added`, "info")}
                                        style={styles.addButton}
                                    >
                                        <IText color="#4CAF50" semiBold>Added</IText>
                                    </TouchableOpacity>
                                ) : (
                                    <IButton
                                        variant="secondary"
                                        style={styles.addButton}
                                        onPress={() => handleSelectIngredient(ingredient)}
                                    >
                                        <Entypo name={isSelected ? "check" : "plus"} size={24} color={isSelected ? "#4CAF50" : "#82CD47"} />
                                    </IButton>
                                )}
                            </ItemCard>
                        );
                    })}
                </BottomSheetScrollView>
            ) : (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#82CD47" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        gap: 12,
    },
    header: {
        paddingBottom: 4
    },
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
    scrollContent: {
        gap: 12,
        paddingBottom: 20
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
        borderColor: "#82CD47",
        borderWidth: 1,
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
