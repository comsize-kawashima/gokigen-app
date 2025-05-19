import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import BottomNav from '@/components/navigation/BottomNav';
import MoodAnalysis from '@/components/analysis/MoodAnalysis';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const Analysis: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [moodData, setMoodData] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchMoodData = async () => {
      if (!user?.token) return;
      try {
        const response = await fetch(`${API_BASE_URL}/api/mood`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();
        
        // データを日付をキーとしたオブジェクトに変換
        const moodDataMap = data.reduce((acc: { [key: string]: number }, item: { date: string; value: number }) => {
          acc[item.date] = item.value;
          return acc;
        }, {});
        
        setMoodData(moodDataMap);
      } catch (error) {
        console.error('機嫌データの取得に失敗しました:', error);
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
    <Layout title="分析 | ゴキゲンアプリ">
      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        <MoodAnalysis moodData={moodData} />
        <BottomNav />
      </div>
    </Layout>
  );
};

export default Analysis; 