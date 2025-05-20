import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/navigation/BottomNav";
import Layout from "../components/layout/Layout";
import ReadOnlyMoodCalendar from "../components/mood/ReadOnlyMoodCalendar";
import { addMonths, subMonths, isValid } from "date-fns";

interface Mood {
  date: string;
  value: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [moodData, setMoodData] = useState<{ [key: string]: number }>({});
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const now = new Date();
    return isValid(now) ? now : new Date();
  });

  useEffect(() => {
    const fetchMoods = async () => {
      if (!user?.token) return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/mood`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const moods = await res.json();
        if (Array.isArray(moods)) {
          const moodMap: { [key: string]: number } = {};
          moods.forEach((m: Mood) => {
            const dateStr = m.date.slice(0, 10);
            moodMap[dateStr] = m.value;
          });
          setMoodData(moodMap);
        }
      } catch (e) {
        console.error("機嫌データの取得に失敗しました:", e);
      }
    };
    fetchMoods();
  }, [user]);

  const handlePrevMonth = () => {
    setSelectedDate(prev => {
      const newDate = subMonths(prev, 1);
      return isValid(newDate) ? newDate : prev;
    });
  };

  const handleNextMonth = () => {
    setSelectedDate(prev => {
      const newDate = addMonths(prev, 1);
      return isValid(newDate) ? newDate : prev;
    });
  };

  const handleTodayClick = () => {
    const now = new Date();
    setSelectedDate(isValid(now) ? now : new Date());
  };

  return (
    <Layout title="カレンダー | ゴキゲンアプリ">
      <div className="h-screen flex flex-col">
        <div className="flex-1 overflow-hidden">
          <ReadOnlyMoodCalendar
            moodData={moodData}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onTodayClick={handleTodayClick}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
        </div>
        <BottomNav />
      </div>
    </Layout>
  );
};

export default CalendarPage;
