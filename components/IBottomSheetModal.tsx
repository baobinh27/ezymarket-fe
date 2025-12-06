import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
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
  showCancelButton?: boolean;
}


/**
 * Component modal xuất hiện từ dưới lên với nền mờ.
 * 
 * ---
 * **Props**
 * - {React.RefObject<BottomSheet | null>} - **bottomSheetRef** - Ref để điều khiển bottom sheet (mở/đóng).
 * - {React.ReactNode} - **children** - Nội dung bên trong bottom sheet.
 * - {string} - **title** - Tiêu đề hiển thị ở phần header của bottom sheet.
 * - {(string | number)[]} - **[snapPoints]** - Các vị trí dừng của bottom sheet. Mặc định là `["50%"]`.
 * - {function} - **[onClose]** - Hàm được gọi khi người dùng đóng bottom sheet.
 * - {boolean} - **[showCancelButton]** - Hiển thị nút Cancel ở header. Mặc định là `true`.
 * 
 * ---
 * **Ví dụ sử dụng**
 * ```tsx
 * const sheetRef = useRef<BottomSheet>(null);
 * 
 * <IBottomSheet
 *     bottomSheetRef={sheetRef}
 *     title="Tạo danh sách"
 *     snapPoints={[1, "60%"]}
 *     onClose={() => console.log("Đã đóng")}
 * >
 *     <View>
 *         <IText>Nội dung</IText>
 *     </View>
 * </IBottomSheet>
 * ```
 */

const IBottomSheetModal = forwardRef<Ref, BottomSheetModalProps>(
  ({ 
    children, 
    title, 
    snapPoints = ['50%'], 
    onClose, 
    showCancelButton = true 
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
        backdropComponent={renderBackdrop} 
        enablePanDownToClose={true}
        onDismiss={handleClose}
		enableDynamicSizing={false}
		enableOverDrag={false}
      >
        <BottomSheetView style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <IText bold size={24}>
              {title}
            </IText>
            {showCancelButton && (
              <IButton
                variant="secondary"
                style={styles.cancelButton}
                onPress={handleClose}
              >
                <IText color="#46982D" semiBold size={14}>
                  Cancel
                </IText>
              </IButton>
            )}
          </View>
          
          {/* Content */}
          {children && (
            <View style={styles.contentSection}>
              {children}
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);


const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  cancelButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  contentSection: {
    flex: 1,
  },
});

export default IBottomSheetModal;