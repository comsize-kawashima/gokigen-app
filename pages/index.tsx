import React, { useState } from "react";
import BottomNav from "../components/navigation/BottomNav";
import Layout from "../components/layout/Layout";
import MoodCalendar from "../components/mood/MoodCalendar";

export default function Home() {
  const [moodData, setMoodData] = useState<{ [key: string]: number }>({});
 return (
    <Layout title="ホーム | ゴキゲンアプリ">
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        <div className="mt-4">
          <MoodCalendar moodData={moodData} setMoodData={setMoodData} />
        </div>
        <BottomNav />
      </div>
    </Layout>
  );
}
