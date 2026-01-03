import { FontAwesome6 } from "@expo/vector-icons";
import { useRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import IButton from "./IButton";

type QuantitySelectorProps = {
  state: number,
  maxState?: number,
  setState: (value: number) => void,
}

const QuantitySelector = ({ state, maxState, setState }: QuantitySelectorProps) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentValueRef = useRef(state);

  currentValueRef.current = state;

  const handleInputChange = (text: string) => {
    const newValue = text === "" ? 0 : Math.min(maxState ? maxState : Infinity, Math.max(0, parseInt(text)));
    setState(newValue);
  }
};

const stopHolding = () => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }
};

if (isPlus) {
  intervalRef.current = setInterval(() => {
    const newValue = Math.max(0, maxState ? Math.min(maxState, currentValueRef.current + 1) : currentValueRef.current + 1);
    setState(newValue);
  }, delay);
} else {
  intervalRef.current = setInterval(() => {
    const newValue = Math.min(maxState ? maxState : Infinity, Math.max(0, currentValueRef.current - 1));
    setState(newValue);
  }, delay);
}
onLongPress = {() => startHolding({ isPlus: false })}
onPressOut = { stopHolding }
style = { style.left }
  >
  <FontAwesome6 name="caret-left" size={16} color={state > 0 ? "#000000B4" : "#0000004B"} />
      </IButton >
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
    };

    return <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <IButton
            onPress={() => {
                const newValue = Math.min(maxState ? maxState : Infinity, Math.max(0, state - 1));
                setState(newValue);
            }}
            onLongPress={() => startHolding({ isPlus: false })}
            onPressOut={stopHolding}
            style={style.left}
        >
            <FontAwesome6 name="caret-left" size={16} color={state > 0 ? '#000000B4' : '#0000004B'} />
        </IButton>
        <TextInput
            style={style.input}
            keyboardType="numeric"
            value={state.toString()} onChangeText={(text) => handleInputChange(text)}
        />
        <IButton
            onPress={() => {
                const newValue = Math.max(0, maxState ? Math.min(maxState, state + 1) : state + 1);
                setState(newValue);
            }}
            onLongPress={() => startHolding({ isPlus: true })}
            onPressOut={stopHolding}
            style={style.right}
        >
            <FontAwesome6 name="caret-right" size={16} color={maxState && state < maxState ? '#000000B4' : '#0000004B'} />
        </IButton>
    </View>
  );
};

const style = StyleSheet.create({
  left: {
    backgroundColor: 'white',
    width: 20,
    height: 25,
    paddingLeft: 2,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  right: {
    backgroundColor: 'white',
    width: 20,
    height: 25,
    paddingRight: 2,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  input: {
    backgroundColor: 'white',
    minWidth: 26,
    maxWidth: 42,
    paddingHorizontal: 4,
    height: 25,
    textAlign: 'center',
    marginHorizontal: 1,
    fontSize: 11,
  }
});

export default QuantitySelector;
