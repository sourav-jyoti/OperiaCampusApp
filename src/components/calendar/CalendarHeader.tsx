/**
 * CalendarHeader – Month + Today button
 */

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { getMonthYear } from './date-helpers';
import { getAgendaColors } from './theme';

interface CalendarHeaderProps {
  selectedDate: string;
  isDarkMode: boolean;
  onTodayPress: () => void;
  onMonthPress: () => void;
}

export function CalendarHeader({
  selectedDate,
  isDarkMode,
  onTodayPress,
  onMonthPress,
}: CalendarHeaderProps) {
  const colors = useMemo(() => getAgendaColors(isDarkMode), [isDarkMode]);
  const monthYearLabel = useMemo(() => getMonthYear(selectedDate), [selectedDate]);

  const today = useMemo(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }, []);

  const isSelectedToday = selectedDate === today;

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTodayPress();
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.calendarHeader },
      ]}
    >
      {/* Month / year button */}
      <TouchableOpacity
        onPress={onMonthPress}
        style={styles.monthButton}
        activeOpacity={0.7}
      >
        <Text style={[styles.monthText, { color: colors.textPrimary }]}>
          {monthYearLabel}
        </Text>
        <Ionicons
          name="chevron-down"
          size={16}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {/* Today button */}
      <TouchableOpacity
        onPress={handleToggle}
        style={[
          styles.todayButton,
          {
            backgroundColor: isSelectedToday
              ? colors.textPrimary
              : colors.cardBackground,
          },
        ]}
        activeOpacity={0.7}
        disabled={isSelectedToday}
      >
        <Text
          style={[
            styles.todayButtonText,
            {
              color: isSelectedToday
                ? isDarkMode
                  ? '#0A0A0A'
                  : '#FFFFFF'
                : colors.textSecondary,
            },
          ]}
        >
          Today
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  monthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  monthText: {
    fontSize: 17,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  todayButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  todayButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default React.memo(CalendarHeader);
