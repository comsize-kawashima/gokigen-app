import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
  isValid,
  isToday as isDateToday,
  isSameMonth,
} from "date-fns";
import { ja } from "date-fns/locale";
import { FC } from "react";

// ReadOnlyMoodCalendarコンポーネントのプロパティの型定義
interface ReadOnlyMoodCalendarProps {
  moodData: { [key: string]: number };
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onTodayClick: () => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

// 機嫌のリスト
const moods = ["😫", "😟", "😐", "🙂", "😊"];

// 機嫌ごとの色設定
const moodColors = {
  bg: [
    "bg-purple-200",    // 😫 - とても悪い
    "bg-blue-100",      // 😟 - 悪い
    "bg-yellow-100",    // 😐 - 普通
    "bg-green-100",     // 🙂 - 良い
    "bg-orange-100",    // 😊 - とても良い
  ],
  text: [
    "text-purple-900",    // 😫 - とても悪い
    "text-blue-800",      // 😟 - 悪い
    "text-yellow-800",    // 😐 - 普通
    "text-green-800",     // 🙂 - 良い
    "text-orange-800",    // 😊 - とても良い
  ],
};

// ReadOnlyMoodCalendarコンポーネントの定義
const ReadOnlyMoodCalendar: FC<ReadOnlyMoodCalendarProps> = ({
  moodData,
  selectedDate,
  onDateChange,
  onTodayClick,
  onPrevMonth,
  onNextMonth,
}) => {
  // 日付の有効性チェック
  const validDate = isValid(selectedDate) ? selectedDate : new Date();

  // カレンダーの開始日と終了日を計算
  const startDate = startOfWeek(startOfMonth(validDate), {
    weekStartsOn: 0,
    locale: ja,
  });
  const endDate = endOfMonth(validDate);
  const monthDays = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="bg-white rounded-lg">
      {/* カレンダーのヘッダー */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-normal text-gray-900">
            {format(validDate, "yyyy年MM月", { locale: ja })}
          </h2>
          <button
            onClick={onTodayClick}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md"
          >
            今日
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onPrevMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="前月"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={onNextMonth}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="次月"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 border-b">
        {/* 曜日の行 */}
        {["日", "月", "火", "水", "木", "金", "土"].map((day, index) => (
          <div
            key={index}
            className="py-2 text-sm font-medium text-gray-500 text-center border-r last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div className="grid grid-cols-7 h-[calc(100vh-16rem)]">
        {monthDays.map((date, index) => {
          const isSelected = isSameDay(date, validDate);
          const isToday = isDateToday(date);
          const moodIndex = moodData?.[format(date, "yyyy-MM-dd")] ?? undefined;
          const isCurrentMonth = isSameMonth(date, validDate);

          return (
            <div
              key={index}
              className={`min-h-[100px] p-1 border-r border-b relative ${
                !isCurrentMonth ? "bg-gray-50" : ""
              } hover:bg-gray-50 cursor-pointer`}
              onClick={() => onDateChange(date)}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`
                      w-8 h-8 flex items-center justify-center rounded-full text-sm
                      ${isToday ? "bg-blue-600 text-white" : ""}
                      ${isSelected ? "bg-gray-200" : ""}
                      ${
                        format(date, "EEE", { locale: ja }) === "日"
                          ? "text-red-500"
                          : format(date, "EEE", { locale: ja }) === "土"
                          ? "text-blue-500"
                          : "text-gray-900"
                      }
                      ${!isCurrentMonth ? "text-gray-400" : ""}
                    `}
                  >
                    {format(date, "d")}
                  </span>
                </div>
                {/* 機嫌の表示 */}
                {moodIndex !== undefined && isCurrentMonth && (
                  <div className="absolute top-10 left-1 right-1">
                    <div className={`${moodColors.bg[moodIndex]} ${moodColors.text[moodIndex]} rounded px-2 py-1 text-sm`}>
                      {moods[moodIndex]}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReadOnlyMoodCalendar; 