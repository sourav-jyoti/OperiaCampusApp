/**
 * CalendarHeader – Campus Month Selector + Today button
 */

import * as Haptics from 'expo-haptics';
import { Calendar, CalendarCheck, ChevronDown } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
        { backgroundColor: colors.background },
      ]}
    >
      {/* Month / Year Pill Button */}
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onMonthPress();
        }}
        style={({ pressed }) => [
          styles.monthButton,
          pressed && styles.buttonPressed,
        ]}
      >
        <View style={styles.calendarIconBox}>
          <Calendar size={16} color="#2563EB" />
        </View>
        <Text style={[styles.monthText, { color: colors.textPrimary }]}>
          {monthYearLabel}
        </Text>
        <ChevronDown size={16} color="#64748B" />
      </Pressable>

      {/* Today button */}
      <Pressable
        onPress={handleToggle}
        style={({ pressed }) => [
          styles.todayButton,
          isSelectedToday ? styles.todayButtonActive : styles.todayButtonInactive,
          pressed && styles.buttonPressed,
        ]}
        disabled={isSelectedToday}
      >
        <CalendarCheck
          size={14}
          color={isSelectedToday ? '#FFFFFF' : '#2563EB'}
        />
        <Text
          style={[
            styles.todayButtonText,
            { color: isSelectedToday ? '#FFFFFF' : '#2563EB' },
          ]}
        >
          Today
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  monthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  calendarIconBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  todayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },
  todayButtonActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  todayButtonInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  todayButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});

export default React.memo(CalendarHeader);
