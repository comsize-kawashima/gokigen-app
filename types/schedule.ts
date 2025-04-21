export interface ScheduleItem {
  id?: string;
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
  location?: string;
  category: string;
  color?: string;
  isCompleted?: boolean;
}

export interface ScheduleDay {
  date: Date;
  schedules: ScheduleItem[];
} 