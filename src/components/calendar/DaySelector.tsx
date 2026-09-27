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
    ({ date, state }: { date?: DateData; state?: string }) => {
      if (!date) return <View style={styles.dayPill} />;

      const isSelected = date.dateString === selectedDate;
      const dayData = dayStatusMap[date.dateString];
      const dotColor = getDotColor(dayData, isSelected);

      // Selected day styling
      const selectedBg = isDarkMode ? "#FFFFFF" : "#1A1A1A";
      const selectedText = isDarkMode ? "#0A0A0A" : "#FFFFFF";

      // Unselected day styling
      const unselectedBg = isDarkMode ? "#1A1A1A" : "#EBEBEB";
      const unselectedText = isDarkMode ? "#FFFFFF" : "#1A1A1A";

      return (
        <TouchableOpacity
          onPress={() => handleDayPress(date)}
          activeOpacity={0.7}
          style={styles.dayWrapper}
        >
          <View
            style={[
              styles.dayPill,
              { backgroundColor: isSelected ? selectedBg : unselectedBg },
            ]}
          >
            <Text
              style={[
                styles.dayNum,
                { color: isSelected ? selectedText : unselectedText },
              ]}
            >
              {date.day}
            </Text>

            {/* Dot indicator */}
            {dayData?.hasCompleted && isSelected ? (
              <Ionicons name="checkmark" size={14} color={selectedText} />
            ) : (
              <View
                style={[
                  styles.dotIndicator,
                  {
                    backgroundColor: isSelected
                      ? isDarkMode
                        ? "#0A0A0A"
                        : "#FFFFFF"
                      : dotColor,
                  },
                ]}
              />
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [selectedDate, dayStatusMap, isDarkMode, getDotColor, handleDayPress]
  );

  // Calendar theme
  const calendarTheme = useMemo(
    () => ({
      backgroundColor: colors.background,
      calendarBackground: colors.background,
      reservationsBackgroundColor: colors.background,
      textSectionTitleColor: colors.textMuted,
      selectedDayBackgroundColor: isDarkMode ? "#FFFFFF" : "#1A1A1A",
      selectedDayTextColor: isDarkMode ? "#0A0A0A" : "#FFFFFF",
      todayTextColor: colors.accent,
      dayTextColor: colors.textPrimary,
      textDisabledColor: colors.textMuted,
      arrowColor: colors.textPrimary,
      monthTextColor: colors.textPrimary,
      textDayFontWeight: "600" as const,
      textDayFontSize: 18,
      // Hide the header
      "stylesheet.calendar.header": {
        header: {
          height: 0,
          opacity: 0,
        },
        dayHeader: {
          display: "none",
        },
      },
    }),
    [colors, isDarkMode]
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
          key={isDarkMode ? "dark" : "light"}
          firstDay={1}
          theme={calendarTheme}
          dayComponent={renderDay}
          allowShadow={false}
          calendarWidth={SCREEN_WIDTH}
          calendarHeight={85}
          hideDayNames
          style={styles.weekCalendar}
        />
      </CalendarProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 85,
    width: SCREEN_WIDTH,
    overflow: "visible",
  },
  weekCalendar: {
    height: 85,
    width: SCREEN_WIDTH,
  },
  dayWrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: 80,
  },
  dayPill: {
    width: 48,
    height: 68,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  dayNum: {
    fontSize: 18,
    fontWeight: "600",
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default React.memo(DaySelector);
