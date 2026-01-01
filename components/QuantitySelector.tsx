import { FontAwesome6 } from "@expo/vector-icons";
import { useRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import IButton from "./IButton";

type QuantitySelectorProps = {
  state: number;
  maxState?: number;
  setState: React.Dispatch<React.SetStateAction<number>>;
};

const QuantitySelector = ({ state, maxState, setState }: QuantitySelectorProps) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleInputChange = (text: string) => {
    setState(
      text === "" ? 0 : Math.min(maxState ? maxState : Infinity, Math.max(0, parseInt(text)))
    );
  };

  const startHolding = ({ isPlus }: { isPlus: boolean }) => {
    const delay = 20; // thời gian delay (ms) giữa các lần tăng/giảm

    if (isPlus) {
      intervalRef.current = setInterval(() => {
        setState((prev) => Math.max(0, maxState ? Math.min(maxState, prev + 1) : prev + 1));
      }, delay);
    } else {
      intervalRef.current = setInterval(() => {
        setState((prev) => Math.min(maxState ? maxState : Infinity, Math.max(0, prev - 1)));
      }, delay);
    }
  };

  const stopHolding = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <IButton
        onPress={() =>
          setState((prev) => Math.min(maxState ? maxState : Infinity, Math.max(0, prev - 1)))
        }
        onLongPress={() => startHolding({ isPlus: false })}
        onPressOut={stopHolding}
        style={style.left}
      >
        <FontAwesome6 name="caret-left" size={16} color={state > 0 ? "#000000B4" : "#0000004B"} />
      </IButton>
      <TextInput
        style={style.input}
        keyboardType="numeric"
        value={state.toString()}
        onChangeText={(text) => handleInputChange(text)}
      />
      <IButton
        onPress={() =>
          setState((prev) => Math.max(0, maxState ? Math.min(maxState, prev + 1) : prev + 1))
        }
        onLongPress={() => startHolding({ isPlus: true })}
        onPressOut={stopHolding}
        style={style.right}
      >
        <FontAwesome6
          name="caret-right"
          size={16}
          color={!maxState || (maxState && state < maxState) ? "#000000B4" : "#0000004B"}
        />
      </IButton>
    </View>
  );
};

const style = StyleSheet.create({
  left: {
    backgroundColor: "white",
    width: 20,
    height: 20,
    paddingLeft: 2,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  right: {
    backgroundColor: "white",
    width: 20,
    height: 20,
    paddingRight: 2,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  input: {
    backgroundColor: "white",
    minWidth: 26,
    maxWidth: 42,
    paddingHorizontal: 4,
    height: 20,
    textAlign: "center",
    marginHorizontal: 1,
    fontSize: 11,
  },
});

export default QuantitySelector;
