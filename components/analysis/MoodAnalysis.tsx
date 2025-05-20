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
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Box, Typography, Grid, Paper, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import {
  calculateAverageMood,
  getMoodDataForPeriod,
  calculateMoodByDayOfWeek,
  analyzeMoodPatterns,
} from '@/utils/moodAnalytics';
import { format } from 'date-fns';
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
const moodNumToEmoji = ["😫", "😟", "😐", "🙂", "😊"];
const moodColors = ["#b39ddb", "#90caf9", "#fff59d", "#a5d6a7", "#ffcc80"];

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

const MoodAnalysis: React.FC<MoodAnalysisProps> = ({ moodData }) => {
  const today = new Date();
  const [period, setPeriod] = React.useState<'month' | 'year' | 'all'>('month');

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
  const doughnutLabels = moodNumToEmoji;
  const doughnutDataArr = moodNumToEmoji.map(emoji => moodCounts[emoji] || 0);
  const doughnutColors = moodColors;
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

  // 期間内のデータを取得
  const periodData = getMoodDataForPeriod(
    moodData,
    start ?? today,
    end ?? today
  );

  // グラフデータの設定
  const lineChartData = {
    labels: periodData.map(d => format(new Date(d.date), 'M/d')),
    datasets: [
      {
        label: '機嫌の推移',
        data: periodData.map(d => d.mood),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // 曜日別データの設定
  const dayOfWeekData = calculateMoodByDayOfWeek(moodData);
  const barChartData = {
    labels: Object.keys(dayOfWeekData),
    datasets: [
      {
        label: '曜日別平均機嫌',
        data: Object.values(dayOfWeekData),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  // 機嫌のパターン分析
  const moodPatterns = analyzeMoodPatterns(moodData);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* 機嫌の割合 円グラフ＋切り替え */}
        <Grid item xs={12} component="div">
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ flexGrow: 1 }}>
                機嫌の割合
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
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
            <Box sx={{ height: 300 }}>
              <Doughnut
                data={doughnutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 24 } } },
                    datalabels: {
                      display: true,
                      formatter: (value, context) => context.chart.data.labels?.[context.dataIndex] || '',
                      font: { size: 32 },
                    },
                  },
                }}
                plugins={[ChartDataLabels]}
              />
            </Box>
          </Paper>
        </Grid>

        {/* 機嫌の推移グラフ */}
        <Grid item xs={12} component="div">
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              機嫌の推移
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line 
                data={lineChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      min: 0,
                      max: 4,
                      ticks: {
                        stepSize: 1
                      }
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* 曜日別分析 */}
        <Grid item xs={12} md={6} component="div">
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              曜日別の機嫌傾向
            </Typography>
            <Box sx={{ height: 300 }}>
              <Bar 
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      min: 0,
                      max: 4,
                      ticks: {
                        stepSize: 1
                      }
                    }
                  }
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* 統計情報 */}
        <Grid item xs={12} md={6} component="div">
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              統計情報
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" gutterBottom>
                平均機嫌: {calculateAverageMood(moodData).toFixed(2)}
              </Typography>
              <Typography variant="body1" gutterBottom>
                機嫌の変動性: {moodPatterns.moodVariability.toFixed(2)}
              </Typography>
              <Typography variant="body1">
                改善傾向: {moodPatterns.improvementTrend ? 'あり' : 'なし'}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* アドバイス */}
        <Grid item xs={12} component="div">
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              アドバイス
            </Typography>
            <Typography variant="body1">
              {moodPatterns.improvementTrend
                ? '機嫌の改善傾向が見られます。現在の生活習慣を維持しましょう。'
                : '以下のような改善を試してみてください：'}
            </Typography>
            {!moodPatterns.improvementTrend && (
              <Box component="ul" sx={{ mt: 1 }}>
                <li>十分な睡眠を取る</li>
                <li>適度な運動を行う</li>
                <li>趣味の時間を確保する</li>
                <li>友人や家族と過ごす時間を増やす</li>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MoodAnalysis; 