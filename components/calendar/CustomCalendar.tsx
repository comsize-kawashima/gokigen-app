import {
  eachDayOfInterval,
  endOfMonth,
  format,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ja } from "date-fns/locale";
import React from "react";

interface CustomCalendarProps {
  moodData: { [key: string]: number };
}

const moods = ["😡", "😟", "😐", "😊", "😍"];

const CustomCalendar: React.FC<CustomCalendarProps> = ({ moodData }) => {
  const today = new Date();
  const startDate = startOfWeek(startOfMonth(today), {
    weekStartsOn: 0,
    locale: ja,
  });
  const endDate = endOfMonth(today);
  const monthDays = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
        {format(today, "yyyy年MM月", { locale: ja })}
      </h2>
      <div className="grid grid-cols-7 gap-1">
        {["日", "月", "火", "水", "木", "金", "土"].map((day, index) => (
          <div key={index} className="text-center font-medium text-gray-600">
            {day}
          </div>
        ))}
        {monthDays.map((date, index) => {
          const dateString = format(date, "yyyy-MM-dd");
          const moodIndex = moodData ? moodData[dateString] : undefined;
          const isToday =
            format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

          return (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-12 h-12 p-3 rounded-lg flex items-center justify-center ${
                  isToday ? "bg-emerald-500 text-white" : "bg-gray-100"
                }`}
              >
                <span className="text-xl font-medium">{format(date, "d")}</span>
              </div>
              {moodIndex !== undefined && (
                <span className="mt-1 text-2xl">{moods[moodIndex]}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomCalendar;
