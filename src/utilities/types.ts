import { Href } from 'expo-router';

export interface Tiles {
  category: 'Academics' | 'students' | 'Examination' | 'Timetable' | 'Administration' | 'Miscellaneous';
  title: string;
  icon: string;
  badge: string;
  path: Href | '';
}

interface TimeTableSchedule {
  subject: string;
  startTime: string;
  endTime: string;
  Period: string;
  class: string;
}

export interface TimeTable {
  day: String;
  date: string;
  schedule: TimeTableSchedule[];
}

export interface BannerNotice {
  title: string;
  description: string;
  path: string;
  pathname: string;
  Color: {
    Border: string;
    Button: string;
    Background: string;
  };
}

export interface Data {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD format
  time?: string; // HH:mm format
  endTime?: string; // HH:mm format
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  categoryColor?: string;
}

export interface DayData {
  date: string;
  Datas: Data[];
}

export interface MarkedDate {
  marked?: boolean;
  dotColor?: string;
  selected?: boolean;
  selectedColor?: string;
  selectedTextColor?: string;
  dots?: Array<{ color: string; key: string }>;
}

export interface MarkedDates {
  [date: string]: MarkedDate;
}

export interface WeekDay {
  date: string;
  moment: Date;
  isToday: boolean;
}
