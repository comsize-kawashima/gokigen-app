import React, { useState } from "react";

import Layout from "../components/layout/Layout";
import MoodCalendar from "../components/mood/MoodCalendar";
import BottomNav from "../components/navigation/BottomNav";

export default function Home() {
  // 気分データを管理するための状態を定義
  const [moodData, setMoodData] = useState<{ [key: string]: number }>({});

  return (
    // ページ全体のレイアウトを提供するコンポーネント
    <Layout title="ホーム | ゴキゲンアプリ">
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        <div className="mt-4">
          {/* 気分カレンダーコンポーネントを表示 */}
          <MoodCalendar moodData={moodData} setMoodData={setMoodData} />
        </div>
        {/* ページ下部のナビゲーションバーを表示 */}
        <BottomNav />
      </div>
    </Layout>
  );
}
