import useGetAllFridges from "@/hooks/fridge/useGetAllFridges";
import { Entypo } from "@expo/vector-icons";
import { Ref, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import IBottomSheetModal from "../IBottomSheetModal";
import { IText } from "../styled";

type AddItemModalProps = {
    ref: Ref<any>,
    // onClose: () => void
}

const AddItemModal = ({ ref }: AddItemModalProps) => {
    const { data, isLoading, isFetching, isError, refetch: fetchFridges } = useGetAllFridges({ enabled: false });

    // defensive logging
    useEffect(() => {
        console.log("fridges changed:", data?.fridges);
    }, [data?.fridges]);

    const showLoading = isFetching || isLoading || !Array.isArray(data?.fridges);

    return <IBottomSheetModal
        title="Choose from Fridges"
        ref={ref}
        snapPoints={['70%']}
        onChange={async (index: number) => {
            if (index === 0) {
                await fetchFridges()
            }
        }}
    >
        {showLoading ? (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#22C55E" />
            </View>
        ) : isError ? (
            <View style={styles.loadingContainer}>
                <View style={styles.errorBox}>
                    <Entypo name="circle-with-cross" size={24}/>
                    <IText style={styles.errorText}>Something went wrong. Please try again later.</IText>
                </View>
            </View>
        ) : (
            <View>
                <IText>fridges</IText>
                {/* render data.fridges */}
            </View>
        )}

    </IBottomSheetModal>
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorBox: {
        flexDirection: 'column',
        gap: 16,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: "#ff00004B",
        padding: 8,
        borderRadius: 8
    },
    errorText: {
        textAlign: 'center'
    }
})

export default AddItemModal;