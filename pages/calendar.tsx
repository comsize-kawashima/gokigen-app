import React from "react";

import BottomNav from "@/components/navigation/BottomNav";

import Layout from "../components/layout/Layout";
import MoodCalendar from "../components/mood/MoodCalendar";

interface CalendarPageProps {
  moodData: { [key: string]: number };
}

const CalendarPage: React.FC<CalendarPageProps> = ({ moodData }) => {
  return (
    <Layout title="カレンダー | ゴキゲンアプリ">
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        {/* ホーム画面で入力された機嫌をカレンダーに表示 */}
        <MoodCalendar moodData={moodData} setMoodData={() => {}} />
        {/* ソート機能の追加 */}
        <div className="mt-4">
          <h3 className="text-center text-sm text-gray-600">機嫌をソート</h3>
          <div className="flex justify-center space-x-2 mt-2">
            <button className="bg-emerald-500 text-white py-2 px-4 rounded-md">
              良い機嫌
            </button>
            <button className="bg-gray-500 text-white py-2 px-4 rounded-md">
              悪い機嫌
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    </Layout>
  );
};

export default CalendarPage;
