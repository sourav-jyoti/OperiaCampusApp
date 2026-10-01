import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Coffee, MessageSquare } from 'lucide-react-native';
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
  const router = useRouter();

  const handleMessage = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onMessagePress) {
      onMessagePress();
    } else {
      router.push('/(app)/(tabs)/tabs.Messages');
    }
  };

  if (slot.kind === 'recess') {
    return (
      <LinearGradient
        colors={['#0284C7', '#2563EB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.recessBar}
      >
        <View style={styles.recessContent}>
          <Coffee size={18} color="#FFFFFF" />
          <Text style={styles.recessText}>
            Lunch & Recess Break ({slot.startTime} – {slot.endTime})
          </Text>
        </View>
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
        },
      ]}
    >
      <View style={styles.timeColumn}>
        <View style={styles.periodBadge}>
          <Text style={styles.periodLabel}>Period {slot.period}</Text>
        </View>
        <Text style={[styles.timeText, { color: colors.textSecondary }]}>
          {slot.startTime}
        </Text>
        <Text style={[styles.timeTextMuted, { color: colors.textMuted }]}>
          {slot.endTime}
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />

      <View style={[styles.iconBox, { backgroundColor: `${slot.color}15` }]}>
        <Text style={[styles.iconLetter, { color: slot.color }]}>
          {subjectInitial(slot.subject)}
        </Text>
      </View>

      <View style={styles.infoColumn}>
        <Text style={[styles.subject, { color: colors.textPrimary }]} numberOfLines={1}>
          {slot.subject}
        </Text>
        <Text style={[styles.teacher, { color: colors.textSecondary }]} numberOfLines={1}>
          {slot.teacher}
        </Text>
      </View>

      <Pressable
        onPress={handleMessage}
        hitSlop={8}
        style={({ pressed }) => [styles.chatButton, pressed && styles.chatPressed]}
        accessibilityRole="button"
        accessibilityLabel={`Message ${slot.teacher}`}
      >
        <View style={styles.chatIconCircle}>
          <MessageSquare size={16} color="#2563EB" />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  timeColumn: {
    width: 78,
    paddingRight: 6,
  },
  periodBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 4,
  },
  periodLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  timeTextMuted: {
    fontSize: 11,
    marginTop: 1,
  },
  divider: {
    width: 1,
    height: 40,
    marginRight: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconLetter: {
    fontSize: 18,
    fontWeight: '800',
  },
  infoColumn: {
    flex: 1,
    minWidth: 0,
  },
  subject: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  teacher: {
    fontSize: 12,
  },
  chatButton: {
    padding: 2,
    marginLeft: 6,
  },
  chatPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  chatIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  recessBar: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#2563EB',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  recessContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  recessText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default React.memo(TimetablePeriodCard);
