import * as Haptics from 'expo-haptics';
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
    <View style={[styles.wrapper, { borderBottomColor: colors.cardBorder }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CALENDAR_CATEGORIES.map((category) => {
          const isSelected = category.id === selectedCategory;
          return (
            <Pressable
              key={category.id}
              onPress={() => handlePress(category.id)}
              style={styles.tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
            >
              <Text
                style={[
                  styles.tabLabel,
                  { color: isSelected ? colors.textPrimary : colors.textMuted },
                  isSelected && styles.tabLabelSelected,
                ]}
              >
                {category.label}
              </Text>
              {isSelected ? (
                <View
                  style={[styles.indicator, { backgroundColor: colors.accent }]}
                />
              ) : (
                <View style={styles.indicatorPlaceholder} />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 8,
  },
  scrollContent: {
    paddingHorizontal: 12,
    gap: 4,
  },
  tab: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  tabLabelSelected: {
    fontWeight: '700',
  },
  indicator: {
    marginTop: 8,
    height: 3,
    width: '100%',
    minWidth: 48,
    borderRadius: 2,
  },
  indicatorPlaceholder: {
    marginTop: 8,
    height: 3,
  },
});

export default React.memo(CategoryTabBar);
