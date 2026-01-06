import dayjs, { Dayjs } from "dayjs";
import React, { createContext, useContext, useState } from "react";

type MealPlanningContextType = {
  selectedDate: Dayjs;
  setSelectedDate: (date: Dayjs) => void;
  viewingWeekDate: Dayjs;
  setViewingWeekDate: (date: Dayjs) => void;
};

const MealPlanningContext = createContext<MealPlanningContextType | undefined>(undefined);

export const MealPlanningProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [viewingWeekDate, setViewingWeekDate] = useState(dayjs());

  return (
    <MealPlanningContext.Provider value={{ selectedDate, setSelectedDate, viewingWeekDate, setViewingWeekDate }}>
      {children}
    </MealPlanningContext.Provider>
  );
};

export const useMealPlanningContext = () => {
  const context = useContext(MealPlanningContext);
  if (!context) {
    throw new Error("useMealPlanningContext must be used within MealPlanningProvider");
  }
  return context;
};
