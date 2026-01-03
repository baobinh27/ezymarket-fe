import IBottomSheetModal from "@/components/IBottomSheetModal";
import IButton from "@/components/IButton";
import { useToast } from "@/components/IToast";
import QuantitySelector from "@/components/QuantitySelector";
import { SearchBox } from "@/components/SearchBox";
import AddItemCard from "@/components/shopping/AddItemCard";
import { ItemCard, ItemImage, IText } from "@/components/styled";
import UnitSelector from "@/components/UnitSelector";
import useGetAllIngredients from "@/hooks/ingredients/useGetAllIngredients";
import { useIngredientSuggestions } from "@/hooks/ingredients/useIngredientSuggestions";
import { useAddShoppingItem, useDeleteItem, useShoppingList, useUpdateItem, useUpdateShoppingList } from "@/hooks/shopping/useShopping";
import { MaterialCommunityIcons, Octicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CreateItem {
    _id?: string;
    name: string;
    quantity: number;
    unitId: string;
    imageURL?: string | null;
}

export default function UpdateShoppingListScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [searchText, setSearchText] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // List Details State
    const [listName, setListName] = useState("");
    const [description, setDescription] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);

    // Local state for items
    const [items, setItems] = useState<CreateItem[]>([]);

    // API Hooks
    const { data: list, isLoading: isListLoading } = useShoppingList(id!);
    const { data: recommendedData, isLoading: isLoadingRecommended } = useGetAllIngredients({
        params: { limit: 10 },
        enabled: true,
    });
    const { data: suggestions, isLoading: isLoadingSuggestions } = useIngredientSuggestions(searchText);

    const addMutation = useAddShoppingItem();
    const updateMutation = useUpdateItem();
    const deleteMutation = useDeleteItem();
    const updateListMutation = useUpdateShoppingList();

    const { showToast } = useToast();

    // Sync list data to local state
    useEffect(() => {
        if (list) {
            setListName(list.title);
            setDescription(list.description || "");

            if (list.items) {
                setItems(list.items.map(item => ({
                    _id: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    unitId: item.unitId?._id || "",
                    imageURL: item.ingredientId?.imageURL || "",
                })));
            }
            // setIsInitialized(true);
        }
    }, [list]);

    const handleUpdateList = (data: { title?: string; description?: string }) => {
        if (!id) return;

        const payload = {
            title: data.title !== undefined ? data.title : listName,
            description: data.description !== undefined ? data.description : description
        };

        updateListMutation.mutate({ id, data: payload }, {
            onSuccess: () => {
                showToast("List updated successfully", "success");
            },
            onError: (error: any) => {
                console.log("Update error:", error);
                const msg = error?.response?.data?.message || error?.message || "Unknown error";
                showToast(`Failed: ${msg}`, "error");

                // Revert changes
                if (list) {
                    setListName(list.title);
                    setDescription(list.description || "");
                }
            }
        });
    }

    const handleAddItem = () => {
        setIsModalOpen(true);
        bottomSheetRef.current?.present();
    };


    const handleDeleteItem = (index: number) => {
        const item = items[index];
        if (item._id) {
            // Optimistic delete from UI
            setItems(prev => prev.filter((_, i) => i !== index));

            deleteMutation.mutate({ listId: id!, itemId: item._id }, {
                onSuccess: () => {
                    showToast(`Deleted ${item.name}`, "success");
                },
                onError: () => {
                    showToast(`Failed to delete ${item.name}`, "error");
                }
            });
        }
    };

    const handleSelectItem = (ingredient: any) => {
        addMutation.mutate({
            listId: id!,
            item: {
                name: ingredient.name,
                quantity: 1,
                unit: "pieces",
                ingredientId: ingredient._id
            }
        }, {
            onSuccess: () => {
                showToast(`Added ${ingredient.name}`, "success");
            },
            onError: () => {
                showToast(`Failed to add ${ingredient.name}`, "error");
            }
        });
    };

    const updateLocalItemQuantity = (index: number, quantity: number) => {
        const updated = [...items];
        updated[index].quantity = quantity;
        setItems(updated);
    };

    const updateLocalItemUnit = (index: number, unit: string) => {
        const updated = [...items];
        updated[index].unitId = unit;
        setItems(updated);
    };

    const handleUpdateItem = (index: number) => {
        const item = items[index];
        if (item._id) {
            updateMutation.mutate({
                listId: id!,
                itemId: item._id,
                data: {
                    quantity: item.quantity,
                    unitId: item.unitId
                }
            }, {
                onSuccess: () => {
                    showToast(`${item.name} updated`, "success");
                },
                onError: () => {
                    showToast(`Failed to update ${item.name}`, "error");
                }
            });
        }
    };


    if (isListLoading || items.length === 0) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <SafeAreaView style={[{ flex: 1 }, isModalOpen && styles.scrollViewWithModal]} edges={[]}>
                <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>

                    {/* Header Section */}
                    <View style={styles.headerSection}>
                        {isEditingName ? (
                            <TextInput
                                style={styles.nameInput}
                                value={listName}
                                onChangeText={setListName}
                                onBlur={() => {
                                    setIsEditingName(false);
                                    if (listName !== list?.title) {
                                        handleUpdateList({ title: listName });
                                    }
                                }}
                                autoFocus
                            />
                        ) : (
                            <TouchableOpacity
                                style={styles.nameDisplay}
                                onPress={() => setIsEditingName(true)}
                            >
                                <IText size={24} bold color="#000">
                                    {listName || list?.title}
                                </IText>
                                <Octicons style={{ paddingTop: 8 }} name="pencil" size={18} color="#46982D" />
                            </TouchableOpacity>
                        )}

                        <View style={styles.inputGroup}>
                            <IText size={14} semiBold style={{ marginBottom: 8 }}>Description</IText>
                            {isEditingDescription ? (
                                <TextInput
                                    style={styles.descriptionInput}
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder="Add any notes..."
                                    placeholderTextColor="#9CA3AF"
                                    multiline
                                    numberOfLines={2}
                                    textAlignVertical="top"
                                    autoFocus
                                    onBlur={() => {
                                        setIsEditingDescription(false);
                                        if (description !== list?.description) {
                                            handleUpdateList({ description });
                                        }
                                    }}
                                />
                            ) : (
                                <TouchableOpacity
                                    onPress={() => setIsEditingDescription(true)}
                                    style={styles.descriptionDisplay}
                                >
                                    <IText size={14} color={description ? "#000000B4" : "#9CA3AF"}>
                                        {description || "Add any notes"}
                                    </IText>
                                    <Octicons name="pencil" size={14} color="#46982D" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Actions Section */}
                    <View style={styles.actionSection}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <IText size={18} semiBold>Items ({items.length})</IText>
                            <TouchableOpacity onPress={handleAddItem}>
                                <IText color="#46982D" semiBold>+ Add Items</IText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Items List */}
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingBottom: 16 }}>
                    <View style={{ gap: 12, flex: 1 }}>
                        {items.length === 0 ? (
                            <View style={styles.emptyState}>
                                <View style={styles.emptyStateIcon}>
                                    <Octicons name="list-unordered" size={32} color="#9CA3AF" />
                                </View>
                                <IText color="#6B7280" style={{ textAlign: 'center', marginTop: 8 }}>
                                    No items yet. Start by adding some!
                                </IText>
                                <IButton variant="primary" onPress={handleAddItem} style={{ marginTop: 10, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 }}>
                                    <IText semiBold color="white">Browse Ingredients</IText>
                                </IButton>
                            </View>
                        ) : (
                            items.map((item, index) => (
                                <ItemCard key={index}>
                                    <View style={styles.itemContent}>
                                        <ItemImage
                                            src={item.imageURL || "https://placehold.co/48x48"}
                                            style={styles.itemImage}
                                        />
                                        <View style={styles.itemDetails}>
                                            <IText semiBold size={14}>{item.name}</IText>
                                            <View style={styles.quantityRow}>
                                                <QuantitySelector
                                                    state={item.quantity}
                                                    maxState={100}
                                                    setState={(value) => updateLocalItemQuantity(index, value)}
                                                />
                                                <UnitSelector
                                                    value={item.unitId}
                                                    onChange={(value) => updateLocalItemUnit(index, value)}
                                                />
                                            </View>
                                        </View>
                                        {/* Update Button */}
                                        <TouchableOpacity
                                            onPress={() => handleUpdateItem(index)}

                                        >
                                            <MaterialCommunityIcons name="content-save-edit-outline" size={26} color="#46982D" />
                                        </TouchableOpacity>

                                        {/* Delete Button */}
                                        <TouchableOpacity
                                            onPress={() => handleDeleteItem(index)}
                                            style={styles.menuButton}
                                        >
                                            <Octicons name="trash" size={22} color="#eb000090" />
                                        </TouchableOpacity>
                                    </View>
                                </ItemCard>
                            ))
                        )}
                    </View>
                </ScrollView>
                {/* No Footer */}
            </SafeAreaView>

            {/* Add Items Bottom Sheet */}
            <IBottomSheetModal
                ref={bottomSheetRef}
                title="Add new items"
                snapPoints={["75%"]}
                onClose={() => {
                    setIsModalOpen(false);
                    setSearchText("");
                }}
            >
                <SearchBox
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Search for category or items..."
                    containerStyle={styles.searchBoxContainer}
                />
                <BottomSheetScrollView
                    style={styles.itemsList}
                    contentContainerStyle={styles.itemsListContent}
                    showsVerticalScrollIndicator={false}
                >
                    {(searchText === "" && isLoadingRecommended) || (searchText.length > 1 && isLoadingSuggestions) ? (
                        <ActivityIndicator style={{ marginTop: 20 }} />
                    ) : (
                        (searchText.length > 1 ? suggestions?.ingredients : recommendedData?.ingredients)?.map((item: any, index: number) => (
                            <AddItemCard
                                key={item._id || index}
                                name={item.name}
                                imageUrl={item.imageURL}
                                onPress={() => handleSelectItem(item)}
                                disabled={items.some(i => i.name === item.name)}
                            />
                        ))
                    )}

                    <View style={styles.redirector}>
                        <IText style={{ width: '65%' }}>Don’t see your items? Create it for your own use!</IText>
                        <IButton
                            variant="primary"
                            onPress={() => {
                            }}
                            style={styles.redirectorButton}
                        >
                            <IText color="white" semiBold>Create Now!</IText>

                        </IButton>
                    </View>
                </BottomSheetScrollView>
            </IBottomSheetModal>
        </View>
    );
}

const styles = StyleSheet.create({
    scrollViewWithModal: {
        opacity: 0.5,
    },
    headerSection: {
        marginBottom: 24,
    },
    inputGroup: {
        marginTop: 16,
    },
    descriptionInput: {
        backgroundColor: "#F3F4F6",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        fontSize: 14,
        color: "#1F2937",
        fontFamily: "Inter_Regular",
        minHeight: 20,
    },
    descriptionDisplay: {
        paddingHorizontal: 0,
        paddingVertical: 8,
        borderRadius: 12,
        minHeight: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    nameInput: {
        paddingVertical: 4,
        fontSize: 24,
        fontFamily: "Inter_700Bold",
        color: "#000000B4",
        borderBottomWidth: 1,
        borderColor: "#000000B4",
        marginLeft: 2,
    },
    nameDisplay: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderColor: "#E5E7EB",
    },

    actionSection: {
        marginBottom: 16,
    },
    createButton: {
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    emptyStateIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Existing Item Styles
    itemContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    menuButton: {
        paddingLeft: 12,
        paddingRight: 4,
    },
    itemImage: {
        width: 48,
        height: 48,
        borderRadius: 8,
    },
    itemDetails: {
        flex: 1,
        gap: 4,
    },
    quantityRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6
    },
    searchBoxContainer: {
        flex: 0,
        marginBottom: 10
    },
    itemsList: {
        flex: 1,
    },
    itemsListContent: {
        paddingBottom: 24,
    },
    redirector: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        padding: 5,
        gap: 5
    },
    redirectorButton: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundImage: 'linear-gradient(135deg, #46982D, #82CD47)',
    }
});
