import React, { useMemo } from 'react';
import { Calendar, DateData } from 'react-native-calendars';

interface Props {
  mode?: "range" | "single";
  start: Date | null;
  end: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
}

const toDateString = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`
}

const fromDateString = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export default function DateRangePicker({ mode = "range", start, end, onChange }: Props) {
  const todayStr = toDateString(new Date());

  const handleDayPress = (day: DateData) => {
    const picked = fromDateString(day.dateString);

    if (mode === "single") {
      onChange(picked, picked);
      return;
    }

    if (!start || (start && end)) {
      onChange(picked, null);
    } else if (picked < start) {
      onChange(picked, null);
    } else {
      onChange(start, picked);
    }
  };

  // Đánh dấu các ngày trong khoảng đã chọn
  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};
    if (!start) return marks;

    const startStr = toDateString(start);

    if (mode === "single" || !end) {
      marks[startStr] = { selected: true, startingDay: true, endingDay: true, color: "#6366f1", textColor: "#fff" };
      return marks;
    }

    const endStr = toDateString(end);
    const cursor = new Date(start);
    while (cursor <= end) {
      const str = toDateString(cursor);
      const isStart = str === startStr;
      const isEnd = str === endStr;
      marks[str] = {
        selected: true,
        startingDay: isStart,
        endingDay: isEnd,
        color: isStart || isEnd ? "#6366f1" : "#6366f133",
        textColor: "#fff",
      };
      cursor.setDate(cursor.getDate() + 1);
    }
    return marks;
  }, [start, end, mode]);

  return (
    <Calendar
      minDate={todayStr}
      markingType={mode === "range" ? "period" : "dot"}
      markedDates={markedDates}
      onDayPress={handleDayPress}
      theme={{
        calendarBackground: "transparent",
        dayTextColor: "#e5e5e5",
        monthTextColor: "#fff",
        textDisabledColor: "#525252",
        todayTextColor: "#8B5CF6",
        arrowColor: "#fff",
        textSectionTitleColor: "#a3a3a3",
        selectedDayBackgroundColor: "#6366f1",
        selectedDayTextColor: "#fff",
      }}
      style={{ borderRadius: 16 }}
    />
  );
}