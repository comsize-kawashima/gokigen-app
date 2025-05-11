import React, { useState, Dispatch, SetStateAction } from 'react';
import { Box, Container } from '@mui/material';
import MoodCalendar from './MoodCalendar';
import MoodAnalysis from '../analysis/MoodAnalysis';

interface MoodDashboardProps {
  moodData: { [key: string]: number };
  setMoodData: Dispatch<SetStateAction<{ [key: string]: number }>>;
}

const MoodDashboard: React.FC<MoodDashboardProps> = ({ moodData, setMoodData }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <MoodCalendar
          moodData={moodData}
          setMoodData={setMoodData}
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
        />
      </Box>
      <Box>
        <MoodAnalysis moodData={moodData} />
      </Box>
    </Container>
  );
};

export default MoodDashboard; 