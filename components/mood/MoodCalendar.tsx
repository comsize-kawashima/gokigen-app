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

// 追加: ポップなフォント
const popFont = `'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif`;

// APIのベースURLを環境変数から取得
const apiUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

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
      await fetch(`${apiUrl}/api/mood`, {
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
    <div className="bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50 rounded-3xl shadow-2xl p-8 max-w-2xl w-full mx-auto" style={{ fontFamily: popFont }}>
      {/* 機嫌を選択するボタン（上部に移動） */}
      <div className="mb-6 flex flex-col items-center">
        <h3 className="text-2xl font-bold text-blue-400 mb-3 tracking-wide" style={{ fontFamily: popFont, letterSpacing: 2 }}>
          機嫌を選択してください
        </h3>
        <div className="flex justify-center items-center gap-3 mt-2 overflow-x-hidden flex-nowrap w-full px-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', height: 'auto', padding: '10px 0' }}>
          <style jsx>{`
            ::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {moods.map((mood, index) => (
            <button
              key={index}
              onClick={() => handleMoodSelect(validDate, index)}
              className={`text-3xl p-1 rounded-full shadow-lg transition-transform duration-200 hover:scale-110 focus:scale-100 focus:outline-none border-2 border-transparent hover:border-green-300 ${moodColors.button[index]}`}
              style={{ background: '#fff', fontFamily: popFont, margin: '3px 1px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            >
              {mood}
            </button>
          ))}
        </div>
      </div>
      {/* カレンダーのタイトル */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full shadow transition duration-200"
          aria-label="前月"
        >
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-green-500 tracking-wider drop-shadow" style={{ fontFamily: popFont }}>
          {format(validDate, "yyyy年MM月", { locale: ja })}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full shadow transition duration-200"
          aria-label="次月"
        >
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 曜日と日付を表示するグリッド */}
      <div className="grid grid-cols-7 gap-y-0" style={{ fontFamily: popFont }}>
        {/* 曜日を表示 */}
        {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
          <div key={index} className={`text-center font-bold text-lg py-3 tracking-wide ${
            day === '日' ? 'text-orange-400' : day === '土' ? 'text-blue-400' : 'text-green-400'
          }`} style={{ fontFamily: popFont }}>
            {day}
          </div>
        ))}
        {/* 各日付を表示 */}
        {monthDays.map((date, index) => {
          const isSelected = isSameDay(date, validDate);
          const isToday = isSameDay(date, new Date());
          const moodIndex = moodData?.[format(date, 'yyyy-MM-dd')] ?? undefined;
          const isCurrentMonth = isSameMonth(date, validDate);

          let dayColor = 'text-gray-700';
          if (format(date, 'EEE', { locale: ja }) === '土')
            dayColor = 'text-blue-600';
          if (format(date, 'EEE', { locale: ja }) === '日')
            dayColor = 'text-orange-400';

          return (
            <div key={index} className="flex flex-col items-center min-h-[90px] py-2" style={{ fontFamily: popFont }}>
              <button
                onClick={() => onDateChange(date)}
                className={`w-12 h-12 p-3 rounded-2xl transition-colors flex items-center justify-center shadow-sm font-bold text-lg ${
                  isSelected
                    ? 'bg-green-400 text-white'
                    : `hover:bg-yellow-100 ${isCurrentMonth ? dayColor : 'text-gray-300'}`
                } ${isToday && !isSelected ? 'ring-2 ring-blue-300' : ''}`}
                style={{ fontFamily: popFont }}
              >
                <span className="text-xl font-bold">
                  {format(date, 'd')}
                </span>
              </button>
              {/* 選択された機嫌を表示 */}
              {moodIndex !== undefined && (
                <span className={`mt-2 text-2xl font-bold rounded-full shadow-lg px-2 py-1 bg-white ${moodColors.text[moodIndex]}`}
                  style={{ fontFamily: popFont, minWidth: 36, minHeight: 36, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {moods[moodIndex]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MoodCalendar;
