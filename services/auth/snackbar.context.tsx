import { IText } from "@/components/styled";
import { Entypo, FontAwesome5, Octicons } from "@expo/vector-icons";
import { createContext, ReactNode, useContext, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

type SnackBarType = "success" | "error" | "info" | "warning";

type SnackBarContextType = {
  showSnackBar: (message: string, type?: SnackBarType, duration?: number) => void;
};

const SnackBarContext = createContext<SnackBarContextType | null>(null);

export const SnackBarProvider = ({ children }: { children: ReactNode }) => {
    const [message, setMessage] = useState("");
    const [type, setType] = useState<SnackBarType>("info");
    const translateY = useRef(new Animated.Value(-120)).current;
    const visibleRef = useRef(false);

  const showSnackBar = (msg: string, t: SnackBarType = "info", duration = 3000) => {
    setMessage(msg);
    setType(t);

    if (!visibleRef.current) {
      visibleRef.current = true;
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

        setTimeout(() => {
            Animated.timing(translateY, {
                toValue: -120,
                duration: 300,
                useNativeDriver: true
            }).start(() => {
                visibleRef.current = false;
            });
        }, duration);
    };

  return (
    <SnackBarContext.Provider value={{ showSnackBar }}>
      {children}

      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY }],
            // borderColor: colors[type],
            // borderTopWidth: 3,
            backgroundColor: "white",
          },
        ]}
      >
        <View
          style={[
            styles.icon,
            {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors[type],
            },
          ]}
        >
          <SnackBarIcon type={type} />
        </View>
        <IText style={styles.text} numberOfLines={2} ellipsizeMode="tail">
          {message}
        </IText>
      </Animated.View>
    </SnackBarContext.Provider>
  );
};

export const useSnackBar = () => {
  const ctx = useContext(SnackBarContext);
  if (!ctx) throw new Error("useSnackBar must be used inside provider");
  return ctx;
};

const colors = {
  success: "#4caf50",
  error: "#f44336",
  info: "#2196f3",
  warning: "#ff9800",
};

const SnackBarIcon = ({ type }: { type: SnackBarType }) => {
  switch (type) {
    case "success":
      return <Octicons name="check-circle-fill" size={24} style={{ color: "white" }} />;
    case "error":
      return <Entypo name="circle-with-cross" size={24} style={{ color: "white" }} />;
    case "info":
      return <FontAwesome5 name="info-circle" size={24} style={{ color: "white" }} />;
    case "warning":
      return <Entypo name="warning" size={24} style={{ color: "white" }} />;
  }
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 20,
        left: 20,
        right: 20,
        paddingRight: 12,
        borderRadius: 8,
        elevation: 9999,
        zIndex: 9999,
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 8,
        overflow: 'hidden',
        minHeight: 42
    },
    text: {
        flex: 1,
        color: "#000000B4",
        textAlign: "left",
        fontSize: 13,
        paddingVertical: 12,
    },
    icon: {
        color: 'white',
        alignSelf: "stretch",
        paddingVertical: 7,
        width: 42,
    }
});
