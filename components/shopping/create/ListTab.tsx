import { useToast } from "@/components/IToast";
import { Ingredient } from "@/types/types";
import { Entypo } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import IButton from "../../IButton";
import QuantitySelector from "../../QuantitySelector";
import { ItemCard, ItemImageWithFallback, IText } from "../../styled";
import UnitSelector from "../../UnitSelector";

interface CreateItem {
    ingredientId?: string;
    name: string;
    quantity: number;
    unitId: string;
    imageURL?: string | null;
}

interface SelectedIngredientItem extends Ingredient {
    id: string; // unique identifier for this instance in the list
    quantity: number;
    selectedUnit: string;
}

interface ListTabProps {
    selectedIngredients: Ingredient[];
    onRemoveIngredient: (ingredientId: string) => void;
    onConfirmItem: (item: CreateItem) => void;
    onClose?: () => void;
}

const ListTab = ({
    selectedIngredients,
    onRemoveIngredient,
    onConfirmItem,
    onClose,
}: ListTabProps) => {

    const [items, setItems] = useState<SelectedIngredientItem[]>([]);
    const { showToast } = useToast();

    // Effect to sync new ingredients from props to local state
    useEffect(() => {
        setItems(prev => {
            const existingIds = new Set(prev.map(i => i._id));
            const newItems = selectedIngredients.filter(ing => !existingIds.has(ing._id)).map((ing, idx) => ({
                ...ing,
                id: `${ing._id}-${Date.now()}`,
                quantity: 1,
                selectedUnit: "",
            }));

            const currentSelectedIds = new Set(selectedIngredients.map(i => i._id));
            const filteredPrev = prev.filter(i => currentSelectedIds.has(i._id));

            return [...filteredPrev, ...newItems];
        });
    }, [selectedIngredients]);


    const handleQuantityChange = useCallback(
        (id: string, newQuantity: number) => {
            setItems((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, quantity: newQuantity } : item
                )
            );
        },
        []
    );

    const handleUnitChange = useCallback((id: string, newUnit: string) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, selectedUnit: newUnit } : item
            )
        );
    }, []);

    const handleRemoveItem = useCallback((id: string, ingredientId: string) => {
        // Remove locally
        setItems((prev) => prev.filter((item) => item.id !== id));
        // Remove from parent selection
        onRemoveIngredient(ingredientId);
    }, [onRemoveIngredient]);

    const handleAddItem = useCallback(
        (item: SelectedIngredientItem) => {
            if (!item.selectedUnit) {
                showToast("Please select a unit", "error");
                return;
            }

            const newItem: CreateItem = {
                name: item.name,
                quantity: item.quantity,
                unitId: item.selectedUnit,
                ingredientId: item._id,
                imageURL: item.imageURL,
            };

            onConfirmItem(newItem);

            handleRemoveItem(item.id, item._id);
        },
        [onConfirmItem, handleRemoveItem, showToast]
    );

    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <IText style={{ textAlign: "center", }}>Select ingredients from Browse tab to continue</IText>
            </View>
        );
    }

    return (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                {items.map((item) => {
                    return (
                        <ItemCard key={item.id} style={styles.itemPanel}>
                            <View style={styles.panelHeader}>
                                <View style={styles.itemInfo}>
                                    <ItemImageWithFallback
                                        source={item.imageURL}
                                        style={styles.itemImage}
                                    />
                                    <IText semiBold size={14}>
                                        {item.name}
                                    </IText>
                                </View>
                                <IButton
                                    variant="none"
                                    onPress={() => handleRemoveItem(item.id, item._id)}
                                    style={styles.removeButton}
                                >
                                    <Entypo name="trash" size={18} color="#000000B4" />
                                </IButton>
                                <IButton
                                    variant="primary"
                                    onPress={() => handleAddItem(item)}
                                    style={styles.addButton}
                                >
                                    <Entypo name="plus" size={16} color="white" />
                                    <IText semiBold color="white" size={12}>
                                        Done
                                    </IText>
                                </IButton>
                            </View>

                            <View style={styles.fieldRow}>
                                <View style={styles.fieldGroup}>
                                    <IText size={12} color="#666">
                                        Quantity *
                                    </IText>
                                    <QuantitySelector
                                        state={item.quantity}
                                        setState={(newQuantity) => {
                                            handleQuantityChange(item.id, newQuantity as number);
                                        }}
                                    />
                                </View>

                                <View style={[styles.fieldGroup, styles.unitField]}>
                                    <IText size={12} color="#666">
                                        Unit *
                                    </IText>
                                    <UnitSelector
                                        value={item.selectedUnit}
                                        onChange={(unit) => handleUnitChange(item.id, unit)}
                                        maxModalHeight="40%"
                                        buttonStyle={{ height: 20 }}
                                    />
                                </View>
                            </View>
                        </ItemCard>
                    );
                })}
            </View>

            <View style={styles.spacer} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 0,
        paddingVertical: 8,
        gap: 12,
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    itemPanel: {
        flexDirection: "column",
        paddingHorizontal: 12,
        paddingVertical: 12,
        gap: 12,
    },
    panelHeader: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 4,
    },
    itemInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        flex: 1,
    },
    itemImage: {
        width: 40,
        height: 40,
        borderRadius: 4,
    },
    removeButton: {
        padding: 6,
        borderRadius: 4,
    },
    fieldRow: {
        width: "100%",
        flexDirection: "row",
        gap: 10,
    },
    fieldGroup: {
        flex: 1,
        gap: 6,
    },
    unitField: {
        flex: 1,
    },
    addButton: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    spacer: {
        height: 20,
    },
});

export default ListTab;
