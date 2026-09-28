import { useRouter } from 'expo-router';
import { Award, Calendar, ChevronLeft, ClipboardList, FileBarChart2, FileEdit, Filter, Megaphone, MessageCircle } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, SectionList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type NotificationType = 'assignment' | 'message' | 'announcement' | 'event' | 'exam' | 'grade' | 'report';

type NotificationItem = {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: NotificationType;
  unread: boolean;
};

type NotificationSection = {
  title: string;
  data: NotificationItem[];
};

const notificationsData: NotificationSection[] = [
  {
    title: 'Today',
    data: [
      { id: '1', title: 'Assignment Reminder', desc: 'Mathematics Worksheet is due tomorrow', time: '10:30 AM', type: 'assignment', unread: true },
      { id: '2', title: 'New Message', desc: 'You have a new message from Mr. Carter', time: '09:15 AM', type: 'message', unread: true },
      { id: '3', title: 'School Announcement', desc: 'Annual Science Fair will be held on July 18, 2026', time: '08:00 AM', type: 'announcement', unread: true },
      { id: '4', title: 'Event Reminder', desc: 'Parent-Teacher Meeting starts in 30 minutes', time: '07:30 AM', type: 'event', unread: true },
    ],
  },
  {
    title: 'Yesterday',
    data: [{ id: '5', title: 'Exam Alert', desc: 'Physics Unit Test will be July 25, 2026', time: 'Yesterday', type: 'exam', unread: false }],
  },
  {
    title: 'June 30, 2026',
    data: [
      { id: '6', title: 'Grade Update', desc: 'Your Quiz has been updated', time: 'May 16, 2026', type: 'grade', unread: false },
      { id: '7', title: 'Report Available', desc: 'Report Card is now available', time: 'May 16, 2026', type: 'report', unread: false },
    ],
  },
];

const tabs = ['All', 'Unread(4)', 'Assignments', 'Events'];

const typeConfig: Record<NotificationType, { icon: any; bg: string; color: string }> = {
  assignment: { icon: ClipboardList, bg: '#e0f2fe', color: '#0284c7' },
  message: { icon: MessageCircle, bg: '#dcfce7', color: '#16a34a' },
  announcement: { icon: Megaphone, bg: '#ffedd5', color: '#ea580c' },
  event: { icon: Calendar, bg: '#f3e8ff', color: '#9333ea' },
  exam: { icon: FileEdit, bg: '#ffe4e6', color: '#e11d48' },
  grade: { icon: Award, bg: '#d1fae5', color: '#059669' },
  report: { icon: FileBarChart2, bg: '#e0e7ff', color: '#4f46e5' },
};

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('All');

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const config = typeConfig[item.type];
    const IconComponent = config.icon;

    return (
      <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.8 }]}>
        <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
          <IconComponent size={20} color={config.color} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDesc} numberOfLines={1}>
            {item.desc}
          </Text>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.cardTime}>{item.time}</Text>
          {item.unread && <View style={styles.unreadDot} />}
        </View>
      </Pressable>
    );
  };

  const renderSectionHeader = ({ section: { title } }: { section: NotificationSection }) => <Text style={styles.sectionHeader}>{title}</Text>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Background Gradient
      <LinearGradient
        colors={['#e4d4f4', '#f5f0fb', '#faf9fc']}
        style={[StyleSheet.absoluteFillObject, { height: 350 }]}
      /> */}

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.circularButton, pressed && { opacity: 0.7 }]}>
            <ChevronLeft size={24} color="#333" />
          </Pressable>
          <Text style={styles.headerTitle}>Notification</Text>
          <Pressable style={({ pressed }) => [styles.circularButton, pressed && { opacity: 0.7 }]}>
            <Filter size={20} color="#333" />
          </Pressable>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsWrapper}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <Pressable key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, isActive && styles.activeTab]}>
                  <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Notifications List */}
        <SectionList
          sections={notificationsData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf9fc',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  circularButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#111',
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 24,
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#888',
  },
  activeTabText: {
    fontFamily: 'Roboto_700Bold',
    color: '#111',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#222',
    marginTop: 10,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: '#222',
    marginBottom: 4,
  },
  cardDesc: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#777',
  },
  cardRight: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    height: 44,
  },
  cardTime: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#888',
    marginBottom: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9333ea',
  },
});
