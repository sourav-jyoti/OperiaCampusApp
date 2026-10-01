import { Href } from 'expo-router';

export interface Tiles {
  category: 'Academics' | 'students' | 'Examination' | 'Timetable' | 'Administration' | 'AI Assistant';
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
export interface Student {
  id: string;
  name: string;
  rollNo: string;
  avatar?: string;
  gender?: 'male' | 'female';
}

export type AttendanceStatus = 'present' | 'absent';

export interface StudentAttendanceRecord {
  student: Student;
  status: AttendanceStatus;
}

export type AssignmentStatus = 'pending' | 'submitted';

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  fileType: 'doc' | 'pdf' | 'ppt' | 'zip';
  fileName: string;
  status: AssignmentStatus;
  submittedAt?: string;
  totalMarks?: number;
}
