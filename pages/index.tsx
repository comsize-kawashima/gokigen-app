import React from 'react';
import MoodRecorder from '../client/components/mood/MoodCalendar';

export default function Home() {
  return (
    <div className="container mx-auto">
      <MoodRecorder />
    </div>
  );
}