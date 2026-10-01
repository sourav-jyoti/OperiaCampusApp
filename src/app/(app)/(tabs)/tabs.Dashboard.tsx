import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Bell,
  Search,
  CalendarOff,
  ClipboardCheck,
  CalendarDays,
  Users,
  FileText,
  BookOpen,
  BookMarked,
  UserRound,
  Calculator,
  FlaskConical,
  BookA,
  Globe2,
  ChevronRight,
} from 'lucide-react-native';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';

import { useTabBarScroll } from '@/hooks/useTabBarScroll';
import { DashboardStyles } from '../../../styles/styles';
import BannerCard from '@/components/component.AlertCard';
import { bannerNotice } from '../../../utilities/mockdata';

const styles = DashboardStyles;

// ─── Static data (VI-B context) ─────────────────────────────────────────────

const profile = {
  name: 'Sourav',
  class: 'Class VI',
  section: 'Section B',
};

const quickActions = [
  { title: 'Leave',           icon: CalendarOff,   color: '#E8F5E9', iconColor: '#388E3C', path: '/(Tiles)/LeaveRequest' },
  { title: 'Duties',          icon: ClipboardCheck, color: '#FFF3E0', iconColor: '#E65100', path: '' },
  { title: 'Events',          icon: CalendarDays,   color: '#FCE4EC', iconColor: '#C2185B', path: '' },
  { title: 'Meetings',        icon: Users,          color: '#F3E5F5', iconColor: '#7B1FA2', path: '' },
  { title: 'Assignments',     icon: FileText,       color: '#E3F2FD', iconColor: '#1565C0', path: '/(Tiles)/Assignments' },
  { title: 'Subjects',        icon: BookOpen,       color: '#FFF8E1', iconColor: '#F9A825', path: '' },
  { title: 'Study Material',  icon: BookMarked,     color: '#E0F2F1', iconColor: '#00695C', path: '' },
  { title: 'Student Profile', icon: UserRound,      color: '#E8EAF6', iconColor: '#283593', path: '' },
] as const;

const timetableMock = [
  { period: '1', time: '09:00 – 09:45', subject: 'Mathematics',    teacher: 'Mr. Sharma', room: 'Room 204', SubjectIcon: Calculator,  color: '#FFF3E0', iconColor: '#E65100' },
  { period: '2', time: '09:45 – 10:30', subject: 'Science',        teacher: 'Mrs. Gupta', room: 'Lab 2',    SubjectIcon: FlaskConical, color: '#E8F5E9', iconColor: '#388E3C' },
  { period: '3', time: '10:45 – 11:30', subject: 'English',        teacher: 'Ms. Verma',  room: 'Room 105', SubjectIcon: BookA,        color: '#E3F2FD', iconColor: '#1565C0' },
  { period: '4', time: '11:30 – 12:15', subject: 'Social Science', teacher: 'Mr. Khan',   room: 'Room 203', SubjectIcon: Globe2,       color: '#F3E5F5', iconColor: '#7B1FA2' },
];

const upcomingMock = [
  { title: 'Science Assignment', subtitle: 'Chapter 4 – Living Organisms', time: 'Due tomorrow',     type: 'urgent',   ItemIcon: FileText,    color: '#FCE4EC', iconColor: '#C2185B' },
  { title: 'Mathematics Test',   subtitle: 'Unit 2',                        time: '14 June • 10 AM', type: 'upcoming', ItemIcon: CalendarDays, color: '#E3F2FD', iconColor: '#1565C0' },
  { title: 'School Announcement',subtitle: 'Annual Day Practice',           time: '',                type: 'info',     ItemIcon: Bell,        color: '#E8F5E9', iconColor: '#388E3C' },
  { title: 'Inter-House Sports', subtitle: 'Starts 18 June',               time: '',                type: 'event',    ItemIcon: Users,       color: '#F3E5F5', iconColor: '#7B1FA2' },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Dashboard() {
  const insets  = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { onScroll, scrollEventThrottle } = useTabBarScroll();
  const router  = useRouter();

  // Carousel layout
  const CARD_WIDTH   = Math.round(width * 0.85);
  const CARD_GAP     = 12;
  const CARD_SPACING = Math.round((width - CARD_WIDTH) / 2);
  const snapOffsets  = bannerNotice.map((_, i) => i * (CARD_WIDTH + CARD_GAP));

  const [activeSlide, setActiveSlide] = useState(0);

  const onCarouselScroll = (event: any) => {
    const x     = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / (CARD_WIDTH + CARD_GAP));
    setActiveSlide(Math.max(0, Math.min(index, bannerNotice.length - 1)));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
      >
        {/* ── HEADER ── */}
        <LinearGradient
          colors={['#FFF5CC', '#FFFBEE', '#F8FAFC']}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View
            style={[
              styles.header,
              { paddingTop: insets.top + 16, paddingHorizontal: 20, paddingBottom: 20 },
            ]}
          >
            <View style={styles.profileSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>👦🏻</Text>
              </View>
              <View>
                <Text style={styles.greeting}>Good morning,</Text>
                <Text style={styles.name}>{profile.name} 👋</Text>
                <Text style={styles.classSection}>
                  {profile.class} • {profile.section}
                </Text>
              </View>
            </View>

            <View style={styles.headerActions}>
              <Pressable
                style={styles.iconButton}
                accessibilityLabel="Search"
                accessibilityRole="button"
              >
                <Search size={19} color="#172033" strokeWidth={2} />
              </Pressable>
              <Pressable
                style={styles.iconButton}
                onPress={() => router.push('/(Tiles)/Notifications')}
                accessibilityLabel="Notifications"
                accessibilityRole="button"
              >
                <Bell size={19} color="#172033" strokeWidth={2} />
                <View style={styles.notificationDot} />
              </Pressable>
            </View>
          </View>
        </LinearGradient>

        {/* ── BODY ── */}
        <View>

          {/* ── ALERT CAROUSEL ── */}
          <View style={{ marginTop: 20 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled
              decelerationRate="fast"
              snapToInterval={CARD_WIDTH + CARD_GAP}
              snapToOffsets={snapOffsets}
              disableIntervalMomentum
              scrollEventThrottle={16}
              onScroll={onCarouselScroll}
              contentContainerStyle={{
                paddingHorizontal: CARD_SPACING,
                gap: CARD_GAP,
                paddingBottom: 8,
              }}
            >
              {bannerNotice.map((item, index) => (
                <BannerCard
                  key={`banner-${index}`}
                  item={item}
                  cardWidth={CARD_WIDTH}
                />
              ))}
            </ScrollView>

            {/* Pagination dots */}
            <View style={styles.paginationContainer}>
              {bannerNotice.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    activeSlide === index && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* ── TODAY'S CLASSES ── */}
          <View style={[styles.sectionHeader, { marginTop: 8 }]}>
            <Text style={styles.sectionTitle}>Today's Classes</Text>
            <View style={styles.sectionHeaderRight}>
              <Text style={styles.sectionSubtitle}>Thu, 11 Jun</Text>
              <Pressable
                style={styles.seeAllButton}
                accessibilityLabel="See all classes"
                accessibilityRole="button"
              >
                <Text style={styles.seeAllText}>See all</Text>
                <ArrowRight size={13} color="#F2A51A" strokeWidth={2.5} />
              </Pressable>
            </View>
          </View>

          <View style={styles.timetableContainer}>
            {timetableMock.map((item) => (
              <Pressable
                key={item.period}
                style={({ pressed }) => [
                  styles.timetableCard,
                  pressed && styles.pressedCard,
                ]}
                accessibilityLabel={`Period ${item.period}: ${item.subject} with ${item.teacher} in ${item.room}`}
                accessibilityRole="button"
              >
                {/* Period number badge */}
                <View style={[styles.periodNumberContainer, { backgroundColor: item.color }]}>
                  <Text style={[styles.periodNumber, { color: item.iconColor }]}>
                    {item.period}
                  </Text>
                </View>

                {/* Time */}
                <View style={styles.timetableTimeContainer}>
                  <Text style={styles.timetableTime}>{item.time}</Text>
                </View>

                {/* Subject icon */}
                <View style={[styles.timetableIconContainer, { backgroundColor: item.color }]}>
                  <item.SubjectIcon size={18} color={item.iconColor} strokeWidth={2} />
                </View>

                {/* Subject + teacher/room */}
                <View style={styles.timetableInfo}>
                  <Text style={styles.timetableSubject} numberOfLines={1}>
                    {item.subject}
                  </Text>
                  <Text style={styles.timetableTeacher} numberOfLines={1}>
                    {item.teacher} · {item.room}
                  </Text>
                </View>

                <ChevronRight size={16} color="#C0C8D4" strokeWidth={2.5} />
              </Pressable>
            ))}
          </View>

          {/* ── QUICK ACTIONS ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <Pressable
              style={styles.seeAllButton}
              onPress={() => router.navigate('/(app)/(tabs)/tabs.More')}
              accessibilityLabel="View all actions"
              accessibilityRole="button"
            >
              <Text style={styles.seeAllText}>View all</Text>
              <ArrowRight size={13} color="#F2A51A" strokeWidth={2.5} />
            </Pressable>
          </View>

          <View style={styles.quickActionContainer}>
            {quickActions.map((item) => (
              <Pressable
                key={item.title}
                onPress={() => (item.path ? router.push(item.path as any) : undefined)}
                style={({ pressed }) => [
                  styles.quickActionItem,
                  pressed && styles.pressedCard,
                ]}
                accessibilityLabel={item.title}
                accessibilityRole="button"
              >
                <View style={[styles.quickActionIcon, { backgroundColor: item.color }]}>
                  <item.icon size={24} color={item.iconColor} strokeWidth={1.8} />
                </View>
                <Text style={styles.quickActionText} numberOfLines={2}>
                  {item.title}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* ── UPCOMING ── */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            <Pressable
              style={styles.seeAllButton}
              accessibilityLabel="See all upcoming"
              accessibilityRole="button"
            >
              <Text style={styles.seeAllText}>See all</Text>
              <ArrowRight size={13} color="#F2A51A" strokeWidth={2.5} />
            </Pressable>
          </View>

          <View style={styles.upcomingGrid}>
            {upcomingMock.map((item) => (
              <Pressable
                key={item.title}
                style={({ pressed }) => [
                  styles.upcomingCard,
                  pressed && styles.pressedCard,
                ]}
                accessibilityLabel={`${item.title}: ${item.subtitle}${item.time ? `, ${item.time}` : ''}`}
                accessibilityRole="button"
              >
                <View style={[styles.upcomingIconContainer, { backgroundColor: item.color }]}>
                  <item.ItemIcon size={20} color={item.iconColor} strokeWidth={1.8} />
                </View>
                <Text style={styles.upcomingTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.upcomingSubtitle} numberOfLines={2}>
                  {item.subtitle}
                </Text>
                {item.time ? (
                  <Text
                    style={[
                      styles.upcomingTime,
                      item.type === 'urgent' && { color: '#D32F2F' },
                    ]}
                    numberOfLines={1}
                  >
                    {item.time}
                  </Text>
                ) : null}
              </Pressable>
            ))}
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

