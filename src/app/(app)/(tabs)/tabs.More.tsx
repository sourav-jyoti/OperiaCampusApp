import { useTabBarScroll } from '@/hooks/useTabBarScroll';
import { useRouter } from 'expo-router';
import {
  BarChart3,
  BookMarked,
  BookOpen,
  Bot,
  Calendar,
  CalendarCheck,
  CalendarCog,
  CalendarDays,
  CalendarOff,
  ChartColumn,
  ChevronRight,
  ClipboardCheck,
  Clock,
  DoorOpen,
  FilePlus,
  FileText,
  Sparkles,
  Upload,
  UserRound,
  Users,
  X,
} from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tilesData } from '../../../utilities/mockdata';
import type { Tiles } from '../../../utilities/types';

// Map icon name strings → Lucide components
const ICON_MAP: Record<string, React.ComponentType<{ size: number; color: string; strokeWidth?: number }>> = {
  CalendarOff,
  ClipboardCheck,
  CalendarDays,
  Users,
  FileText,
  BookOpen,
  BookMarked,
  UserRound,
  CalendarCheck,
  BarChart3,
  FilePlus,
  Upload,
  ChartColumn,
  Calendar,
  CalendarCog,
  Clock,
  DoorOpen,
  Bot,
  Sparkles,
};

// Pastel backgrounds for icon containers, cycling by category
const CATEGORY_COLORS: Record<string, { bg: string; icon: string }> = {
  administration: { bg: '#FFF3E0', icon: '#F28C28' },
  academics: { bg: '#E8F5E9', icon: '#2E8B3C' },
  students: { bg: '#EDE9FE', icon: '#6C4DFF' },
  examination: { bg: '#FEF3C7', icon: '#B45309' },
  timetable: { bg: '#E3F2FD', icon: '#3B82F6' },
  'ai assistant': { bg: '#EDE9FE', icon: '#6C4DFF' },
};

interface CategoryGroup {
  category: string;
  items: Tiles[];
}

export default function More() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { onScroll, scrollEventThrottle } = useTabBarScroll();

  const groupedTiles = useMemo(() => {
    return tilesData.reduce<CategoryGroup[]>((acc, item) => {
      const existing = acc.find((group) => group.category.toLowerCase() === item.category.toLowerCase());
      if (existing) {
        existing.items.push(item);
      } else {
        acc.push({ category: item.category, items: [item] });
      }
      return acc;
    }, []);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9ea" />

      {/* Header */}
      <View
        style={[
          styles.topHeader,
          {
            paddingTop: insets.top + 8,
            paddingRight: insets.right + 16,
            paddingLeft: insets.left + 16,
          },
        ]}
      >
        <Text style={styles.headerTitle}>More</Text>
        <Pressable
          onPress={() => router.navigate('/(app)/(tabs)/tabs.Dashboard')}
          style={({ pressed }) => [styles.closeButton, pressed && { opacity: 0.7, transform: [{ scale: 0.92 }] }]}
          hitSlop={10}
          accessibilityLabel="Close"
          accessibilityRole="button"
        >
          <X size={18} color="#172033" strokeWidth={2.2} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingLeft: insets.left + 16,
            paddingRight: insets.right + 16,
            paddingBottom: insets.bottom + 100,
          },
        ]}
      >
        {/* Featured Campus AI Chat Bot Banner */}
        <Pressable
          onPress={() => router.push('/(Tiles)/AIChatBot')}
          style={({ pressed }) => [styles.aiBanner, pressed && { opacity: 0.88, transform: [{ scale: 0.985 }] }]}
          accessibilityRole="button"
          accessibilityLabel="Open AI Chat Bot"
        >
          <View style={styles.aiBannerHeader}>
            <View style={styles.aiBadgeRow}>
              <View style={styles.aiIconBubble}>
                <Bot size={22} color="#6C4DFF" strokeWidth={2.2} />
              </View>
              <View style={styles.aiTitleCol}>
                <View style={styles.aiTagRow}>
                  <Text style={styles.aiBannerTitle}>Campus AI Chat Bot</Text>
                  <View style={styles.aiNewPill}>
                    <Sparkles size={10} color="#6C4DFF" />
                    <Text style={styles.aiNewPillText}>NEW AI</Text>
                  </View>
                </View>
                <Text style={styles.aiBannerSubtitle}>Instant intelligence on students, marks, feedback & activities</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#687080" />
          </View>

          <View style={styles.aiDemoChip}>
            <Text style={styles.aiDemoChipLabel}>Try Demo:</Text>
            <Text style={styles.aiDemoChipText} numberOfLines={1}>
              "tell me about sourav class 6 A roll no 13"
            </Text>
          </View>
        </Pressable>

        {groupedTiles.map((group) => {
          const categoryKey = group.category.toLowerCase();
          const categoryLabel = categoryKey === 'students' ? 'Students' : group.category.charAt(0).toUpperCase() + group.category.slice(1);
          const colors = CATEGORY_COLORS[categoryKey] ?? { bg: '#F3F4F6', icon: '#687080' };

          return (
            <View key={group.category} style={styles.section}>
              {/* Section header: label + underline */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{categoryLabel}</Text>
                <View style={styles.sectionUnderline} />
              </View>

              {/* Tile grid */}
              <View style={styles.tileGrid}>
                {group.items.map((item, index) => {
                  const IconComponent = ICON_MAP[item.icon];
                  return (
                    <Pressable
                      key={`${item.title}-${index}`}
                      onPress={() => {
                        if (item.path) {
                          router.push(item.path);
                        }
                      }}
                      style={({ pressed }) => [styles.tile, pressed && { opacity: 0.82, transform: [{ scale: 0.95 }] }]}
                      accessibilityRole="button"
                      accessibilityLabel={item.title}
                    >
                      <View style={[styles.tileIconBox, { backgroundColor: colors.bg }]}>
                        {IconComponent ? <IconComponent size={20} color={colors.icon} strokeWidth={1.8} /> : null}
                        {item.badge ? (
                          <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.badge}</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text style={styles.tileLabel} numberOfLines={2}>
                        {item.title}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF5',
  },

  /* Header */
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    backgroundColor: '#f9f9ea',
    // borderBottomWidth: 1,
    // borderBottomColor: '#EDECDF',
  },
  headerTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 20,
    color: '#172033',
    letterSpacing: -0.3,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DDD8C8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },

  /* Scroll */
  scrollContent: {
    paddingTop: 12,
  },

  /* Section */
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 13,
    color: '#687080',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  sectionUnderline: {
    height: 1,
    backgroundColor: '#E5E0D0',
  },

  /* Tile grid: 4-col via 25% width */
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tile: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  tileIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    position: 'relative',
  },
  tileLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#172033',
    textAlign: 'center',
    lineHeight: 15,
  },

  /* Badge */
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FAFAF5',
  },
  badgeText: {
    fontSize: 9,
    fontFamily: 'Roboto_700Bold',
    color: '#FFFFFF',
    lineHeight: 12,
  },

  /* AI Assistant Banner */
  aiBanner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#E0DBFF',
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  aiBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  aiIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  aiTitleCol: {
    flex: 1,
  },
  aiTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  aiBannerTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 15,
    color: '#172033',
  },
  aiNewPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 3,
  },
  aiNewPillText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 9,
    color: '#6C4DFF',
    letterSpacing: 0.5,
  },
  aiBannerSubtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#687080',
    marginTop: 2,
    lineHeight: 15,
  },
  aiDemoChip: {
    marginTop: 10,
    backgroundColor: '#F8F6FF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EDE9FE',
  },
  aiDemoChipLabel: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 11,
    color: '#6C4DFF',
    marginRight: 5,
  },
  aiDemoChipText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#4B5563',
    flex: 1,
    fontStyle: 'italic',
  },
});
