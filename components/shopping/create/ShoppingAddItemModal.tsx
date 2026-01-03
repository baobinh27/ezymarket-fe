import { Ingredient } from "@/types/types";
import { Ref, useCallback, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import IBottomSheetModal from "../../IBottomSheetModal";
import { IText } from "../../styled";
import BrowseTab from "./BrowseTab";
import ListTab from "./ListTab";

interface CreateItem {
    ingredientId?: string;
    name: string;
    quantity: number;
    unitId: string;
    imageURL?: string | null;
}

type ShoppingAddItemModalProps = {
    ref: Ref<any>;
    onClose?: () => void;
    onConfirmItem: (item: CreateItem) => void;
    existingIngredientIds?: Set<string>;
};

type TabName = "browse" | "list";

export default function ShoppingAddItemModal({ ref, onClose, onConfirmItem, existingIngredientIds }: ShoppingAddItemModalProps) {
    const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
    const [selectedIngredientIds, setSelectedIngredientIds] = useState<Set<string>>(new Set());
    const [activeTab, setActiveTab] = useState<TabName>("browse");

    const handleSelectIngredient = useCallback((ingredient: Ingredient) => {
        setSelectedIngredients((prev) => {
            const exists = prev.some((ing) => ing._id === ingredient._id);
            if (exists) {
                // Remove if already selected
                return prev.filter((ing) => ing._id !== ingredient._id);
            } else {
                // Add if not selected
                return [...prev, ingredient];
            }
        });

        setSelectedIngredientIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(ingredient._id)) {
                newSet.delete(ingredient._id);
            } else {
                newSet.add(ingredient._id);
            }
            return newSet;
        });
    }, []);

    const handleRemoveIngredient = useCallback((ingredientId: string) => {
        setSelectedIngredients((prev) =>
            prev.filter((ing) => ing._id !== ingredientId)
        );
        setSelectedIngredientIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(ingredientId);
            return newSet;
        });
    }, []);

    const handleCloseModal = useCallback(() => {
        if (ref && 'current' in ref && ref.current) {
            (ref.current as any).dismiss();
        }
        setSelectedIngredients([]);
        setSelectedIngredientIds(new Set());
        setActiveTab("browse");
        onClose?.();
    }, [onClose, ref]);

    return (
        <IBottomSheetModal
            title="Add new items"
            ref={ref}
            snapPoints={["73%"]}
            onClose={handleCloseModal}
            enablePanDownToClose={false}
        >
            <View style={styles.container}>
                {/* Tab Navigation */}
                <View style={styles.tabBar}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === "browse" && styles.activeTab]}
                        onPress={() => setActiveTab("browse")}
                    >
                        <IText
                            semiBold
                            size={12}
                            color={activeTab === "browse" ? "#FFFFFF" : "#000000B4"}
                        >
                            Browse
                        </IText>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === "list" && styles.activeTab]}
                        onPress={() => setActiveTab("list")}
                    >
                        <IText
                            semiBold
                            size={12}
                            color={activeTab === "list" ? "#FFFFFF" : "#000000B4"}
                        >
                            List {selectedIngredients.length > 0 && `(${selectedIngredients.length})`}
                        </IText>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                <View style={styles.content}>
                    {activeTab === "browse" ? (
                        <BrowseTab
                            onSelectIngredient={handleSelectIngredient}
                            selectedIngredientIds={selectedIngredientIds}
                            existingIngredientIds={existingIngredientIds}
                            onClose={handleCloseModal}
                        />
                    ) : (
                        <ListTab
                            selectedIngredients={selectedIngredients}
                            onRemoveIngredient={handleRemoveIngredient}
                            onConfirmItem={onConfirmItem}
                            onClose={handleCloseModal}
                        />
                    )}
                </View>
            </View>
        </IBottomSheetModal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabBar: {
        flexDirection: "row",
        backgroundColor: "#ffffff",
        borderRadius: 10,
        marginHorizontal: 0,
        marginBottom: 12,
        overflow: "hidden",
        gap: 2,
        height: 32,
    },
    tab: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#EEEEEE",
    },
    activeTab: {
        backgroundColor: "#82CD47",
    },
    content: {
        flex: 1,
    },
});
