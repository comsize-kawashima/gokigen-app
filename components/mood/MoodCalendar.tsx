import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
  startOfWeek,
  isValid,
  addMonths,
  subMonths,
  isSameMonth,
} from "date-fns";
import { ja } from "date-fns/locale";
import { FC } from "react";
import { useAuth } from "@/contexts/AuthContext";

// MoodCalendarコンポーネントのプロパティの型定義
interface MoodCalendarProps {
  moodData: { [key: string]: number };
  setMoodData: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
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
  button: [
    "hover:bg-purple-200",    // 😫 - とても悪い
    "hover:bg-blue-100",      // 😟 - 悪い
    "hover:bg-yellow-100",    // 😐 - 普通
    "hover:bg-green-100",     // 🙂 - 良い
    "hover:bg-orange-100",    // 😊 - とても良い
  ],
};

// MoodCalendarコンポーネントの定義
const MoodCalendar: FC<MoodCalendarProps> = ({
  moodData,
  setMoodData,
  selectedDate,
  onDateChange,
}) => {
  const { user } = useAuth();

  // 日付の有効性チェック
  const validDate = isValid(selectedDate) ? selectedDate : new Date();

  // カレンダーの開始日と終了日を計算
  const startDate = startOfWeek(startOfMonth(validDate), {
    weekStartsOn: 0,
    locale: ja,
  });
  const endDate = endOfMonth(validDate);
  const monthDays = eachDayOfInterval({ start: startDate, end: endDate });

  // 月を切り替える処理
  const handlePrevMonth = () => {
    onDateChange(subMonths(validDate, 1));
  };

  const handleNextMonth = () => {
    onDateChange(addMonths(validDate, 1));
  };

  // 機嫌を選択したときの処理
  const handleMoodSelect = async (date: Date, moodIndex: number) => {
    const dateString = format(date, "yyyy-MM-dd");
    setMoodData((prev) => ({ ...prev, [dateString]: moodIndex }));
    // APIに保存
    try {
      const token = user?.token;
      await fetch("http://localhost:3001/api/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ value: moodIndex, date: dateString }),
      });
    } catch (err) {
      console.error("機嫌データの保存に失敗しました:", err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* カレンダーのタイトル */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="前月"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-semibold text-gray-700">
          {format(validDate, "yyyy年MM月", { locale: ja })}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="次月"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 曜日と日付を表示するグリッド */}
      <div className="grid grid-cols-7 gap-1">
        {/* 曜日を表示 */}
        {["日", "月", "火", "水", "木", "金", "土"].map((day, index) => (
          <div key={index} className="text-center font-medium text-gray-600">
            {day}
          </div>
        ))}
        {/* 各日付を表示 */}
        {monthDays.map((date, index) => {
          const isSelected = isSameDay(date, validDate);
          const isToday = isSameDay(date, new Date());
          const moodIndex = moodData?.[format(date, "yyyy-MM-dd")] ?? undefined;
          const isCurrentMonth = isSameMonth(date, validDate);

          let dayColor = "text-gray-700";
          if (format(date, "EEE", { locale: ja }) === "土")
            dayColor = "text-blue-600";
          if (format(date, "EEE", { locale: ja }) === "日")
            dayColor = "text-red-600";

          return (
            <div key={index} className="flex flex-col items-center">
              <button
                onClick={() => onDateChange(date)}
                className={`w-12 h-12 p-3 rounded-lg transition-colors flex items-center justify-center ${
                  isSelected
                    ? "bg-emerald-500 text-white"
                    : `hover:bg-gray-100 ${isCurrentMonth ? dayColor : "text-gray-400"}`
                } ${isToday && !isSelected ? "ring-2 ring-emerald-400" : ""}`}
              >
                <span className="text-xl font-medium">{format(date, "d")}</span>
              </button>
              {/* 選択された機嫌を表示 */}
              {moodIndex !== undefined && (
                <span className={`mt-1 text-2xl font-bold ${moodColors.text[moodIndex]}`}>
                  {moods[moodIndex]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* 機嫌を選択するボタン */}
      <div className="mt-4">
        <h3 className="text-center text-sm text-gray-600">
          機嫌を選択してください
        </h3>
        <div className="flex justify-center space-x-2 mt-2">
          {moods.map((mood, index) => (
            <button
              key={index}
              onClick={() => handleMoodSelect(validDate, index)}
              className={`text-3xl p-2 rounded-full transition-all hover:scale-110 ${moodColors.button[index]}`}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodCalendar;
