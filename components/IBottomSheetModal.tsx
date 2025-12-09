import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import IButton from './IButton';
import { IText } from './styled';

export type Ref = BottomSheetModal;

interface BottomSheetModalProps {
  children?: React.ReactNode;
  title: string;
  snapPoints?: (string | number)[];
  onClose?: () => void;
  onChange?: (index: number) => void;
  showCancelButton?: boolean;
  useBackdrop?: boolean;
}

const IBottomSheetModal = forwardRef<Ref, BottomSheetModalProps>(
  ({
    children,
    title,
    snapPoints = ['50%'],
    onClose,
    showCancelButton = true,
    useBackdrop = true
  }, ref) => {
    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      ),
      []
    );

    const handleClose = () => {
      (ref as any)?.current?.close();
      onClose?.();
    };

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={useBackdrop ? renderBackdrop : undefined}
        enablePanDownToClose={true}
        onDismiss={handleClose}
        enableDynamicSizing={false}
        enableOverDrag={false}
      >
        <View style={styles.container}>
          {/* Header - Static */}
          <View style={styles.header}>
            <IText bold size={24}>
              {title}
            </IText>
            {showCancelButton && (
              <IButton variant="secondary" style={styles.cancelButton} onPress={handleClose}>
                <IText color="#46982D" semiBold size={14}>
                  Cancel
                </IText>
              </IButton>
            )}
          </View>

          {/* Content - Scrollable (passed as children) */}
          {children}
        </View>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
  },
  cancelButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default IBottomSheetModal;
