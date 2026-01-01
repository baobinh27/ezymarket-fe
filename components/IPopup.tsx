import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import IButton from "./IButton";
import { IText } from "./styled";

type IPopupProps = {
  visible: boolean;
  onCancel?: () => void;
  onDone?: () => void;
  children?: React.ReactNode;
};

const IPopup: React.FC<IPopupProps> = ({ visible, onCancel, onDone, children }) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onCancel}
      //   backdropColor='#0000004B'
    >
      <Pressable style={styles.overlay} onPress={onCancel} />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            padding: 16,
            gap: 16,
          }}
          style={styles.body}
        >
          {children}
        </ScrollView>

        {onDone && (
          <IButton variant="primary" style={styles.doneBtn} onPress={onDone}>
            <IText size={16} semiBold color="white">
              Done
            </IText>
          </IButton>
        )}
      </View>
    </Modal>
  );
};

export default IPopup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    animationDuration: 100,
  },
  container: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "white",
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    paddingBottom: 24,
    height: "70%",
    minHeight: 576,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
  },
  cancel: {
    fontSize: 16,
    color: "#2ecc71",
    fontWeight: "600",
  },
  body: {
    // paddingHorizontal: 20,
    // paddingBottom: 20,
  },
  doneBtn: {
    alignSelf: "center",
    marginTop: 16,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    // marginBottom: 24
  },
  doneText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
  },
});
