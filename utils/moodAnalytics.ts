import { format, eachDayOfInterval } from 'date-fns';
import { ja } from 'date-fns/locale';

// 機嫌の平均値を計算
export const calculateAverageMood = (moodData: { [key: string]: number }): number => {
  const values = Object.values(moodData);
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
};

// 期間内の機嫌データを取得
export const getMoodDataForPeriod = (
  moodData: { [key: string]: number },
  startDate: Date,
  endDate: Date
): { date: string; mood: number }[] => {
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  return days.map(date => ({
    date: format(date, 'yyyy-MM-dd'),
    mood: moodData[format(date, 'yyyy-MM-dd')] ?? null
  }));
};

// 曜日別の機嫌平均を計算
export const calculateMoodByDayOfWeek = (moodData: { [key: string]: number }): { [key: string]: number } => {
  const dayOfWeekData: { [key: string]: number[] } = {
    '日': [], '月': [], '火': [], '水': [], '木': [], '金': [], '土': []
  };

  Object.entries(moodData).forEach(([dateStr, mood]) => {
    const date = new Date(dateStr);
    const dayOfWeek = format(date, 'E', { locale: ja });
    dayOfWeekData[dayOfWeek].push(mood);
  });

  const averages: { [key: string]: number } = {};
  Object.entries(dayOfWeekData).forEach(([day, values]) => {
    if (values.length > 0) {
      averages[day] = values.reduce((sum, val) => sum + val, 0) / values.length;
    }
  });

  return averages;
};

// 連続した機嫌の悪い日を検出
export const detectConsecutiveBadMoods = (
  moodData: { [key: string]: number },
  threshold: number = 1, // 機嫌が悪いと判断する閾値
  minConsecutiveDays: number = 3 // 連続日数の閾値
): { startDate: string; endDate: string; length: number }[] => {
  const dates = Object.keys(moodData).sort();
  const badMoodPeriods: { startDate: string; endDate: string; length: number }[] = [];
  let currentPeriod: { startDate: string; endDate: string; length: number } | null = null;

  dates.forEach((date) => {
    if (moodData[date] <= threshold) {
      if (!currentPeriod) {
        currentPeriod = { startDate: date, endDate: date, length: 1 };
      } else {
        currentPeriod.endDate = date;
        currentPeriod.length++;
      }
    } else if (currentPeriod) {
      if (currentPeriod.length >= minConsecutiveDays) {
        badMoodPeriods.push(currentPeriod);
      }
      currentPeriod = null;
    }
  });

  if (currentPeriod && (currentPeriod as { length: number }).length >= minConsecutiveDays) {
    badMoodPeriods.push(currentPeriod);
  }

  return badMoodPeriods;
};

// 機嫌の変動パターンを分析
export const analyzeMoodPatterns = (moodData: { [key: string]: number }): {
  mostCommonMood: number;
  moodVariability: number;
  improvementTrend: boolean;
} => {
  const values = Object.values(moodData);
  if (values.length === 0) {
    return {
      mostCommonMood: 0,
      moodVariability: 0,
      improvementTrend: false
    };
  }

  // 最も頻出する機嫌を計算
  const moodCounts = values.reduce((acc, mood) => {
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {} as { [key: number]: number });
  const mostCommonMood = parseInt(
    Object.entries(moodCounts).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
  );

  // 機嫌の変動性を計算
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const moodVariability = Math.sqrt(variance);

  // 改善傾向を分析
  const sortedDates = Object.keys(moodData).sort();
  const firstHalf = sortedDates.slice(0, Math.floor(sortedDates.length / 2));
  const secondHalf = sortedDates.slice(Math.floor(sortedDates.length / 2));
  
  const firstHalfAvg = firstHalf.reduce((sum, date) => sum + moodData[date], 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, date) => sum + moodData[date], 0) / secondHalf.length;
  
  const improvementTrend = secondHalfAvg > firstHalfAvg;

  return {
    mostCommonMood,
    moodVariability,
    improvementTrend
  };
}; 