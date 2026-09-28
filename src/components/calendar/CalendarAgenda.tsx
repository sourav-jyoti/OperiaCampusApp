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
import { CalendarCategoryContent } from './CalendarCategoryContent';
import { CalendarHeader } from './CalendarHeader';
import { CategoryTabBar } from './CategoryTabBar';
import type { CalendarCategoryId } from './calendar-categories';
import { dateHasCategoryData } from './category-mock-data';
import { getDateString, getTodayString, parseDateString } from './date-helpers';
import { DaySelector } from './DaySelector';
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
  const [selectedCategory, setSelectedCategory] =
    useState<CalendarCategoryId>('timetable');
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
      const hasData = dateHasCategoryData(day.date);
      return {
        ...day,
        hasTodos: hasData,
        hasCompleted: false,
        completionProgress: 0,
      };
    });
  }, [baseDays]);

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

  const renderDayContent = (dayIndex: number) => {
    const day = daysWithStatus[dayIndex];
    if (!day) return null;

    return (
      <View
        key={day.date}
        style={[styles.dayContainer, { width: SCREEN_WIDTH }]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.eventList}
        >
          <CalendarCategoryContent
            date={day.date}
            category={selectedCategory}
            isDarkMode={isDarkMode}
          />
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

      <CategoryTabBar
        selectedCategory={selectedCategory}
        isDarkMode={isDarkMode}
        onCategoryChange={setSelectedCategory}
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
    paddingTop: 16,
  },
});

export default React.memo(CalendarAgenda);
