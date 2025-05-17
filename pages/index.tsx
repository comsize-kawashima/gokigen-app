import React, { useEffect, useState } from 'react';
import MoodCalendar from '@/components/mood/MoodCalendar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import BottomNav from '@/components/navigation/BottomNav';
import { format } from "date-fns";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const Home: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [moodData, setMoodData] = useState<{ [key: string]: number }>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchMoodData = async () => {
      if (!user?.token) return;
      try {
        setError(null);
        console.log('Fetching mood data from:', `${API_BASE_URL}/api/mood`);
        console.log('Using token:', user.token);

        const response = await fetch(`${API_BASE_URL}/api/mood`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          console.error('API Error:', errorData);
          throw new Error(errorData?.message || `API error: ${response.status}`);
        }

        const data = await response.json();
        console.log("APIから取得したデータ", data);
        
        // データを日付をキーとしたオブジェクトに変換
        const moodDataMap = data.reduce((acc: { [key: string]: number }, item: { date: string; value: number }) => {
          const dateKey = format(new Date(item.date), "yyyy-MM-dd");
          acc[dateKey] = item.value;
          return acc;
        }, {});
        console.log("moodDataMap", moodDataMap);
        
        setMoodData(moodDataMap);
      } catch (error) {
        console.error('機嫌データの取得に失敗しました:', error);
        setError('データの取得に失敗しました。しばらく経ってから再度お試しください。');
      }
    };

    if (user) {
      fetchMoodData();
    }
  }, [user]);

  if (loading || !user) {
    return (
      <Layout title="読み込み中... | ゴキゲンアプリ">
        <div>読み込み中...</div>
      </Layout>
    );
  }

  return (
    <Layout title="ホーム | ゴキゲンアプリ">
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <MoodCalendar
          moodData={moodData}
          setMoodData={setMoodData}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <BottomNav />
      </div>
    </Layout>
  );
};

export default Home;
