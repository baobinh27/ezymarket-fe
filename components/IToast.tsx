import { IText } from "@/components/styled";
import { Entypo, FontAwesome5, Octicons } from "@expo/vector-icons";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ToastType = "success" | "error" | "info" | "warning";

type ToastAction = {
    label?: string;
    icon?: React.ReactNode;
    onPress: () => void;
};



type ToastContextType = {
    showToast: (message: string, type?: ToastType, duration?: number, action?: ToastAction) => void;
};

type ToastItemData = {
    id: string;
    message: string;
    type: ToastType;
    duration: number;
    action?: ToastAction;
    isDismissing?: boolean;
};

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastItemData[]>([]);

    const showToast = (message: string, type: ToastType = "info", duration = 3000, action?: ToastAction) => {
        const id = Date.now().toString() + Math.random().toString();
        const newItem: ToastItemData = { id, message, type, duration, action };

        setToasts((prev) => {
            // Filter out items that are already dismissing to check the "active" count
            const activeItems = prev.filter(t => !t.isDismissing);

            let newToasts = [...prev];

            // If we have 2 or more active items, dismiss the oldest active one
            if (activeItems.length >= 2) {
                const oldestId = activeItems[0].id;
                newToasts = newToasts.map(t => t.id === oldestId ? { ...t, isDismissing: true } : t);
            }

            return [...newToasts, newItem];
        });
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toasts.map((item, index) => {
                const offsetIndex = toasts.findIndex(t => t.id === item.id);
                return (
                    <ToastItem
                        key={item.id}
                        item={item}
                        onDismiss={() => removeToast(item.id)}
                        offsetIndex={offsetIndex}
                    />
                );
            })}
        </ToastContext.Provider>
    );
};

const ToastItem = ({ item, onDismiss, offsetIndex }: { item: ToastItemData, onDismiss: () => void, offsetIndex: number }) => {
    const insets = useSafeAreaInsets();
    // Animation for entering/exiting
    const translateY = useRef(new Animated.Value(-150)).current;
    // Animation for stack position movement
    const animatedOffset = useRef(new Animated.Value(offsetIndex)).current;


    useEffect(() => {
        // Slide In on mount
        Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true
        }).start();

        const timer = setTimeout(() => {
            handleDismiss();
        }, item.duration);

        return () => clearTimeout(timer);
    }, []);

    // Watch for external dismissal signal (limit reached)
    useEffect(() => {
        if (item.isDismissing) {
            handleDismiss();
        }
    }, [item.isDismissing]);

    // Animate to new stack position when index changes
    useEffect(() => {
        Animated.spring(animatedOffset, {
            toValue: offsetIndex,
            useNativeDriver: true
        }).start();
    }, [offsetIndex]);

    const handleDismiss = () => {
        Animated.timing(translateY, {
            toValue: -150,
            duration: 300,
            useNativeDriver: true
        }).start(() => {
            onDismiss();
        });
    }

    const baseOffset = insets.top + 10;
    const itemHeight = 60;

    // Dynamic transform for layout position
    const translateYOffset = animatedOffset.interpolate({
        inputRange: [0, 10],
        outputRange: [0, itemHeight * 10]
    });

    return (
        <Animated.View
            style={[
                styles.container,
                { top: baseOffset },
                {
                    // Combine entrance/exit animation AND stack movement
                    transform: [
                        { translateY: Animated.add(translateY, translateYOffset) }
                    ],
                    backgroundColor: 'white',
                    zIndex: 9999 + offsetIndex,
                }
            ]}
        >
            <View style={[styles.icon, { backgroundColor: colors[item.type] }]}>
                <ToastIcon type={item.type} />
            </View>
            <IText style={styles.text} numberOfLines={2} ellipsizeMode="tail" >{item.message}</IText>
            {item.action && (
                <TouchableOpacity onPress={() => { item.action?.onPress(); handleDismiss(); }} style={styles.actionButton}>
                    {item.action.icon}
                    {item.action.label && <IText semiBold color={colors[item.type]} style={{ marginLeft: item.action.icon ? 4 : 0 }}>{item.action.label}</IText>}
                </TouchableOpacity>
            )}
        </Animated.View>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside provider");
    return ctx;
};

const colors = {
    success: "#4caf50",
    error: "#f44336",
    info: "#2196f3",
    warning: "#ff9800"
};

const ToastIcon = ({ type }: { type: ToastType }) => {
    switch (type) {
        case "success": return <Octicons name="check-circle-fill" size={24} style={{ color: 'white' }} />
        case "error": return <Entypo name="circle-with-cross" size={24} style={{ color: 'white' }} />
        case "info": return <FontAwesome5 name='info-circle' size={24} style={{ color: 'white' }} />
        case "warning": return <Entypo name="warning" size={24} style={{ color: 'white' }} />
    }
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 20,
        right: 20,
        paddingRight: 12,
        borderRadius: 8,
        elevation: 4,
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 8,
        overflow: 'hidden',
        minHeight: 42,
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
    }
});
