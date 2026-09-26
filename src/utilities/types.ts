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
