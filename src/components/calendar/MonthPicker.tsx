/**
 * MonthPicker Component
 */

import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

import { getTodayString } from "./date-helpers";
import { getAgendaColors } from "./theme";

interface MonthPickerProps {
  visible: boolean;
  selectedDate: string;
  isDarkMode: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
}

export function MonthPicker({
  visible,
  selectedDate,
  isDarkMode,
  onClose,
  onSelectDate,
}: MonthPickerProps) {
  const colors = useMemo(() => getAgendaColors(isDarkMode), [isDarkMode]);
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const today = useMemo(() => getTodayString(), []);

  // Sync with selectedDate when modal opens
  useEffect(() => {
    if (visible) {
      setCurrentMonth(selectedDate);
    }
  }, [visible, selectedDate]);

  const handleDayPress = useCallback(
    (day: DateData) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSelectDate(day.dateString);
      onClose();
    },
    [onSelectDate, onClose]
  );

  const handleMonthChange = useCallback((month: DateData) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentMonth(month.dateString);
  }, []);

  // Marked dates for selected day
  const markedDates = useMemo(() => {
    return {
      [selectedDate]: {
        selected: true,
        selectedColor: '#2563EB',
        selectedTextColor: '#FFFFFF',
      },
    };
  }, [selectedDate]);

  // Calendar theme
  const calendarTheme = useMemo(
    () => ({
      backgroundColor: colors.background,
      calendarBackground: colors.background,
      textSectionTitleColor: colors.textMuted,
      textSectionTitleDisabledColor: colors.textMuted,
      selectedDayBackgroundColor: '#2563EB',
      selectedDayTextColor: '#FFFFFF',
      todayTextColor: '#2563EB',
      dayTextColor: colors.textPrimary,
      textDisabledColor: isDarkMode ? '#475569' : '#CBD5E1',
      dotColor: '#2563EB',
      selectedDotColor: '#FFFFFF',
      arrowColor: '#2563EB',
      disabledArrowColor: colors.textMuted,
      monthTextColor: colors.textPrimary,
      indicatorColor: '#2563EB',
      textDayFontWeight: '600' as const,
      textMonthFontWeight: '700' as const,
      textDayHeaderFontWeight: '600' as const,
      textDayFontSize: 16,
      textMonthFontSize: 18,
      textDayHeaderFontSize: 12,
      // Custom day styling
      'stylesheet.day.basic': {
        base: {
          width: 44,
          height: 54,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 20,
        },
        selected: {
          backgroundColor: '#2563EB',
          borderRadius: 20,
        },
        today: {
          backgroundColor: '#EFF6FF',
          borderRadius: 20,
        },
        text: {
          fontSize: 16,
          fontWeight: '600',
        },
      },
      'stylesheet.calendar.header': {
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingVertical: 10,
        },
        monthText: {
          fontSize: 18,
          fontWeight: '700',
          color: colors.textPrimary,
        },
        arrow: {
          padding: 10,
        },
        dayHeader: {
          width: 44,
          textAlign: 'center',
          fontSize: 12,
          fontWeight: '700',
          color: colors.textMuted,
          textTransform: 'uppercase',
        },
      },
    }),
    [colors, isDarkMode]
  );

  // Custom day component for pill style
  const renderDay = useCallback(
    ({ date, state }: { date?: DateData; state?: string }) => {
      if (!date) return null;

      const isSelected = date.dateString === selectedDate;
      const isToday = date.dateString === today;
      const isDisabled = state === 'disabled';

      const bgColor = isSelected
        ? '#2563EB'
        : isToday
        ? '#EFF6FF'
        : isDisabled
        ? 'transparent'
        : isDarkMode
        ? '#1E293B'
        : '#F1F5F9';

      const textColor = isSelected
        ? '#FFFFFF'
        : isToday
        ? '#2563EB'
        : isDisabled
        ? isDarkMode
          ? '#475569'
          : '#CBD5E1'
        : colors.textPrimary;

      return (
        <TouchableOpacity
          onPress={() => handleDayPress(date)}
          activeOpacity={0.7}
          style={[
            styles.dayPill,
            { backgroundColor: bgColor },
            isToday && !isSelected && styles.dayPillTodayBorder,
          ]}
        >
          <Text style={[styles.dayText, { color: textColor }]}>{date.day}</Text>
        </TouchableOpacity>
      );
    },
    [selectedDate, today, isDarkMode, colors, handleDayPress]
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Select Date
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={[
              styles.closeButton,
              { backgroundColor: colors.cardBackground },
            ]}
            activeOpacity={0.7}
          >
            <Ionicons
              name="close"
              size={20}
              color={isDarkMode ? "#FFFFFF" : "#1A1A1A"}
            />
          </TouchableOpacity>
        </View>

        {/* Calendar */}
        <Calendar
          current={currentMonth}
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
          markedDates={markedDates}
          theme={calendarTheme}
          firstDay={1}
          enableSwipeMonths
          dayComponent={renderDay}
          style={styles.calendar}
          renderArrow={(direction) => (
            <View
              style={[
                styles.arrowButton,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              <Ionicons
                name={direction === "left" ? "chevron-back" : "chevron-forward"}
                size={20}
                color={colors.textPrimary}
              />
            </View>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  calendar: {
    paddingHorizontal: 8,
    paddingTop: 10,
  },
  arrowButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  dayPill: {
    width: 44,
    height: 56,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  dayPillTodayBorder: {
    borderWidth: 1.5,
    borderColor: '#93C5FD',
  },
  dayText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default React.memo(MonthPicker);
