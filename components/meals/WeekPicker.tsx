import { Entypo } from "@expo/vector-icons";
import dayjs, { Dayjs } from "dayjs";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import IButton from "../IButton";
import { IText } from "../styled";

type WeekPickerProps = {
  currentDate: Dayjs;
  onGoToday: () => void;
  onGoPrevWeek: () => void;
  onGoNextWeek: () => void;
  onDayPicking: (day: Dayjs) => void;
};

const WeekPicker = ({
  currentDate,
  onGoToday,
  onGoNextWeek,
  onGoPrevWeek,
  onDayPicking,
}: WeekPickerProps) => {
  // const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const startOfWeek = currentDate.startOf("week"); // Sunday
  const weekDays = [...Array(7)].map((_, i) => startOfWeek.add(i, "day"));

  const isPlanning = React.useMemo(() => selectedDate.isAfter(dayjs()), [selectedDate]);

  const goToday = () => {
    // setCurrentDate(dayjs());
    onGoToday();
    setSelectedDate(dayjs());
  };

  const goPrevWeek = () => {
    // setCurrentDate(currentDate.subtract(1, "week"));
    onGoPrevWeek();
  };

  const goNextWeek = () => {
    // setCurrentDate(currentDate.add(1, "week"));
    onGoNextWeek();
  };

  return (
    <View
      style={{
        padding: 8,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goPrevWeek}>
          <Entypo name="chevron-left" size={24} color="black" />
        </TouchableOpacity>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.weekRow}>
            {weekDays.map((day, idx) => {
              const isSelected = day.isSame(selectedDate, "day");
              const isFuture = day.isAfter(dayjs());

              return (
                <View key={idx} style={styles.dayItem}>
                  <IText size={11} style={styles.weekdayLabel}>
                    {day.format("ddd")}
                  </IText>

                  <TouchableOpacity
                    style={[
                      styles.dayButton,
                      isFuture && styles.futureDayButton,
                      isSelected && styles.selectedDayButton,
                    ]}
                    onPress={() => {
                      setSelectedDate(day);
                      onDayPicking(day);
                    }}
                  >
                    <IText
                      semiBold
                      style={[styles.dayNumber, isSelected && styles.selectedDayNumber]}
                    >
                      {day.format("D")}
                    </IText>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>

        <TouchableOpacity onPress={goNextWeek}>
          <Entypo name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Selected date text */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 6,
          marginTop: 12,
          width: "85%",
          maxWidth: 320,
        }}
      >
        <IText semiBold size={14} style={styles.selectedText}>
          {selectedDate.format("MMM DD, YYYY")}
        </IText>
        {isPlanning && (
          <IButton variant="secondary" style={{ borderRadius: 10, paddingHorizontal: 10 }}>
            <IText size={11}>Planning</IText>
          </IButton>
        )}
        <IButton variant="tertiary" style={styles.todayButton} onPress={goToday}>
          <IText size={11}>Today</IText>
        </IButton>
      </View>

      {/* <View style={styles.line} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrow: {
    fontSize: 20,
    padding: 6,
  },
  weekRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 8,
  },
  dayItem: {
    flexDirection: "column",
    gap: 2,
    justifyContent: "center",
  },
  dayButton: {
    width: 36,
    alignItems: "center",
    paddingVertical: 8,
    backgroundColor: "#EDEDED",
    borderRadius: 8,
  },
  selectedDayButton: {
    backgroundColor: "#82CD47",
  },
  futureDayButton: {
    backgroundColor: "#0000004B",
  },
  weekdayLabel: {
    // fontSize: 12,
    textAlign: "center",
    color: "#333",
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  selectedDayNumber: {
    color: "#fff",
  },
  selectedText: {
    backgroundColor: "#eee",
    flexGrow: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    color: "#000000B4",
  },
  todayButton: {
    width: "20%",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  line: {
    height: 1,
    backgroundColor: "#000",
    marginTop: 10,
  },
});

export default WeekPicker;
