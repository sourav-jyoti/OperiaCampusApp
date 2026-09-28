import { getDateString, getTodayString } from './date-helpers';

import type {
  AttendanceRecord,
  CalendarAssignment,
  CalendarEventItem,
  DayTimetable,
  ExamScheduleItem,
  TimetableSlot,
} from './calendar-categories';

function offsetDate(daysFromToday: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return getDateString(date);
}

const defaultTimetableSlots: TimetableSlot[] = [
  {
    kind: 'period',
    period: '1',
    startTime: '08:30 AM',
    endTime: '09:10 AM',
    subject: 'Mathematics',
    teacher: 'Sushant Maurya',
    color: '#22C55E',
  },
  {
    kind: 'period',
    period: '2',
    startTime: '09:10 AM',
    endTime: '09:50 AM',
    subject: 'General Knowledge',
    teacher: 'Richa Maheshwari',
    color: '#F97316',
  },
  {
    kind: 'period',
    period: '3',
    startTime: '09:50 AM',
    endTime: '10:30 AM',
    subject: 'Hindi',
    teacher: 'Sindhu Pandey',
    color: '#38BDF8',
  },
  {
    kind: 'recess',
    startTime: '10:30 AM',
    endTime: '11:00 AM',
  },
  {
    kind: 'period',
    period: '4',
    startTime: '11:00 AM',
    endTime: '11:40 AM',
    subject: 'English',
    teacher: 'Arjun Rampal Yadav',
    color: '#EC4899',
  },
  {
    kind: 'period',
    period: '5',
    startTime: '11:40 AM',
    endTime: '12:20 PM',
    subject: 'Biology',
    teacher: 'Ajay Kumar',
    color: '#8B5CF6',
  },
  {
    kind: 'period',
    period: '6',
    startTime: '12:20 PM',
    endTime: '01:00 PM',
    subject: 'Music',
    teacher: 'Anuj Tanwar',
    color: '#EF4444',
  },
];

const timetables: DayTimetable[] = [
  { date: offsetDate(0), slots: defaultTimetableSlots },
  {
    date: offsetDate(1),
    slots: [
      {
        kind: 'period',
        period: '1',
        startTime: '09:00 AM',
        endTime: '09:45 AM',
        subject: 'Physics',
        teacher: 'Neha Sharma',
        color: '#6366F1',
      },
      {
        kind: 'period',
        period: '2',
        startTime: '09:45 AM',
        endTime: '10:30 AM',
        subject: 'Chemistry',
        teacher: 'Rahul Verma',
        color: '#14B8A6',
      },
      {
        kind: 'recess',
        startTime: '10:30 AM',
        endTime: '11:00 AM',
      },
      {
        kind: 'period',
        period: '3',
        startTime: '11:00 AM',
        endTime: '11:45 AM',
        subject: 'Computer Science',
        teacher: 'Priya Singh',
        color: '#0EA5E9',
      },
    ],
  },
];

const attendanceRecords: AttendanceRecord[] = [
  {
    date: offsetDate(0),
    status: 'present',
    checkIn: '08:15 AM',
    checkOut: '01:05 PM',
    note: 'On time for all periods',
  },
  {
    date: offsetDate(-1),
    status: 'late',
    checkIn: '09:05 AM',
    checkOut: '01:00 PM',
    note: 'Late by 20 minutes',
  },
  {
    date: offsetDate(-2),
    status: 'absent',
    note: 'Medical leave',
  },
  {
    date: offsetDate(5),
    status: 'holiday',
    note: 'Founders Day – no attendance required',
  },
];

const assignments: CalendarAssignment[] = [
  {
    id: 'a1',
    date: offsetDate(0),
    title: 'Algebra worksheet',
    subject: 'Mathematics',
    dueDate: offsetDate(0),
    status: 'pending',
  },
  {
    id: 'a2',
    date: offsetDate(0),
    title: 'Essay on environment',
    subject: 'English',
    dueDate: offsetDate(2),
    status: 'pending',
  },
  {
    id: 'a3',
    date: offsetDate(1),
    title: 'Lab report – optics',
    subject: 'Physics',
    dueDate: offsetDate(1),
    status: 'submitted',
  },
  {
    id: 'a4',
    date: offsetDate(2),
    title: 'Chapter 5 MCQs',
    subject: 'Biology',
    dueDate: offsetDate(1),
    status: 'overdue',
  },
];

const calendarEvents: CalendarEventItem[] = [
  {
    id: 'e1',
    date: offsetDate(0),
    title: 'Parent–teacher meeting',
    time: '02:00 PM',
    endTime: '04:00 PM',
    location: 'Main auditorium',
    details: 'Discuss mid-term progress',
  },
  {
    id: 'e2',
    date: offsetDate(0),
    title: 'Science club demo',
    time: '04:30 PM',
    endTime: '05:30 PM',
    location: 'Lab Block B',
    details: 'Volcano experiment showcase',
  },
  {
    id: 'e3',
    date: offsetDate(3),
    title: 'Tech Fest registration',
    time: '10:00 AM',
    location: 'Admin block',
    details: 'Last day to register for hackathon',
  },
];

const examSchedule: ExamScheduleItem[] = [
  {
    id: 'x1',
    date: offsetDate(2),
    subject: 'Mathematics',
    time: '09:00 AM',
    endTime: '12:00 PM',
    room: 'Exam Hall A',
    details: 'Chapters 3–7. Bring calculator and ID.',
  },
  {
    id: 'x2',
    date: offsetDate(2),
    subject: 'English',
    time: '02:00 PM',
    endTime: '04:00 PM',
    room: 'Room 204',
    details: 'Essay and comprehension',
  },
  {
    id: 'x3',
    date: offsetDate(7),
    subject: 'Science',
    time: '09:30 AM',
    endTime: '11:30 AM',
    room: 'Lab Hall C',
    details: 'Practical + viva',
  },
];

export function getTimetableForDate(date: string): TimetableSlot[] {
  return timetables.find((t) => t.date === date)?.slots ?? [];
}

export function getAttendanceForDate(date: string): AttendanceRecord | undefined {
  return attendanceRecords.find((r) => r.date === date);
}

export function getAssignmentsForDate(date: string): CalendarAssignment[] {
  return assignments.filter((a) => a.date === date);
}

export function getEventsForCalendarDate(date: string): CalendarEventItem[] {
  return calendarEvents.filter((e) => e.date === date);
}

export function getExamsForDate(date: string): ExamScheduleItem[] {
  return examSchedule.filter((e) => e.date === date);
}

export function dateHasCategoryData(date: string): boolean {
  return (
    getTimetableForDate(date).length > 0 ||
    getAttendanceForDate(date) !== undefined ||
    getAssignmentsForDate(date).length > 0 ||
    getEventsForCalendarDate(date).length > 0 ||
    getExamsForDate(date).length > 0
  );
}

/** Dates with mock data (for debugging / tests) */
export const mockCategoryDates = {
  today: getTodayString(),
};
