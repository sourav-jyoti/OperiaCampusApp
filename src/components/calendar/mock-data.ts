/**
 * Campus mock data – assignments, timetable, exams, events
 * Replace with real API/data source when ready.
 */

import type { CampusEvent } from './types';

function getDateString(daysFromToday: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Colour palette per event type */
export const EVENT_TYPE_COLORS: Record<string, string> = {
  assignment: '#F97316', // orange
  class: '#6366F1',      // indigo
  exam: '#EF4444',       // red
  holiday: '#10B981',    // emerald
  event: '#8B5CF6',      // violet
  reminder: '#F59E0B',   // amber
};

export const mockCampusEvents: CampusEvent[] = [
  // ── TODAY ────────────────────────────────────────────────────
  {
    id: 'c1',
    title: 'Data Structures Assignment',
    description: 'Submit binary tree implementation on the portal.',
    date: getDateString(0),
    type: 'assignment',
    subject: 'Data Structures',
    priority: 'high',
    completed: false,
  },
  {
    id: 'c2',
    title: 'Mathematics',
    description: 'Differential Equations – Room 301',
    date: getDateString(0),
    time: '09:00',
    endTime: '10:30',
    type: 'class',
    subject: 'Mathematics',
    venue: 'Room 301',
    priority: 'medium',
    completed: false,
  },
  {
    id: 'c3',
    title: 'Physics Lab',
    description: 'Optics experiment – Bring lab manual.',
    date: getDateString(0),
    time: '11:00',
    endTime: '13:00',
    type: 'class',
    subject: 'Physics',
    venue: 'Lab Block B',
    priority: 'medium',
    completed: false,
  },

  // ── TOMORROW ─────────────────────────────────────────────────
  {
    id: 'c4',
    title: 'OOP Assignment',
    description: 'Design pattern report – submit by midnight.',
    date: getDateString(1),
    type: 'assignment',
    subject: 'Object Oriented Programming',
    priority: 'high',
    completed: false,
  },
  {
    id: 'c5',
    title: 'Computer Networks',
    description: 'TCP/IP deep dive – Room 204',
    date: getDateString(1),
    time: '10:00',
    endTime: '11:30',
    type: 'class',
    subject: 'Computer Networks',
    venue: 'Room 204',
    priority: 'medium',
    completed: false,
  },
  {
    id: 'c6',
    title: 'Study Group – DSA',
    description: 'Revise graphs & trees with friends.',
    date: getDateString(1),
    time: '17:00',
    endTime: '19:00',
    type: 'reminder',
    priority: 'low',
    completed: false,
  },

  // ── DAY +2 ────────────────────────────────────────────────────
  {
    id: 'c7',
    title: 'Mid-term Exam – Mathematics',
    description: 'Chapters 3-7. Bring calculator & ID card.',
    date: getDateString(2),
    time: '09:00',
    endTime: '12:00',
    type: 'exam',
    subject: 'Mathematics',
    venue: 'Exam Hall A',
    priority: 'high',
    completed: false,
  },
  {
    id: 'c8',
    title: 'Database Systems',
    description: 'ER diagrams – Room 305',
    date: getDateString(2),
    time: '14:00',
    endTime: '15:30',
    type: 'class',
    subject: 'Database Systems',
    venue: 'Room 305',
    priority: 'medium',
    completed: false,
  },

  // ── DAY +3 ────────────────────────────────────────────────────
  {
    id: 'c9',
    title: 'Software Engineering',
    description: 'Agile methodologies lecture',
    date: getDateString(3),
    time: '08:30',
    endTime: '10:00',
    type: 'class',
    subject: 'Software Engineering',
    venue: 'Room 101',
    priority: 'medium',
    completed: false,
  },
  {
    id: 'c10',
    title: 'Project Submission – SE',
    description: 'Upload sprint demo video to portal.',
    date: getDateString(3),
    type: 'assignment',
    subject: 'Software Engineering',
    priority: 'high',
    completed: false,
  },
  {
    id: 'c11',
    title: 'Tech Fest Registration',
    description: 'Last day to register for hackathon events.',
    date: getDateString(3),
    type: 'event',
    priority: 'medium',
    completed: false,
  },

  // ── DAY +4 ────────────────────────────────────────────────────
  {
    id: 'c12',
    title: 'AI & ML',
    description: 'Neural networks introduction',
    date: getDateString(4),
    time: '10:00',
    endTime: '11:30',
    type: 'class',
    subject: 'AI & Machine Learning',
    venue: 'Room 202',
    priority: 'medium',
    completed: false,
  },
  {
    id: 'c13',
    title: 'Elective: Ethics in Tech',
    description: 'Case studies discussion',
    date: getDateString(4),
    time: '14:00',
    endTime: '15:00',
    type: 'class',
    subject: 'Ethics in Technology',
    venue: 'Seminar Hall',
    priority: 'low',
    completed: false,
  },

  // ── DAY +5 ────────────────────────────────────────────────────
  {
    id: 'c14',
    title: 'College Holiday – Founders Day',
    description: 'No classes scheduled.',
    date: getDateString(5),
    type: 'holiday',
    priority: 'low',
    completed: false,
  },

  // ── DAY +6 ────────────────────────────────────────────────────
  {
    id: 'c15',
    title: 'CN Lab Assignment',
    description: 'Wireshark analysis report – due Sunday.',
    date: getDateString(6),
    type: 'assignment',
    subject: 'Computer Networks',
    priority: 'high',
    completed: false,
  },
  {
    id: 'c16',
    title: 'Weekly Review',
    description: 'Plan upcoming week tasks and revisions.',
    date: getDateString(6),
    type: 'reminder',
    priority: 'medium',
    completed: false,
  },
];

export function getEventsForDate(date: string): CampusEvent[] {
  return mockCampusEvents
    .filter((e) => e.date === date)
    .sort((a, b) => {
      if (a.time && b.time) return a.time.localeCompare(b.time);
      if (a.time) return -1;
      if (b.time) return 1;
      const pOrder = { high: 0, medium: 1, low: 2 };
      return pOrder[a.priority] - pOrder[b.priority];
    });
}

export function getMarkedDates(): Record<string, { marked: boolean; dotColor: string }> {
  const marked: Record<string, { marked: boolean; dotColor: string }> = {};
  mockCampusEvents.forEach((e) => {
    if (!marked[e.date]) {
      marked[e.date] = {
        marked: true,
        dotColor: EVENT_TYPE_COLORS[e.type] ?? '#6366F1',
      };
    }
  });
  return marked;
}
