import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  Bookmark,
  Calendar,
  Clock,
  Heart,
  MapPin,
  Share2,
  Sparkles,
  Users,
} from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type SchoolEvent = {
  id: string;
  title: string;
  category: 'Academic' | 'Cultural' | 'Sports' | 'Celebration';
  day: string;
  month: string;
  time: string;
  venue: string;
  targetAudience: string;
  description: string;
  coordinator: string;
  rsvpCount: number;
  isRegistered: boolean;
};

const initialEvents: SchoolEvent[] = [
  {
    id: 'e1',
    title: 'Inter-School Science & Innovation Expo 2026',
    category: 'Academic',
    day: '18',
    month: 'JUN',
    time: '09:30 AM – 03:00 PM',
    venue: 'Main Auditorium & Exhibition Hall',
    targetAudience: 'Classes VI – XII',
    description: 'Students exhibit robotics, environmental science projects, and software prototypes for regional judging.',
    coordinator: 'Dr. M. K. Nair',
    rsvpCount: 142,
    isRegistered: true,
  },
  {
    id: 'e2',
    title: 'Monsoon Classical Music & Dance Festival',
    category: 'Cultural',
    day: '24',
    month: 'JUN',
    time: '11:00 AM – 01:30 PM',
    venue: 'Open Air Theatre (OAT)',
    targetAudience: 'All Classes',
    description: 'A vibrant showcase of student Indian classical dance, vocal choir, and orchestral performances.',
    coordinator: 'Ms. Sharmila Roy',
    rsvpCount: 88,
    isRegistered: false,
  },
  {
    id: 'e3',
    title: 'Annual Inter-House Football Championship',
    category: 'Sports',
    day: '02',
    month: 'JUL',
    time: '08:00 AM – 12:30 PM',
    venue: 'Sports Ground A',
    targetAudience: 'Classes V – X',
    description: 'Quarter-finals and semi-finals between Red, Blue, Green, and Gold houses.',
    coordinator: 'Coach Devendra Singh',
    rsvpCount: 215,
    isRegistered: false,
  },
  {
    id: 'e4',
    title: 'International Yoga Day Celebration',
    category: 'Celebration',
    day: '21',
    month: 'JUN',
    time: '07:00 AM – 08:30 AM',
    venue: 'School Courtyard',
    targetAudience: 'Students & Staff',
    description: 'Mass morning yoga session, guided pranayama, and healthy lifestyle address.',
    coordinator: 'Yoga Master Prakash',
    rsvpCount: 310,
    isRegistered: false,
  },
];

const categoryPillColors: Record<string, { bg: string; text: string }> = {
  Academic: { bg: '#E3F2FD', text: '#1565C0' },
  Cultural: { bg: '#FCE4EC', text: '#C2185B' },
  Sports: { bg: '#E8F5E9', text: '#2E7D32' },
  Celebration: { bg: '#FEF3C7', text: '#B45309' },
};

export default function EventsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [events, setEvents] = useState<SchoolEvent[]>(initialEvents);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Academic', 'Cultural', 'Sports', 'Celebration'];

  const filteredEvents = useMemo(() => {
    if (selectedCategory === 'All') return events;
    return events.filter((e) => e.category === selectedCategory);
  }, [events, selectedCategory]);

  const toggleRsvp = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === id) {
          const nextState = !ev.isRegistered;
          const nextCount = nextState ? ev.rsvpCount + 1 : ev.rsvpCount - 1;
          if (nextState) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('RSVP Confirmed', `You have registered for "${ev.title}". Reminder added!`);
          }
          return { ...ev, isRegistered: nextState, rsvpCount: nextCount };
        }
        return ev;
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f7f1ff" />

      {/* Header */}
      <View style={styles.topHeader}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ArrowLeft size={20} color="#222" />
        </Pressable>
        <Text style={styles.navTitle}>Campus Events</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Featured Banner */}
        <View style={styles.featuredBanner}>
          <View style={styles.featuredBadge}>
            <Sparkles size={13} color="#C2185B" />
            <Text style={styles.featuredBadgeText}>SPOTLIGHT EVENT</Text>
          </View>
          <Text style={styles.featuredTitle}>Inter-School Science & Innovation Expo 2026</Text>
          <Text style={styles.featuredSubtitle}>
            Keynote speeches, live robotics demos, and student innovation showcase.
          </Text>
          <View style={styles.featuredMetaRow}>
            <View style={styles.metaChip}>
              <Calendar size={13} color="#C2185B" />
              <Text style={styles.metaChipText}>Thu, 18 Jun 2026</Text>
            </View>
            <View style={styles.metaChip}>
              <MapPin size={13} color="#C2185B" />
              <Text style={styles.metaChipText}>Main Auditorium</Text>
            </View>
          </View>
        </View>

        {/* Filter Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedCategory(cat);
                }}
                style={[styles.categoryFilterChip, isActive && styles.categoryFilterChipActive]}
              >
                <Text style={[styles.categoryFilterText, isActive && styles.categoryFilterTextActive]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Section title */}
        <View style={styles.componentHeader}>
          <Text style={styles.componentText}>Upcoming Schedule</Text>
          <View style={styles.headerLine} />
        </View>

        {/* Events List */}
        {filteredEvents.map((item) => {
          const pill = categoryPillColors[item.category] ?? { bg: '#F3F4F6', text: '#333' };

          return (
            <View key={item.id} style={styles.eventCard}>
              <View style={styles.eventTopRow}>
                {/* Date Box */}
                <View style={styles.dateBox}>
                  <Text style={styles.dateMonth}>{item.month}</Text>
                  <Text style={styles.dateDay}>{item.day}</Text>
                </View>

                {/* Title & Category */}
                <View style={styles.eventHeaderInfo}>
                  <View style={[styles.categoryPill, { backgroundColor: pill.bg }]}>
                    <Text style={[styles.categoryPillText, { color: pill.text }]}>{item.category}</Text>
                  </View>
                  <Text style={styles.eventTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                </View>
              </View>

              <Text style={styles.eventDesc}>{item.description}</Text>

              {/* Meta information */}
              <View style={styles.metaGrid}>
                <View style={styles.metaItem}>
                  <Clock size={14} color="#8b4a0dff" />
                  <Text style={styles.metaItemText}>{item.time}</Text>
                </View>
                <View style={styles.metaItem}>
                  <MapPin size={14} color="#8b4a0dff" />
                  <Text style={styles.metaItemText}>{item.venue}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Users size={14} color="#6C4DFF" />
                  <Text style={styles.metaItemText}>Audience: {item.targetAudience}</Text>
                </View>
              </View>

              {/* Card Footer */}
              <View style={styles.cardFooter}>
                <Text style={styles.rsvpStats}>
                  {item.rsvpCount} students registered
                </Text>

                <Pressable
                  onPress={() => toggleRsvp(item.id)}
                  style={({ pressed }) => [
                    styles.rsvpBtn,
                    item.isRegistered ? styles.rsvpBtnActive : styles.rsvpBtnOutline,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={[styles.rsvpBtnText, item.isRegistered && styles.rsvpBtnTextActive]}>
                    {item.isRegistered ? 'Registered ✓' : 'Register / RSVP'}
                  </Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7f7f1ff' },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f7f7f1ff',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dcd8c8',
  },
  navTitle: { fontFamily: 'Roboto_700Bold', fontSize: 17, color: '#100707ff', fontWeight: '700' },
  scrollContent: { paddingHorizontal: 14, paddingTop: 10 },

  featuredBanner: {
    backgroundColor: '#FCE4EC',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F8BBD0',
    marginBottom: 16,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  featuredBadgeText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 10,
    color: '#C2185B',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  featuredTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#100707ff',
    fontWeight: '700',
    marginBottom: 6,
  },
  featuredSubtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#666',
    lineHeight: 17,
    marginBottom: 10,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metaChipText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#444',
  },

  categoryScroll: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  categoryFilterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dcd8c8',
  },
  categoryFilterChipActive: {
    backgroundColor: '#1b005a',
    borderColor: '#1b005a',
  },
  categoryFilterText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#555',
  },
  categoryFilterTextActive: {
    fontFamily: 'Roboto_700Bold',
    color: '#ffffff',
    fontWeight: '700',
  },

  componentHeader: { paddingLeft: '1%', marginBottom: 10, marginTop: 4 },
  componentText: { fontFamily: 'Roboto_300Light', fontSize: 18, color: '#222' },
  headerLine: { borderWidth: 1, width: 36, marginTop: 3, borderColor: '#0b2178ff', backgroundColor: '#0b2178ff' },

  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    padding: 14,
    marginBottom: 12,
  },
  eventTopRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  dateBox: {
    width: 48,
    height: 52,
    backgroundColor: '#feffe0ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateMonth: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 10,
    color: '#8b4a0dff',
    fontWeight: '700',
  },
  dateDay: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#100707ff',
    fontWeight: '700',
  },
  eventHeaderInfo: {
    flex: 1,
    gap: 4,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryPillText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  eventTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: '#100707ff',
    fontWeight: '700',
    lineHeight: 19,
  },
  eventDesc: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#666',
    lineHeight: 17,
    marginBottom: 10,
  },
  metaGrid: {
    backgroundColor: '#fafaf5',
    borderRadius: 8,
    padding: 10,
    gap: 6,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaItemText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#444',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0ece0',
    paddingTop: 10,
  },
  rsvpStats: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#777',
  },
  rsvpBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  rsvpBtnOutline: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#1b005a',
  },
  rsvpBtnActive: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
  },
  rsvpBtnText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#1b005a',
    fontWeight: '600',
  },
  rsvpBtnTextActive: {
    color: '#15803D',
  },
});
