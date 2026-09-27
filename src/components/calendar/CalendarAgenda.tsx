/**
 * CalendarAgenda – Campus version
 * Shows assignments, timetable, exams & events per day.
 * No todo / add-item FAB.
 */

import * as Haptics from 'expo-haptics';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AnimatedSlidingNumber from '../animated/AnimatedSlidingNumber';
import { AgendaItem } from './AgendaItem';
import { CalendarHeader } from './CalendarHeader';
import { getDateString, getTodayString, parseDateString } from './date-helpers';
import { DaySelector } from './DaySelector';
import { EmptyDay } from './EmptyDay';
import { EVENT_TYPE_COLORS, mockCampusEvents } from './mock-data';
import { MonthPicker } from './MonthPicker';
import { getAgendaColors } from './theme';
import type { CampusEvent } from './types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function getMonthYear(dateString: string): { year: number; month: number } {
  const { year, month } = parseDateString(dateString);
  return { year, month };
}

function buildDayTimeline(baseDate: string, totalDays: number = 30) {
  const days = [];
  const { year, month } = getMonthYear(baseDate);
  const todayStr = getTodayString();

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(year, month, i + 1);
    days.push({
      date: getDateString(date),
      dayNum: i + 1,
      isToday: getDateString(date) === todayStr,
      isSelected: false,
      hasTodos: false,
      hasCompleted: false,
      completionProgress: 0,
    });
  }

  return days;
}

interface CalendarAgendaProps {
  isDarkMode?: boolean;
  /** Called when user taps an event card */
  onEventPress?: (event: CampusEvent) => void;
  onDateChange?: (date: string) => void;
}

export function CalendarAgenda({
  isDarkMode = false,
  onEventPress,
  onDateChange,
}: CalendarAgendaProps) {
  const today = useMemo(() => getTodayString(), []);
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [events, setEvents] = useState<CampusEvent[]>(mockCampusEvents);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const isScrollingRef = useRef(false);

  const colors = useMemo(() => getAgendaColors(isDarkMode), [isDarkMode]);

  // Build day timeline for selected month
  const baseDays = useMemo(() => {
    const { year, month } = getMonthYear(selectedDate);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return buildDayTimeline(selectedDate, daysInMonth);
  }, [selectedDate]);

  // Enrich with completion status
  const daysWithStatus = useMemo(() => {
    return baseDays.map((day) => {
      const dayEvents = events.filter((e) => e.date === day.date);
      const completable = dayEvents.filter(
        (e) => e.type === 'assignment' || e.type === 'reminder'
      );
      const completed = completable.filter((e) => e.completed);
      const progress =
        completable.length > 0 ? completed.length / completable.length : 0;
      return {
        ...day,
        hasTodos: dayEvents.length > 0,
        hasCompleted: progress === 1 && completable.length > 0,
        completionProgress: progress,
      };
    });
  }, [baseDays, events]);

  // Current day index (for the "DAY N / total" display)
  const currentDayIndex = useMemo(() => {
    const idx = daysWithStatus.findIndex((d) => d.date === selectedDate);
    return idx >= 0 ? idx : 0;
  }, [daysWithStatus, selectedDate]);

  // Scroll to date in the horizontal pager
  const scrollToDate = useCallback(
    (date: string) => {
      const index = daysWithStatus.findIndex((d) => d.date === date);
      if (index >= 0 && scrollViewRef.current) {
        isScrollingRef.current = true;
        scrollViewRef.current.scrollTo({
          x: index * SCREEN_WIDTH,
          animated: true,
        });
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 500);
      }
    },
    [daysWithStatus]
  );

  const handleDayPress = useCallback(
    (date: string) => {
      setSelectedDate(date);
      onDateChange?.(date);
      scrollToDate(date);
    },
    [scrollToDate, onDateChange]
  );

  const handleToggleComplete = useCallback((event: CampusEvent) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id ? { ...e, completed: !e.completed } : e
      )
    );
  }, []);

  const handleEventPress = useCallback(
    (event: CampusEvent) => {
      onEventPress?.(event);
    },
    [onEventPress]
  );

  const getEventsForDate = useCallback(
    (date: string): CampusEvent[] => {
      return events
        .filter((e) => e.date === date)
        .sort((a, b) => {
          if (a.time && b.time) return a.time.localeCompare(b.time);
          if (a.time) return -1;
          if (b.time) return 1;
          const pOrder = { high: 0, medium: 1, low: 2 };
          return pOrder[a.priority] - pOrder[b.priority];
        });
    },
    [events]
  );

  const handleScrollEndDrag = useCallback(
    (e: any) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / SCREEN_WIDTH);
      const targetDay = daysWithStatus[index];
      if (targetDay && targetDay.date !== selectedDate) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedDate(targetDay.date);
        onDateChange?.(targetDay.date);
      }
    },
    [daysWithStatus, selectedDate, onDateChange]
  );

  const handleScrollEnd = useCallback(
    (e: any) => {
      if (isScrollingRef.current) return;
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / SCREEN_WIDTH);
      const targetDay = daysWithStatus[index];
      if (targetDay && targetDay.date !== selectedDate) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedDate(targetDay.date);
        onDateChange?.(targetDay.date);
      }
    },
    [daysWithStatus, selectedDate, onDateChange]
  );

  const handleTodayPress = useCallback(() => {
    setSelectedDate(today);
    onDateChange?.(today);
    scrollToDate(today);
  }, [today, onDateChange, scrollToDate]);

  const handleOpenMonthPicker = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowMonthPicker(true);
  }, []);

  const handleCloseMonthPicker = useCallback(() => setShowMonthPicker(false), []);

  const handleSelectDate = useCallback(
    (date: string) => {
      setSelectedDate(date);
      onDateChange?.(date);
      scrollToDate(date);
    },
    [onDateChange, scrollToDate]
  );

  // Group events by type label
  const TYPE_ORDER = ['exam', 'class', 'assignment', 'reminder', 'event', 'holiday'];

  const renderDayContent = (dayIndex: number) => {
    const day = daysWithStatus[dayIndex];
    if (!day) return null;

    const dayEvents = getEventsForDate(day.date);

    // Group by type for section headings
    const grouped: Record<string, CampusEvent[]> = {};
    dayEvents.forEach((e) => {
      if (!grouped[e.type]) grouped[e.type] = [];
      grouped[e.type].push(e);
    });

    const sections = TYPE_ORDER.filter((t) => grouped[t]);

    const SECTION_LABELS: Record<string, string> = {
      exam: '📝  EXAMS',
      class: '🏫  CLASSES',
      assignment: '📌  ASSIGNMENTS',
      reminder: '🔔  REMINDERS',
      event: '🎉  EVENTS',
      holiday: '🌟  HOLIDAYS',
    };

    return (
      <View
        key={day.date}
        style={[styles.dayContainer, { width: SCREEN_WIDTH }]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.eventList}
        >
          {dayEvents.length > 0 ? (
            sections.map((type) => (
              <View key={type} style={styles.section}>
                <Text
                  style={[styles.sectionTitle, { color: EVENT_TYPE_COLORS[type] }]}
                >
                  {SECTION_LABELS[type] ?? type.toUpperCase()}
                </Text>
                {grouped[type].map((ev) => (
                  <AgendaItem
                    key={ev.id}
                    item={ev}
                    isDarkMode={isDarkMode}
                    onPress={handleEventPress}
                    onToggleComplete={handleToggleComplete}
                  />
                ))}
              </View>
            ))
          ) : (
            <EmptyDay isDarkMode={isDarkMode} />
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <CalendarHeader
        selectedDate={selectedDate}
        isDarkMode={isDarkMode}
        onTodayPress={handleTodayPress}
        onMonthPress={handleOpenMonthPicker}
      />

      {/* Day N / total counter */}
      <View style={styles.dayTitleContainer}>
        <Text style={[styles.dayTitle, { color: colors.textPrimary }]}>
          DAY{' '}
        </Text>
        <AnimatedSlidingNumber
          number={currentDayIndex + 1}
          minDigits={1}
          maxDigits={2}
          textStyle={[styles.dayTitle, { color: colors.textPrimary }]}
          containerStyle={styles.animatedNumberContainer}
        />
        <Text style={[styles.dayTitleSuffix, { color: colors.textMuted }]}>
          {' '}
          / {baseDays.length}
        </Text>
      </View>

      {/* Week strip */}
      <DaySelector
        days={daysWithStatus}
        selectedDate={selectedDate}
        isDarkMode={isDarkMode}
        onDayPress={handleDayPress}
      />

      {/* Horizontal pager */}
      <View style={[styles.agendaContainer, { backgroundColor: colors.background }]}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScrollEndDrag={handleScrollEndDrag}
          onMomentumScrollEnd={handleScrollEnd}
          scrollEventThrottle={16}
          decelerationRate="normal"
        >
          {daysWithStatus.map((_, index) => renderDayContent(index))}
        </ScrollView>
      </View>

      {/* Month Picker Modal */}
      <MonthPicker
        visible={showMonthPicker}
        selectedDate={selectedDate}
        isDarkMode={isDarkMode}
        onClose={handleCloseMonthPicker}
        onSelectDate={handleSelectDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dayTitleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  dayTitle: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  dayTitleSuffix: {
    fontSize: 24,
    fontWeight: '600',
  },
  animatedNumberContainer: {
    alignItems: 'baseline',
  },
  agendaContainer: {
    flex: 1,
    marginTop: 20,
  },
  dayContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  eventList: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 4,
  },
});

export default React.memo(CalendarAgenda);
