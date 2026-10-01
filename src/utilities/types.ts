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

export interface Teacher {
  id: string;
  name: string;
  title: string; // e.g. "Dr.", "Mr.", "Mrs."
  role: string; // e.g. "Class Teacher • Class VI-B", "HOD Mathematics"
  subject: string;
  department: string;
  avatarText: string;
  avatarBg: string;
  avatarColor: string;
  isOnline: boolean;
  statusText: string;
  room: string;
  email: string;
  officeHours: string;
  phone?: string;
}

export interface ChatAttachment {
  name: string;
  type: 'pdf' | 'doc' | 'image';
  size: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'teacher';
  text: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  attachment?: ChatAttachment;
  reaction?: string;
}

export interface TeacherConversation {
  teacher: Teacher;
  unreadCount: number;
  isPinned?: boolean;
  lastMessage: string;
  lastMessageTime: string;
  messages: ChatMessage[];
}
