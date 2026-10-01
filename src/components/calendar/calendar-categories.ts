export const CALENDAR_CATEGORIES = [
  { id: 'timetable', label: 'Time Table' },
  { id: 'assignment', label: 'Assignments' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'events', label: 'Events' },
  { id: 'exam', label: 'Exams' },
] as const;

export type CalendarCategoryId = (typeof CALENDAR_CATEGORIES)[number]['id'];

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half-day' | 'holiday';

export interface AttendanceRecord {
  date: string;
  status: AttendanceStatus;
  checkIn?: string;
  checkOut?: string;
  note?: string;
}

export type AssignmentStatus = 'pending' | 'submitted' | 'overdue' | 'graded';

export interface CalendarAssignment {
  id: string;
  date: string;
  title: string;
  subject: string;
  dueDate: string;
  status: AssignmentStatus;
}

export interface CalendarEventItem {
  id: string;
  date: string;
  title: string;
  time: string;
  endTime?: string;
  location?: string;
  details?: string;
}

export interface ExamScheduleItem {
  id: string;
  date: string;
  subject: string;
  time: string;
  endTime?: string;
  room: string;
  details?: string;
}

export type TimetableSlot =
  | {
      kind: 'period';
      period: string;
      startTime: string;
      endTime: string;
      subject: string;
      teacher: string;
      color: string;
    }
  | {
      kind: 'recess';
      startTime: string;
      endTime: string;
    };

export interface DayTimetable {
  date: string;
  slots: TimetableSlot[];
}
