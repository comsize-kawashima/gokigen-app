import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Box, Typography, Grid, Paper } from '@mui/material';
import {
  calculateAverageMood,
  getMoodDataForPeriod,
  calculateMoodByDayOfWeek,
  analyzeMoodPatterns,
} from '@/utils/moodAnalytics';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { ja } from 'date-fns/locale';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MoodAnalysisProps {
  moodData: { [key: string]: number };
}

const MoodAnalysis: React.FC<MoodAnalysisProps> = ({ moodData }) => {
  const today = new Date();
  const startDate = startOfWeek(today, { locale: ja });
  const endDate = endOfWeek(today, { locale: ja });

  // 期間内のデータを取得
  const periodData = getMoodDataForPeriod(moodData, startDate, endDate);

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
        {/* 機嫌の推移グラフ */}
        <Grid item xs={12}>
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
        <Grid item xs={12} md={6}>
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
        <Grid item xs={12} md={6}>
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
        <Grid item xs={12}>
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