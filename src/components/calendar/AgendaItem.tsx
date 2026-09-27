/**
 * AgendaItem – renders a single campus event card
 * Supports: assignment, class, exam, holiday, event, reminder
 */

import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { EVENT_TYPE_COLORS } from './mock-data';
import { getAgendaColors } from './theme';
import type { CampusEvent } from './types';

const EVENT_TYPE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  assignment: 'document-text-outline',
  class: 'school-outline',
  exam: 'clipboard-outline',
  holiday: 'sunny-outline',
  event: 'star-outline',
  reminder: 'alarm-outline',
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  assignment: 'Assignment',
  class: 'Class',
  exam: 'Exam',
  holiday: 'Holiday',
  event: 'Event',
  reminder: 'Reminder',
};

interface AgendaItemProps {
  item: CampusEvent;
  isDarkMode: boolean;
  onPress?: (item: CampusEvent) => void;
  onToggleComplete?: (item: CampusEvent) => void;
}

export function AgendaItem({
  item,
  isDarkMode,
  onPress,
  onToggleComplete,
}: AgendaItemProps) {
  const colors = getAgendaColors(isDarkMode);
  const accentColor = EVENT_TYPE_COLORS[item.type] ?? colors.accent;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(item);
  };

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onToggleComplete?.(item);
  };

  const iconName = EVENT_TYPE_ICONS[item.type] ?? 'calendar-outline';
  const typeLabel = EVENT_TYPE_LABELS[item.type] ?? item.type;

  const canComplete = item.type === 'assignment' || item.type === 'reminder';

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
          },
          item.completed && styles.containerCompleted,
        ]}
      >
        {/* Left accent bar */}
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

        <View style={styles.body}>
          {/* Type icon + label row */}
          <View style={styles.typeRow}>
            <Ionicons
              name={iconName}
              size={13}
              color={accentColor}
              style={styles.typeIcon}
            />
            <Text style={[styles.typeLabel, { color: accentColor }]}>
              {typeLabel}
            </Text>
            {/* Time badge */}
            {item.time && (
              <View
                style={[
                  styles.timeBadge,
                  {
                    backgroundColor: isDarkMode ? '#2A2A2A' : '#F0EDE8',
                    marginLeft: 'auto',
                  },
                ]}
              >
                <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                  {item.time}
                  {item.endTime ? ` – ${item.endTime}` : ''}
                </Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text
            style={[
              styles.title,
              { color: colors.textPrimary },
              item.completed && styles.titleCompleted,
            ]}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          {/* Subject / venue row */}
          {(item.subject || item.venue) && (
            <View style={styles.metaRow}>
              {item.subject && (
                <Text
                  style={[styles.metaText, { color: colors.textSecondary }]}
                  numberOfLines={1}
                >
                  {item.subject}
                </Text>
              )}
              {item.subject && item.venue && (
                <Text style={[styles.metaDot, { color: colors.textMuted }]}>
                  {' · '}
                </Text>
              )}
              {item.venue && (
                <Ionicons
                  name="location-outline"
                  size={12}
                  color={colors.textMuted}
                  style={{ marginRight: 2 }}
                />
              )}
              {item.venue && (
                <Text
                  style={[styles.metaText, { color: colors.textMuted }]}
                  numberOfLines={1}
                >
                  {item.venue}
                </Text>
              )}
            </View>
          )}

          {/* Description */}
          {item.description && !item.completed && (
            <Text
              style={[styles.description, { color: colors.textMuted }]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          )}
        </View>

        {/* Checkbox – only for assignment / reminder */}
        {canComplete && (
          <TouchableOpacity
            onPress={handleToggle}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={[
              styles.checkbox,
              {
                borderColor: item.completed ? colors.success : colors.cardBorder,
                backgroundColor: item.completed ? colors.success : 'transparent',
              },
            ]}
          >
            {item.completed && (
              <Ionicons
                name="checkmark"
                size={14}
                color={isDarkMode ? '#0A0A0A' : '#FFFFFF'}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  containerCompleted: {
    opacity: 0.55,
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  body: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 4,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeIcon: {
    marginRight: 1,
  },
  typeLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    flexShrink: 1,
  },
  metaDot: {
    fontSize: 12,
  },
  description: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  timeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginRight: 12,
    alignSelf: 'center',
  },
});

export default React.memo(AgendaItem);
