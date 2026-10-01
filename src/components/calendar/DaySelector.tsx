/**
 * DaySelector Component
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { DateData } from "react-native-calendars";
import { CalendarProvider, WeekCalendar } from "react-native-calendars";

import { getAgendaColors } from "./theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface DayData {
  date: string;
  dayNum: number;
  isToday: boolean;
  isSelected: boolean;
  hasCompleted: boolean;
  hasTodos: boolean;
  completionProgress: number;
}

interface DaySelectorProps {
  days: DayData[];
  selectedDate: string;
  isDarkMode: boolean;
  onDayPress: (date: string) => void;
}

export function DaySelector({
  days,
  selectedDate,
  isDarkMode,
  onDayPress,
}: DaySelectorProps) {
  const colors = useMemo(() => getAgendaColors(isDarkMode), [isDarkMode]);

  // Create a map for quick lookup of day status
  const dayStatusMap = useMemo(() => {
    const map: Record<string, DayData> = {};
    days.forEach((day) => {
      map[day.date] = day;
    });
    return map;
  }, [days]);

  // Handle day press
  const handleDayPress = useCallback(
    (date: DateData) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onDayPress(date.dateString);
    },
    [onDayPress]
  );

  // Get dot color based on completion status
  const getDotColor = useCallback(
    (dayData: DayData | undefined, isSelected: boolean): string => {
      if (!dayData || !dayData.hasTodos) {
        return isDarkMode ? "#4A4A4A" : "#C4C4C4";
      }
      if (dayData.hasCompleted) {
        return "#4FE0B5";
      }
      if (dayData.completionProgress > 0.5) {
        return "#FFB347";
      }
      if (dayData.completionProgress > 0) {
        return "#FF6B6B";
      }
      return "#6366F1";
    },
    [isDarkMode]
  );

  // Custom day component
  const renderDay = useCallback(
    ({ date }: { date?: DateData; state?: string }) => {
      if (!date) return <View style={styles.dayPill} />;

      const isSelected = date.dateString === selectedDate;
      const dayData = dayStatusMap[date.dateString];
      const isToday = dayData?.isToday;
      const dotColor = getDotColor(dayData, isSelected);

      // Compute short weekday name (MON, TUE, etc.)
      const d = new Date(date.year, date.month - 1, date.day);
      const weekdayStr = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();

      return (
        <TouchableOpacity
          onPress={() => handleDayPress(date)}
          activeOpacity={0.7}
          style={styles.dayWrapper}
        >
          <View
            style={[
              styles.dayPill,
              isSelected ? styles.dayPillSelected : styles.dayPillUnselected,
              isToday && !isSelected && styles.dayPillToday,
            ]}
          >
            {/* Weekday abbreviation */}
            <Text
              style={[
                styles.dayWeekday,
                isSelected ? styles.dayWeekdaySelected : styles.dayWeekdayUnselected,
              ]}
            >
              {weekdayStr}
            </Text>

            {/* Day Number */}
            <Text
              style={[
                styles.dayNum,
                isSelected ? styles.dayNumSelected : styles.dayNumUnselected,
              ]}
            >
              {date.day}
            </Text>

            {/* Status Indicator */}
            {dayData?.hasCompleted && isSelected ? (
              <Ionicons name="checkmark-circle" size={13} color="#FFFFFF" />
            ) : (
              <View
                style={[
                  styles.dotIndicator,
                  {
                    backgroundColor: isSelected
                      ? '#FFFFFF'
                      : dayData?.hasTodos
                      ? dotColor
                      : 'transparent',
                  },
                ]}
              />
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [selectedDate, dayStatusMap, getDotColor, handleDayPress]
  );

  // Calendar theme
  const calendarTheme = useMemo(
    () => ({
      backgroundColor: colors.background,
      calendarBackground: colors.background,
      reservationsBackgroundColor: colors.background,
      textSectionTitleColor: colors.textMuted,
      selectedDayBackgroundColor: '#2563EB',
      selectedDayTextColor: '#FFFFFF',
      todayTextColor: '#2563EB',
      dayTextColor: colors.textPrimary,
      textDisabledColor: colors.textMuted,
      arrowColor: colors.textPrimary,
      monthTextColor: colors.textPrimary,
      textDayFontWeight: '600' as const,
      textDayFontSize: 16,
      'stylesheet.calendar.header': {
        header: {
          height: 0,
          opacity: 0,
        },
        dayHeader: {
          display: 'none',
        },
      },
    }),
    [colors]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CalendarProvider
        date={selectedDate}
        onDateChanged={(date) => {
          if (date) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onDayPress(date);
          }
        }}
      >
        <WeekCalendar
          key={isDarkMode ? 'dark' : 'light'}
          firstDay={1}
          theme={calendarTheme}
          dayComponent={renderDay}
          allowShadow={false}
          calendarWidth={SCREEN_WIDTH}
          calendarHeight={90}
          hideDayNames
          style={styles.weekCalendar}
        />
      </CalendarProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    width: SCREEN_WIDTH,
    overflow: 'visible',
  },
  weekCalendar: {
    height: 90,
    width: SCREEN_WIDTH,
  },
  dayWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 86,
  },
  dayPill: {
    width: 48,
    height: 74,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  dayPillSelected: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  dayPillUnselected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  dayPillToday: {
    borderColor: '#93C5FD',
    backgroundColor: '#F0F7FF',
  },
  dayWeekday: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dayWeekdaySelected: {
    color: '#BFDBFE',
  },
  dayWeekdayUnselected: {
    color: '#64748B',
  },
  dayNum: {
    fontSize: 18,
    fontWeight: '800',
  },
  dayNumSelected: {
    color: '#FFFFFF',
  },
  dayNumUnselected: {
    color: '#0F172A',
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

export default React.memo(DaySelector);
