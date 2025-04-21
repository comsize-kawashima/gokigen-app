// Reactと必要な関数をインポート
import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';

// MoodCalendarコンポーネントのプロパティの型定義
interface MoodCalendarProps {
  moodData: { [key: string]: number };
  setMoodData: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
}

// 機嫌のリスト
const moods = ['😡', '😟', '😐', '😊', '😍'];

// MoodCalendarコンポーネントの定義
const MoodCalendar: React.FC<MoodCalendarProps> = ({ moodData, setMoodData }) => {
  // 選択された日付の状態を管理
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // カレンダーの開始日と終了日を計算
  const startDate = startOfWeek(startOfMonth(selectedDate), { weekStartsOn: 0, locale: ja });
  const endDate = endOfMonth(selectedDate);
  const monthDays = eachDayOfInterval({ start: startDate, end: endDate });

  // 機嫌を選択したときの処理
  const handleMoodSelect = (date: Date, moodIndex: number) => {
    const dateString = format(date, 'yyyy-MM-dd');
    setMoodData(prev => ({ ...prev, [dateString]: moodIndex }));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* カレンダーのタイトル */}
      <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">
        {format(selectedDate, 'yyyy年MM月', { locale: ja })}
      </h2>
      
      {/* 曜日と日付を表示するグリッド */}
      <div className="grid grid-cols-7 gap-1">
        {/* 曜日を表示 */}
        {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
          <div key={index} className="text-center font-medium text-gray-600">
            {day}
          </div>
        ))}
        {/* 各日付を表示 */}
        {monthDays.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());
          const moodIndex = moodData[format(date, 'yyyy-MM-dd')];
          
          let dayColor = 'text-gray-700';
          if (format(date, 'EEE', { locale: ja }) === '土') dayColor = 'text-blue-600';
          if (format(date, 'EEE', { locale: ja }) === '日') dayColor = 'text-red-600';
          
          return (
            <div key={index} className="flex flex-col items-center">
              <button
                onClick={() => setSelectedDate(date)}
                className={`w-12 h-12 p-3 rounded-lg transition-colors flex items-center justify-center ${
                  isSelected 
                    ? 'bg-emerald-500 text-white' 
                    : `hover:bg-gray-100 ${dayColor}`
                } ${isToday && !isSelected ? 'ring-2 ring-emerald-400' : ''}`}
              >
                <span className="text-xl font-medium">{format(date, 'd')}</span>
              </button>
              {/* 選択された機嫌を表示 */}
              {moodIndex !== undefined && <span className="mt-1">{moods[moodIndex]}</span>}
            </div>
          );
        })}
      </div>

      {/* 機嫌を選択するボタン */}
      <div className="mt-4">
        <h3 className="text-center text-sm text-gray-600">機嫌を選択してください</h3>
        <div className="flex justify-center space-x-2 mt-2">
          {moods.map((mood, index) => (
            <button
              key={index}
              onClick={() => handleMoodSelect(selectedDate, index)}
              className="text-3xl"
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