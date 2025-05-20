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

// 追加: ポップなフォント
const popFont = `'M PLUS Rounded 1c', 'Nunito', sans-serif`;

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
    <div className="bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50 rounded-3xl shadow-2xl p-6" style={{ fontFamily: popFont }}>
      {/* カレンダーのヘッダー */}
      <div className="flex items-center justify-between p-6 border-b-2 border-blue-100 rounded-t-3xl">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-blue-500 tracking-wider drop-shadow" style={{ fontFamily: popFont }}>
            {format(validDate, "yyyy年MM月", { locale: ja })}
          </h2>
          <button
            onClick={onTodayClick}
            className="px-4 py-2 text-base font-bold text-white bg-blue-400 hover:bg-blue-300 rounded-full shadow transition duration-200"
          >
            今日
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onPrevMonth}
            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full shadow transition duration-200"
            aria-label="前月"
          >
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={onNextMonth}
            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full shadow transition duration-200"
            aria-label="次月"
          >
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* カレンダーグリッド */}
      <div className="grid grid-cols-7 border-b-2 border-blue-100">
        {/* 曜日の行 */}
        {["日", "月", "火", "水", "木", "金", "土"].map((day, index) => (
          <div
            key={index}
            className={`py-5 text-base font-bold text-center border-r last:border-r-0 tracking-wide ${
              day === "日" ? "text-orange-400" : day === "土" ? "text-blue-400" : "text-green-400"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div className="grid grid-cols-7 min-h-[400px]">
        {monthDays.map((date, index) => {
          const isSelected = isSameDay(date, validDate);
          const isToday = isDateToday(date);
          const moodIndex = moodData?.[format(date, "yyyy-MM-dd")] ?? undefined;
          const isCurrentMonth = isSameMonth(date, validDate);

          return (
            <div
              key={index}
              className={`min-h-[90px] p-2 border-r border-b relative rounded-2xl transition duration-200 ${
                !isCurrentMonth ? "bg-gray-100" : "bg-white"
              } ${isToday ? "ring-4 ring-blue-200" : ""} ${isSelected ? "ring-4 ring-green-200" : ""} hover:bg-yellow-50 cursor-pointer`}
              onClick={() => onDateChange(date)}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`
                      w-9 h-9 flex items-center justify-center rounded-full text-base font-bold drop-shadow
                      ${isToday ? "bg-blue-400 text-white" : ""}
                      ${isSelected ? "bg-green-200 text-green-700" : ""}
                      ${
                        format(date, "EEE", { locale: ja }) === "日"
                          ? "text-orange-400"
                          : format(date, "EEE", { locale: ja }) === "土"
                          ? "text-blue-400"
                          : "text-green-400"
                      }
                      ${!isCurrentMonth ? "text-gray-300" : ""}
                    `}
                  >
                    {format(date, "d")}
                  </span>
                </div>
                {/* 機嫌の表示 */}
                {moodIndex !== undefined && isCurrentMonth && (
                  <div className="absolute top-10 left-1 right-1 flex justify-center">
                    <div className={`rounded-full shadow-lg px-3 py-2 text-2xl font-bold flex items-center justify-center transition duration-200 ${moodColors.bg[moodIndex]} ${moodColors.text[moodIndex]}`}
                      style={{ minWidth: 48, minHeight: 48, fontFamily: popFont }}>
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