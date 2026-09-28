/**
 * EmptyDay – shown when there are no events on a selected day
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { getAgendaColors } from './theme';

interface EmptyDayProps {
  isDarkMode: boolean;
  title?: string;
  subtitle?: string;
  emoji?: string;
}

export function EmptyDay({
  isDarkMode,
  title = 'No events for this day',
  subtitle = 'Enjoy your free time!',
  emoji = '📅',
}: EmptyDayProps) {
  const colors = getAgendaColors(isDarkMode);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? colors.cardBackground
            : `${colors.cardBorder}40`,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  emoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
});

export default React.memo(EmptyDay);
