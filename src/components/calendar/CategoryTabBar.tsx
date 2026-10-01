import * as Haptics from 'expo-haptics';
import {
  CalendarCheck,
  Clock,
  FileText,
  GraduationCap,
  Sparkles,
} from 'lucide-react-native';
import React, { useCallback } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CALENDAR_CATEGORIES, type CalendarCategoryId } from './calendar-categories';
import { getAgendaColors } from './theme';

const CATEGORY_ICONS: Record<
  CalendarCategoryId,
  React.ComponentType<{ size: number; color: string }>
> = {
  timetable: Clock,
  assignment: FileText,
  attendance: CalendarCheck,
  events: Sparkles,
  exam: GraduationCap,
};

interface CategoryTabBarProps {
  selectedCategory: CalendarCategoryId;
  isDarkMode: boolean;
  onCategoryChange: (category: CalendarCategoryId) => void;
}

export function CategoryTabBar({
  selectedCategory,
  isDarkMode,
  onCategoryChange,
}: CategoryTabBarProps) {
  const colors = getAgendaColors(isDarkMode);

  const handlePress = useCallback(
    (id: CalendarCategoryId) => {
      if (id === selectedCategory) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onCategoryChange(id);
    },
    [onCategoryChange, selectedCategory]
  );

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CALENDAR_CATEGORIES.map((category) => {
          const isSelected = category.id === selectedCategory;
          const Icon = CATEGORY_ICONS[category.id];

          return (
            <Pressable
              key={category.id}
              onPress={() => handlePress(category.id)}
              style={({ pressed }) => [
                styles.tabPill,
                isSelected ? styles.tabPillSelected : styles.tabPillUnselected,
                pressed && styles.tabPillPressed,
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
            >
              {Icon && (
                <Icon
                  size={15}
                  color={isSelected ? '#FFFFFF' : '#64748B'}
                />
              )}
              <Text
                style={[
                  styles.tabLabel,
                  isSelected ? styles.tabLabelSelected : styles.tabLabelUnselected,
                ]}
              >
                {category.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  tabPillSelected: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  tabPillUnselected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabPillPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabLabelSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabLabelUnselected: {
    color: '#475569',
  },
});

export default React.memo(CategoryTabBar);
