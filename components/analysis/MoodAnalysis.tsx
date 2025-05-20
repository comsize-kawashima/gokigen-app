import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Box, Typography, Grid, Paper, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import {
  calculateMoodByDayOfWeek,
} from '@/utils/moodAnalytics';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

interface MoodAnalysisProps {
  moodData: { [key: string]: number };
}

// 顔文字変換テーブル
const moodNumToEmoji: string[] = ["😫", "😟", "😐", "🙂", "😊"];
const moodColors = ["#b39ddb", "#90caf9", "#fff59d", "#a5d6a7", "#ffcc80"];

// 追加: ポップなフォント
const popFont = `'M PLUS Rounded 1c', 'Noto Sans JP', 'Nunito', sans-serif`;

// 指定範囲で顔文字ごとにカウント
const countMoodsByEmoji = (moodData: { [key: string]: number }, start: Date | null, end: Date | null) => {
  const counts: { [emoji: string]: number } = {};
  Object.entries(moodData).forEach(([dateStr, value]) => {
    const date = new Date(dateStr);
    if ((start && date < start) || (end && date > end)) return;
    const emoji = moodNumToEmoji[value] ?? "?";
    counts[emoji] = (counts[emoji] || 0) + 1;
  });
  return counts;
};

// 期間でmoodDataをフィルタリング
const filterMoodDataByPeriod = (moodData: { [key: string]: number }, period: 'month' | 'year' | 'all', today: Date) => {
  let start: Date | null = null;
  let end: Date | null = null;
  if (period === 'month') {
    start = new Date(today.getFullYear(), today.getMonth(), 1);
    end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  } else if (period === 'year') {
    start = new Date(today.getFullYear(), 0, 1);
    end = new Date(today.getFullYear(), 11, 31);
  }
  if (!start || !end) return moodData;
  const filtered: { [key: string]: number } = {};
  Object.entries(moodData).forEach(([dateStr, value]) => {
    const date = new Date(dateStr);
    if (date >= start && date <= end) {
      filtered[dateStr] = value;
    }
  });
  return filtered;
};

const MoodAnalysis: React.FC<MoodAnalysisProps> = ({ moodData }) => {
  const today = new Date();
  const [period, setPeriod] = React.useState<'month' | 'year' | 'all'>('month');

  // 期間でフィルタしたmoodData
  const filteredMoodData = filterMoodDataByPeriod(moodData, period, today);

  // 集計範囲の決定
  let start: Date | null = null;
  let end: Date | null = null;
  if (period === 'month') {
    start = new Date(today.getFullYear(), today.getMonth(), 1);
    end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  } else if (period === 'year') {
    start = new Date(today.getFullYear(), 0, 1);
    end = new Date(today.getFullYear(), 11, 31);
  }

  // 円グラフ用データ（顔文字ごと）
  const moodCounts = countMoodsByEmoji(moodData, start, end);
  const doughnutLabels = [...moodNumToEmoji].reverse();
  const doughnutDataArr = [...moodNumToEmoji].map(emoji => moodCounts[emoji] || 0).reverse();
  const doughnutColors = [...moodColors].reverse();
  const doughnutData = {
    labels: doughnutLabels,
    datasets: [
      {
        data: doughnutDataArr,
        backgroundColor: doughnutColors,
        borderWidth: 1,
      },
    ],
  };

  // 曜日別データの設定（期間でフィルタしたデータで集計）
  const dayOfWeekData = calculateMoodByDayOfWeek(filteredMoodData);
  const barChartData = {
    labels: Object.keys(dayOfWeekData),
    datasets: [
      {
        label: '曜日別平均機嫌',
        data: Object.values(dayOfWeekData),
        backgroundColor: Object.values(dayOfWeekData).map(v => moodColors[Math.round(Number(v))] ?? "#ccc"),
      },
    ],
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* 機嫌の割合 円グラフ＋切り替え */}
        <Grid item xs={12} component="div">
          <Paper sx={{
            p: 4,
            borderRadius: 4,
            boxShadow: 6,
            background: 'linear-gradient(135deg, #fff8e1 0%, #e1f5fe 100%)',
            mb: 4,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ flexGrow: 1, fontWeight: 700, fontFamily: popFont, color: '#ff9800', letterSpacing: 2 }}>
                機嫌の割合
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120, background: '#fffde7', borderRadius: 2, boxShadow: 2 }}>
                <InputLabel id="period-select-label">期間</InputLabel>
                <Select
                  labelId="period-select-label"
                  value={period}
                  label="期間"
                  onChange={e => setPeriod(e.target.value as 'month' | 'year' | 'all')}
                >
                  <MenuItem value="month">月</MenuItem>
                  <MenuItem value="year">年</MenuItem>
                  <MenuItem value="all">合計</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ height: 340, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    datalabels: {
                      display: true,
                      formatter: (value, context) => context.chart.data.labels?.[context.dataIndex] || '',
                      font: { size: 40, family: popFont },
                    },
                  },
                }}
                plugins={[ChartDataLabels]}
              />
            </Box>
            {/* カスタム凡例 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              {moodNumToEmoji.map((emoji, i) => (
                <Box key={emoji} sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
                  <Box sx={{ width: 32, height: 32, backgroundColor: moodColors[i], borderRadius: 2, mr: 1, boxShadow: 2 }} />
                  <span style={{ fontSize: 32, fontFamily: popFont }}>{emoji}</span>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* 曜日別分析 */}
        <Grid item xs={12} component="div">
          <Paper sx={{
            p: 4,
            borderRadius: 4,
            boxShadow: 6,
            background: 'linear-gradient(135deg, #e1f5fe 0%, #fff8e1 100%)',
            mb: 4,
            maxWidth: '100%',
            width: '100%',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, width: '100%', justifyContent: 'center' }}>
              <Typography variant="h5" gutterBottom sx={{ flexGrow: 1, textAlign: 'left', fontWeight: 700, fontFamily: popFont, color: '#00bcd4', letterSpacing: 2 }}>
                曜日別の機嫌傾向
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120, ml: 2, background: '#e1f5fe', borderRadius: 2, boxShadow: 2 }}>
                <InputLabel id="period-select-label-bar">期間</InputLabel>
                <Select
                  labelId="period-select-label-bar"
                  value={period}
                  label="期間"
                  onChange={e => setPeriod(e.target.value as 'month' | 'year' | 'all')}
                >
                  <MenuItem value="month">月</MenuItem>
                  <MenuItem value="year">年</MenuItem>
                  <MenuItem value="all">合計</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ height: 340, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Bar 
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      barPercentage: 0.4,
                      categoryPercentage: 0.7,
                      grid: { color: '#ffe0b2' },
                    },
                    y: {
                      min: 0,
                      max: 4,
                      ticks: {
                        stepSize: 1,
                        callback: (value) => moodNumToEmoji[Number(value)] ?? value,
                        font: { size: 24, family: popFont },
                      },
                      grid: { color: '#b2ebf2' },
                    },
                  },
                  plugins: {
                    datalabels: {
                      display: true,
                      formatter: (value) => moodNumToEmoji[Math.round(Number(value))] ?? value,
                      font: { size: 36, family: popFont },
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const v = context.parsed.y;
                          return moodNumToEmoji[Math.round(Number(v))] ?? v;
                        },
                      },
                    },
                  },
                }}
                plugins={[ChartDataLabels]}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MoodAnalysis; 