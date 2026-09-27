/**
 * Campus Calendar Types
 */

export type CampusEventType =
  | 'assignment'
  | 'class'
  | 'exam'
  | 'holiday'
  | 'event'
  | 'reminder';

export interface CampusEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD format
  time?: string; // HH:mm format
  endTime?: string; // HH:mm format
  type: CampusEventType;
  /** Subject / course name */
  subject?: string;
  /** Room / venue */
  venue?: string;
  /** Due date urgency / priority */
  priority: 'low' | 'medium' | 'high';
  /** Whether marked as done (for assignments / reminders) */
  completed: boolean;
}

export interface DayData {
  date: string;
  events: CampusEvent[];
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
