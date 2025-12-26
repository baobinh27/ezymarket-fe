import { useGetAllFridgeItems } from "@/hooks/fridge/useGetAllFridgeItems";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import { Ref, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import IBottomSheetModal from "../IBottomSheetModal";
import IButton from "../IButton";
import { IText } from "../styled";

type AddItemModalProps = {
  ref: Ref<any>;
  // onClose: () => void
};

const AddItemModal = ({ ref }: AddItemModalProps) => {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch: fetchItems,
    status,
  } = useGetAllFridgeItems({
    params: {
      sortBy: "expiryDate_desc",
    },
    enabled: false,
  }) as any;

  const [hasModalLoaded, setHasModalLoaded] = useState(false);

  // defensive logging
  useEffect(() => {
    console.log("data:", data);
  }, [data]);

  const handleGoFridge = () => {
    // TODO: close the modal
    router.push("/(app)/fridge");
  };

  const showRefetchLoading = isFetching || !hasModalLoaded;

  return (
    <IBottomSheetModal
      title="Choose from Fridge"
      ref={ref}
      snapPoints={["70%"]}
      // calls only if the sheet is open
      onChange={async (index: number) => {
        if (index === 0) {
          setHasModalLoaded(true);
          await fetchItems();
        }
      }}
      onClose={() => setHasModalLoaded(false)}
    >
      {showRefetchLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      ) : isError ? (
        <View style={styles.loadingContainer}>
          <View style={styles.errorBox}>
            <Entypo name="circle-with-cross" size={24} />
            <IText style={styles.errorText}>
              Something went wrong. Please try again later.
            </IText>
          </View>
        </View>
      ) : (
        <View>
          {data && Array.isArray(data.items) && data.items.length === 0 && (
            <>
              <IText>
                Your fridge is empty. You might want to have something in your
                fridge before using them.
              </IText>
              <IButton
                variant="secondary"
                onPress={handleGoFridge}
                style={styles.goToFridgeBtn}
              >
                <IText semiBold color="#46982D">Go to Fridge</IText>
              </IButton>
            </>
          )}
          {data && Array.isArray(data.items) && data.items.length !== 0 && (
            <>map items here</>
          )}
          {showRefetchLoading && <IText>loading overlay</IText>}
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
});

export default AddItemModal;
