import { Dayjs } from "dayjs";

export const getDateFormat = (date: Dayjs) => {
  return `${date.year()}-${(date.month() + 1).toString().padStart(2, "0")}-${date
    .date()
    .toString()
    .padStart(2, "0")}`;
};
