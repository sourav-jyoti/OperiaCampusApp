import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { EmptyDay } from './EmptyDay';
import { TimetablePeriodCard } from './TimetablePeriodCard';
import type {
  AssignmentStatus,
  AttendanceStatus,
  CalendarCategoryId,
} from './calendar-categories';
import {
  getAssignmentsForDate,
  getAttendanceForDate,
  getEventsForCalendarDate,
  getExamsForDate,
  getTimetableForDate,
} from './category-mock-data';
import { formatDayHeading } from './date-helpers';
import { getAgendaColors } from './theme';

interface CalendarCategoryContentProps {
  date: string;
  category: CalendarCategoryId;
  isDarkMode: boolean;
}

const ATTENDANCE_LABELS: Record<AttendanceStatus, string> = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  'half-day': 'Half day',
  holiday: 'Holiday',
};

const ATTENDANCE_COLORS: Record<
  AttendanceStatus,
  { bg: string; text: string }
> = {
  present: { bg: '#E8F5EC', text: '#2D8A56' },
  absent: { bg: '#FDECEC', text: '#D93636' },
  late: { bg: '#FEF5E7', text: '#C4820D' },
  'half-day': { bg: '#EEF2FF', text: '#4F46E5' },
  holiday: { bg: '#F0EDE8', text: '#6B6560' },
};

const ASSIGNMENT_STATUS_LABELS: Record<AssignmentStatus, string> = {
  pending: 'Pending',
  submitted: 'Submitted',
  overdue: 'Overdue',
  graded: 'Graded',
};

function DetailCard({
  isDarkMode,
  children,
}: {
  isDarkMode: boolean;
  children: React.ReactNode;
}) {
  const colors = getAgendaColors(isDarkMode);
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      {children}
    </View>
  );
}

function CardTitle({
  isDarkMode,
  children,
}: {
  isDarkMode: boolean;
  children: React.ReactNode;
}) {
  const colors = getAgendaColors(isDarkMode);
  return (
    <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
      {children}
    </Text>
  );
}

function CardMeta({
  isDarkMode,
  children,
}: {
  isDarkMode: boolean;
  children: React.ReactNode;
}) {
  const colors = getAgendaColors(isDarkMode);
  return (
    <Text style={[styles.cardMeta, { color: colors.textSecondary }]}>
      {children}
    </Text>
  );
}

function CategoryEmpty({
  isDarkMode,
  title,
  subtitle,
}: {
  isDarkMode: boolean;
  title: string;
  subtitle: string;
}) {
  return (
    <EmptyDay
      isDarkMode={isDarkMode}
      title={title}
      subtitle={subtitle}
      emoji="📭"
    />
  );
}

export function CalendarCategoryContent({
  date,
  category,
  isDarkMode,
}: CalendarCategoryContentProps) {
  const colors = getAgendaColors(isDarkMode);
  const dayHeading = useMemo(() => formatDayHeading(date), [date]);

  switch (category) {
    case 'timetable': {
      const slots = getTimetableForDate(date);
      if (slots.length === 0) {
        return (
          <CategoryEmpty
            isDarkMode={isDarkMode}
            title="No timetable for this day"
            subtitle="Select another date or check back later."
          />
        );
      }
      return (
        <View>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
            {dayHeading}
          </Text>
          {slots.map((slot, index) => (
            <TimetablePeriodCard
              key={`${slot.kind}-${index}`}
              slot={slot}
              isDarkMode={isDarkMode}
            />
          ))}
        </View>
      );
    }

    case 'attendance': {
      const record = getAttendanceForDate(date);
      if (!record) {
        return (
          <CategoryEmpty
            isDarkMode={isDarkMode}
            title="No attendance record"
            subtitle="There is no attendance logged for this date."
          />
        );
      }
      const palette = ATTENDANCE_COLORS[record.status];
      return (
        <DetailCard isDarkMode={isDarkMode}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
            {dayHeading}
          </Text>
          <View style={[styles.statusPill, { backgroundColor: palette.bg }]}>
            <Text style={[styles.statusPillText, { color: palette.text }]}>
              {ATTENDANCE_LABELS[record.status]}
            </Text>
          </View>
          {record.checkIn ? (
            <CardMeta isDarkMode={isDarkMode}>
              Check-in: {record.checkIn}
              {record.checkOut ? ` · Check-out: ${record.checkOut}` : ''}
            </CardMeta>
          ) : null}
          {record.note ? (
            <CardMeta isDarkMode={isDarkMode}>{record.note}</CardMeta>
          ) : null}
        </DetailCard>
      );
    }

    case 'assignment': {
      const items = getAssignmentsForDate(date);
      if (items.length === 0) {
        return (
          <CategoryEmpty
            isDarkMode={isDarkMode}
            title="No assignments"
            subtitle="Nothing is scheduled for this date."
          />
        );
      }
      return (
        <View>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
            {dayHeading}
          </Text>
          {items.map((item) => (
            <DetailCard key={item.id} isDarkMode={isDarkMode}>
              <CardTitle isDarkMode={isDarkMode}>{item.title}</CardTitle>
              <CardMeta isDarkMode={isDarkMode}>Subject: {item.subject}</CardMeta>
              <CardMeta isDarkMode={isDarkMode}>Due: {item.dueDate}</CardMeta>
              <View style={styles.rowBadge}>
                <Text style={[styles.badgeText, { color: colors.accent }]}>
                  {ASSIGNMENT_STATUS_LABELS[item.status]}
                </Text>
              </View>
            </DetailCard>
          ))}
        </View>
      );
    }

    case 'events': {
      const items = getEventsForCalendarDate(date);
      if (items.length === 0) {
        return (
          <CategoryEmpty
            isDarkMode={isDarkMode}
            title="No events"
            subtitle="No campus events on this date."
          />
        );
      }
      return (
        <View>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
            {dayHeading}
          </Text>
          {items.map((item) => (
            <DetailCard key={item.id} isDarkMode={isDarkMode}>
              <CardTitle isDarkMode={isDarkMode}>{item.title}</CardTitle>
              <CardMeta isDarkMode={isDarkMode}>
                {item.time}
                {item.endTime ? ` – ${item.endTime}` : ''}
              </CardMeta>
              {item.location ? (
                <CardMeta isDarkMode={isDarkMode}>{item.location}</CardMeta>
              ) : null}
              {item.details ? (
                <CardMeta isDarkMode={isDarkMode}>{item.details}</CardMeta>
              ) : null}
            </DetailCard>
          ))}
        </View>
      );
    }

    case 'exam': {
      const items = getExamsForDate(date);
      if (items.length === 0) {
        return (
          <CategoryEmpty
            isDarkMode={isDarkMode}
            title="No exams scheduled"
            subtitle="Pick another date to view the exam schedule."
          />
        );
      }
      return (
        <View>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary }]}>
            {dayHeading}
          </Text>
          {items.map((item) => (
            <DetailCard key={item.id} isDarkMode={isDarkMode}>
              <CardTitle isDarkMode={isDarkMode}>{item.subject}</CardTitle>
              <CardMeta isDarkMode={isDarkMode}>
                {item.time}
                {item.endTime ? ` – ${item.endTime}` : ''}
              </CardMeta>
              <CardMeta isDarkMode={isDarkMode}>Room: {item.room}</CardMeta>
              {item.details ? (
                <CardMeta isDarkMode={isDarkMode}>{item.details}</CardMeta>
              ) : null}
            </DetailCard>
          ))}
        </View>
      );
    }

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  sectionHeading: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardMeta: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 2,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
    marginBottom: 8,
  },
  statusPillText: {
    fontSize: 14,
    fontWeight: '700',
  },
  rowBadge: {
    marginTop: 10,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export default React.memo(CalendarCategoryContent);
