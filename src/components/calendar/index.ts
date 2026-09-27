/**
 * Campus Calendar Components – public API
 */

export { CalendarAgenda } from './CalendarAgenda';
export { CalendarHeader } from './CalendarHeader';
export { DaySelector } from './DaySelector';
export { MonthPicker } from './MonthPicker';
export { AgendaItem } from './AgendaItem';
export { EmptyDay } from './EmptyDay';
export { getTheme, getAgendaColors, themeColor, accentColor } from './theme';
export {
  getEventsForDate,
  getMarkedDates,
  mockCampusEvents,
  EVENT_TYPE_COLORS,
} from './mock-data';
export type {
  CampusEvent,
  CampusEventType,
  DayData,
  MarkedDate,
  MarkedDates,
  WeekDay,
} from './types';
