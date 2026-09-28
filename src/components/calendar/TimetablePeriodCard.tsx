import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { TimetableSlot } from './calendar-categories';
import { getAgendaColors } from './theme';

interface TimetablePeriodCardProps {
  slot: TimetableSlot;
  isDarkMode: boolean;
  onMessagePress?: () => void;
}

function subjectInitial(subject: string): string {
  return subject.trim().charAt(0).toUpperCase();
}

export function TimetablePeriodCard({
  slot,
  isDarkMode,
  onMessagePress,
}: TimetablePeriodCardProps) {
  const colors = getAgendaColors(isDarkMode);

  if (slot.kind === 'recess') {
    return (
      <LinearGradient
        colors={['#22D3EE', '#0EA5E9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.recessBar}
      >
        <Text style={styles.recessText}>
          Recess Time: {slot.startTime} - {slot.endTime}
        </Text>
      </LinearGradient>
    );
  }

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
          shadowColor: isDarkMode ? '#000' : '#1A1A1A',
        },
      ]}
    >
      <View style={styles.timeColumn}>
        <Text style={[styles.periodLabel, { color: colors.textPrimary }]}>
          Period {slot.period}
        </Text>
        <Text style={[styles.timeText, { color: colors.textMuted }]}>
          {slot.startTime}
        </Text>
        <Text style={[styles.timeText, { color: colors.textMuted }]}>
          {slot.endTime}
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />

      <View style={[styles.iconBox, { backgroundColor: slot.color }]}>
        <Text style={styles.iconLetter}>{subjectInitial(slot.subject)}</Text>
      </View>

      <View style={styles.infoColumn}>
        <Text style={[styles.subject, { color: colors.textPrimary }]}>
          {slot.subject}
        </Text>
        <Text style={[styles.teacher, { color: colors.textSecondary }]}>
          {slot.teacher}
        </Text>
      </View>

      <Pressable
        onPress={onMessagePress}
        hitSlop={8}
        style={({ pressed }) => [styles.chatButton, pressed && styles.chatPressed]}
        accessibilityRole="button"
        accessibilityLabel={`Message ${slot.teacher}`}
      >
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  timeColumn: {
    width: 72,
    paddingRight: 8,
  },
  periodLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  timeText: {
    fontSize: 11,
    lineHeight: 16,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    marginRight: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconLetter: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  infoColumn: {
    flex: 1,
    minWidth: 0,
  },
  subject: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  teacher: {
    fontSize: 13,
  },
  chatButton: {
    padding: 4,
    marginLeft: 4,
  },
  chatPressed: {
    opacity: 0.6,
  },
  recessBar: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  recessText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default React.memo(TimetablePeriodCard);
