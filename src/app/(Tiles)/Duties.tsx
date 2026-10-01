import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  MapPin,
  ShieldCheck,
  UserCheck,
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

type Duty = {
  id: string;
  title: string;
  category: 'Security' | 'Discipline' | 'Examination' | 'Transport';
  location: string;
  timeSlot: string;
  date: string;
  partner?: string;
  instructions: string;
  status: 'pending' | 'in_progress' | 'completed';
};

const initialDuties: Duty[] = [
  {
    id: 'd1',
    title: 'Morning Assembly Gate Duty',
    category: 'Security',
    location: 'Main Gate 1',
    timeSlot: '07:30 AM – 08:15 AM',
    date: 'Today, 11 Jun',
    partner: 'Mr. Arvind Sharma',
    instructions: 'Monitor student uniform compliance and ensure smooth entry traffic.',
    status: 'pending',
  },
  {
    id: 'd2',
    title: 'Recess Corridor Discipline',
    category: 'Discipline',
    location: 'Block B, 2nd Floor Corridor',
    timeSlot: '11:30 AM – 12:00 PM',
    date: 'Today, 11 Jun',
    partner: 'Mrs. Sunita Verma',
    instructions: 'Ensure orderly student movement during recess and prevent hallway running.',
    status: 'pending',
  },
  {
    id: 'd3',
    title: 'Mathematics Unit Test Invigilation',
    category: 'Examination',
    location: 'Exam Hall 3 (Room 204)',
    timeSlot: '01:00 PM – 02:30 PM',
    date: 'Today, 11 Jun',
    partner: 'Ms. Priya Sen',
    instructions: 'Collect answer sheets promptly at 02:30 PM and hand over to Examination Cell.',
    status: 'pending',
  },
  {
    id: 'd4',
    title: 'Afternoon Bus Dispersal Escort',
    category: 'Transport',
    location: 'Bus Bay 4 (Route 12)',
    timeSlot: '03:15 PM – 04:00 PM',
    date: 'Tomorrow, 12 Jun',
    instructions: 'Verify student boarding roll calls before buses depart the school campus.',
    status: 'pending',
  },
  {
    id: 'd5',
    title: 'Sports Day Ground Preparation',
    category: 'Discipline',
    location: 'East Playground',
    timeSlot: '08:00 AM – 10:00 AM',
    date: '08 Jun 2026',
    instructions: 'Checked track markers and barricades for annual junior athletics.',
    status: 'completed',
  },
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  Security: { bg: '#FEF3C7', text: '#B45309' },
  Discipline: { bg: '#FEE2E2', text: '#DC2626' },
  Examination: { bg: '#EDE9FE', text: '#6C4DFF' },
  Transport: { bg: '#E0F2FE', text: '#0284C7' },
};

export default function DutiesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [duties, setDuties] = useState<Duty[]>(initialDuties);
  const [activeTab, setActiveTab] = useState<'All' | 'Active' | 'Completed'>('All');

  const pendingCount = duties.filter((d) => d.status !== 'completed').length;
  const completedCount = duties.filter((d) => d.status === 'completed').length;

  const filteredDuties = useMemo(() => {
    if (activeTab === 'Active') return duties.filter((d) => d.status !== 'completed');
    if (activeTab === 'Completed') return duties.filter((d) => d.status === 'completed');
    return duties;
  }, [duties, activeTab]);

  const handleToggleStatus = (id: string, currentStatus: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

    setDuties((prev) =>
      prev.map((duty) => (duty.id === id ? { ...duty, status: newStatus } : duty))
    );

    if (newStatus === 'completed') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Duty Completed', 'Duty marked as fulfilled. Report logged with Administration.');
    }
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
        <Text style={styles.navTitle}>Assigned Duties</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Metric Badges */}
        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, { backgroundColor: '#FFF3E0' }]}>
            <Text style={[styles.metricNumber, { color: '#E65100' }]}>{pendingCount}</Text>
            <Text style={styles.metricLabel}>Pending</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: '#E8F5E9' }]}>
            <Text style={[styles.metricNumber, { color: '#15803D' }]}>{completedCount}</Text>
            <Text style={styles.metricLabel}>Completed</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: '#EDE9FE' }]}>
            <Text style={[styles.metricNumber, { color: '#6C4DFF' }]}>{duties.length}</Text>
            <Text style={styles.metricLabel}>Total Roster</Text>
          </View>
        </View>

        {/* Tab Filters */}
        <View style={styles.tabContainer}>
          {(['All', 'Active', 'Completed'] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => {
                Haptics.selectionAsync();
                setActiveTab(tab);
              }}
              style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
            >
              <Text style={[styles.tabButtonText, activeTab === tab && styles.tabButtonTextActive]}>
                {tab} {tab === 'Active' ? `(${pendingCount})` : tab === 'Completed' ? `(${completedCount})` : ''}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Section title */}
        <View style={styles.componentHeader}>
          <Text style={styles.componentText}>Duty Schedule</Text>
          <View style={styles.headerLine} />
        </View>

        {/* Duty Cards */}
        {filteredDuties.map((duty) => {
          const isDone = duty.status === 'completed';
          const catColors = categoryColors[duty.category] ?? { bg: '#F3F4F6', text: '#4B5563' };

          return (
            <View key={duty.id} style={[styles.card, isDone && styles.cardCompleted]}>
              <View style={styles.cardHeader}>
                <View style={[styles.categoryBadge, { backgroundColor: catColors.bg }]}>
                  <Text style={[styles.categoryText, { color: catColors.text }]}>{duty.category}</Text>
                </View>
                <View style={styles.dateTag}>
                  <Calendar size={13} color="#666" />
                  <Text style={styles.dateTagText}>{duty.date}</Text>
                </View>
              </View>

              <Text style={[styles.dutyTitle, isDone && styles.textCompleted]}>{duty.title}</Text>

              <View style={styles.detailsBlock}>
                <View style={styles.detailRow}>
                  <Clock size={14} color="#8b4a0dff" />
                  <Text style={styles.detailText}>{duty.timeSlot}</Text>
                </View>

                <View style={styles.detailRow}>
                  <MapPin size={14} color="#8b4a0dff" />
                  <Text style={styles.detailText}>{duty.location}</Text>
                </View>

                {duty.partner ? (
                  <View style={styles.detailRow}>
                    <Users size={14} color="#6C4DFF" />
                    <Text style={styles.detailText}>Co-duty: {duty.partner}</Text>
                  </View>
                ) : null}
              </View>

              <Text style={styles.instructionsText}>{duty.instructions}</Text>

              {/* Action */}
              <View style={styles.actionRow}>
                <Pressable
                  onPress={() => handleToggleStatus(duty.id, duty.status)}
                  style={({ pressed }) => [
                    styles.checkButton,
                    isDone ? styles.checkButtonDone : styles.checkButtonPending,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <CheckCircle2 size={16} color={isDone ? '#15803D' : '#ffffff'} />
                  <Text style={[styles.checkButtonText, isDone && { color: '#15803D' }]}>
                    {isDone ? 'Mark as Incomplete' : 'Mark Completed'}
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

  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  metricCard: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e0d0',
  },
  metricNumber: { fontFamily: 'Roboto_700Bold', fontSize: 22, fontWeight: '700' },
  metricLabel: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#666', marginTop: 2 },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#EBE7D8',
    borderRadius: 9,
    padding: 3,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 7,
  },
  tabButtonActive: {
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  tabButtonText: { fontFamily: 'Roboto_400Regular', fontSize: 13, color: '#666' },
  tabButtonTextActive: { fontFamily: 'Roboto_700Bold', color: '#1b005a', fontWeight: '700' },

  componentHeader: { paddingLeft: '1%', marginBottom: 10, marginTop: 4 },
  componentText: { fontFamily: 'Roboto_300Light', fontSize: 18, color: '#222' },
  headerLine: { borderWidth: 1, width: 36, marginTop: 3, borderColor: '#0b2178ff', backgroundColor: '#0b2178ff' },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    padding: 14,
    marginBottom: 12,
  },
  cardCompleted: {
    backgroundColor: '#FAFAF7',
    borderColor: '#D4CEB8',
    opacity: 0.88,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dateTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateTagText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#666',
  },
  dutyTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 15,
    color: '#100707ff',
    fontWeight: '700',
    marginBottom: 10,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  detailsBlock: {
    backgroundColor: '#fafaf5',
    borderRadius: 8,
    padding: 10,
    gap: 6,
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#333',
  },
  instructionsText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#666',
    lineHeight: 17,
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0ece0',
    paddingTop: 10,
  },
  checkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  checkButtonPending: {
    backgroundColor: '#1b005a',
  },
  checkButtonDone: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
  },
  checkButtonText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
  },
});
