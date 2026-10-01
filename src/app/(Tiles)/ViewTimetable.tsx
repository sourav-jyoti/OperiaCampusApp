import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Download,
  MapPin,
  Sparkles,
  User,
} from 'lucide-react-native';
import React, { useState } from 'react';
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

type PeriodItem = {
  period: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  isRecess?: boolean;
  isCurrent?: boolean;
  color: string;
};

const weekSchedules: Record<string, PeriodItem[]> = {
  Mon: [
    { period: '1', time: '09:00 – 09:45 AM', subject: 'Mathematics', teacher: 'Mr. Arvind Sharma', room: 'Room 204', color: '#0b2178ff' },
    { period: '2', time: '09:45 – 10:30 AM', subject: 'General Science', teacher: 'Mrs. Rekha Gupta', room: 'Science Lab 2', color: '#15803D' },
    { period: '3', time: '10:45 – 11:30 AM', subject: 'English Literature', teacher: 'Ms. Sunita Verma', room: 'Room 105', color: '#7C3AED' },
    { period: 'Break', time: '11:30 – 12:00 PM', subject: 'Recess & Healthy Snack', teacher: 'Campus Duty', room: 'Cafeteria', isRecess: true, color: '#F59E0B' },
    { period: '4', time: '12:00 – 12:45 PM', subject: 'Social Studies', teacher: 'Mr. Tariq Khan', room: 'Room 203', color: '#B45309' },
    { period: '5', time: '12:45 – 01:30 PM', subject: 'Computer Coding', teacher: 'Mr. Dev Roy', room: 'Computer Lab 1', color: '#0284C7' },
    { period: '6', time: '01:30 – 02:15 PM', subject: 'Physical Education', teacher: 'Coach Singh', room: 'East Playground', color: '#E11D48' },
  ],
  Tue: [
    { period: '1', time: '09:00 – 09:45 AM', subject: 'General Science', teacher: 'Mrs. Rekha Gupta', room: 'Science Lab 2', color: '#15803D' },
    { period: '2', time: '09:45 – 10:30 AM', subject: 'Mathematics', teacher: 'Mr. Arvind Sharma', room: 'Room 204', color: '#0b2178ff' },
    { period: '3', time: '10:45 – 11:30 AM', subject: 'Hindi / Regional Lang.', teacher: 'Mrs. Pushpa Jain', room: 'Room 204', color: '#D97706' },
    { period: 'Break', time: '11:30 – 12:00 PM', subject: 'Recess & Healthy Snack', teacher: 'Campus Duty', room: 'Cafeteria', isRecess: true, color: '#F59E0B' },
    { period: '4', time: '12:00 – 12:45 PM', subject: 'English Grammar', teacher: 'Ms. Sunita Verma', room: 'Room 105', color: '#7C3AED' },
    { period: '5', time: '12:45 – 01:30 PM', subject: 'Arts & Craft', teacher: 'Ms. Rita Sen', room: 'Art Studio', color: '#9333EA' },
    { period: '6', time: '01:30 – 02:15 PM', subject: 'Library & Reading', teacher: 'Mr. Joshi', room: 'Central Library', color: '#0D9488' },
  ],
  Wed: [
    { period: '1', time: '09:00 – 09:45 AM', subject: 'Mathematics', teacher: 'Mr. Arvind Sharma', room: 'Room 204', color: '#0b2178ff' },
    { period: '2', time: '09:45 – 10:30 AM', subject: 'Social Studies', teacher: 'Mr. Tariq Khan', room: 'Room 203', color: '#B45309' },
    { period: '3', time: '10:45 – 11:30 AM', subject: 'Science Practical', teacher: 'Mrs. Rekha Gupta', room: 'Physics Lab', color: '#15803D' },
    { period: 'Break', time: '11:30 – 12:00 PM', subject: 'Recess & Healthy Snack', teacher: 'Campus Duty', room: 'Cafeteria', isRecess: true, color: '#F59E0B' },
    { period: '4', time: '12:00 – 12:45 PM', subject: 'English Literature', teacher: 'Ms. Sunita Verma', room: 'Room 105', color: '#7C3AED' },
    { period: '5', time: '12:45 – 01:30 PM', subject: 'Vocal Music', teacher: 'Pandit Shastri', room: 'Music Room', color: '#EC4899' },
    { period: '6', time: '01:30 – 02:15 PM', subject: 'Co-curricular Club', teacher: 'Faculty Mentors', room: 'Assigned Halls', color: '#6366F1' },
  ],
  Thu: [
    { period: '1', time: '09:00 – 09:45 AM', subject: 'Mathematics', teacher: 'Mr. Arvind Sharma', room: 'Room 204', color: '#0b2178ff', isCurrent: true },
    { period: '2', time: '09:45 – 10:30 AM', subject: 'General Science', teacher: 'Mrs. Rekha Gupta', room: 'Science Lab 2', color: '#15803D' },
    { period: '3', time: '10:45 – 11:30 AM', subject: 'English Literature', teacher: 'Ms. Sunita Verma', room: 'Room 105', color: '#7C3AED' },
    { period: 'Break', time: '11:30 – 12:00 PM', subject: 'Recess & Healthy Snack', teacher: 'Campus Duty', room: 'Cafeteria', isRecess: true, color: '#F59E0B' },
    { period: '4', time: '12:00 – 12:45 PM', subject: 'Social Studies', teacher: 'Mr. Tariq Khan', room: 'Room 203', color: '#B45309' },
    { period: '5', time: '12:45 – 01:30 PM', subject: 'Computer Coding', teacher: 'Mr. Dev Roy', room: 'Computer Lab 1', color: '#0284C7' },
    { period: '6', time: '01:30 – 02:15 PM', subject: 'Games & Athletics', teacher: 'Coach Singh', room: 'East Playground', color: '#E11D48' },
  ],
  Fri: [
    { period: '1', time: '09:00 – 09:45 AM', subject: 'Hindi / Regional Lang.', teacher: 'Mrs. Pushpa Jain', room: 'Room 204', color: '#D97706' },
    { period: '2', time: '09:45 – 10:30 AM', subject: 'Mathematics Problem Solving', teacher: 'Mr. Arvind Sharma', room: 'Room 204', color: '#0b2178ff' },
    { period: '3', time: '10:45 – 11:30 AM', subject: 'Science Quiz', teacher: 'Mrs. Rekha Gupta', room: 'Science Lab 2', color: '#15803D' },
    { period: 'Break', time: '11:30 – 12:00 PM', subject: 'Recess & Healthy Snack', teacher: 'Campus Duty', room: 'Cafeteria', isRecess: true, color: '#F59E0B' },
    { period: '4', time: '12:00 – 12:45 PM', subject: 'Social Studies Presentation', teacher: 'Mr. Tariq Khan', room: 'Room 203', color: '#B45309' },
    { period: '5', time: '12:45 – 01:30 PM', subject: 'Moral Science & Life Skills', teacher: 'Mrs. Sunita Verma', room: 'Room 204', color: '#14B8A6' },
    { period: '6', time: '01:30 – 02:15 PM', subject: 'House Activities', teacher: 'House Captains', room: 'Quadrangle', color: '#6366F1' },
  ],
  Sat: [
    { period: '1', time: '09:00 – 09:50 AM', subject: 'Remedial Math & Doubt Clearing', teacher: 'Mr. Arvind Sharma', room: 'Room 204', color: '#0b2178ff' },
    { period: '2', time: '09:50 – 10:40 AM', subject: 'Robotics & STEM Workshop', teacher: 'Mr. Dev Roy', room: 'Innovation Hub', color: '#0284C7' },
    { period: '3', time: '10:50 – 11:45 AM', subject: 'Inter-House Quiz Competition', teacher: 'Activity Council', room: 'Auditorium', color: '#8B5CF6' },
    { period: 'Dispersal', time: '12:00 PM', subject: 'Weekend Dispersal', teacher: 'All Faculty', room: 'Main Gate', isRecess: true, color: '#10B981' },
  ],
};

export default function ViewTimetableScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [selectedDay, setSelectedDay] = useState('Thu');

  const currentSchedule = weekSchedules[selectedDay] || weekSchedules.Mon;

  const handleDownload = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Timetable Downloaded', 'Class VI - B Weekly Timetable PDF saved to your files.');
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
        <Text style={styles.navTitle}>Class Timetable</Text>
        <Pressable
          onPress={handleDownload}
          style={({ pressed }) => [styles.downloadBtn, pressed && { opacity: 0.75 }]}
          hitSlop={8}
        >
          <Download size={18} color="#1b005a" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Class Banner */}
        <View style={styles.classBanner}>
          <View>
            <Text style={styles.bannerClass}>Class VI • Section B</Text>
            <Text style={styles.bannerSub}>Class Teacher: Mrs. Sunita Verma (Room 204)</Text>
          </View>
          <View style={styles.termTag}>
            <Text style={styles.termTagText}>Term 1</Text>
          </View>
        </View>

        {/* Day Selector */}
        <View style={styles.daySelectorRow}>
          {days.map((d) => {
            const isSelected = selectedDay === d;
            return (
              <Pressable
                key={d}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedDay(d);
                }}
                style={[styles.dayButton, isSelected && styles.dayButtonSelected]}
              >
                <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                  {d}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Section title */}
        <View style={styles.componentHeader}>
          <Text style={styles.componentText}>Daily Routine ({selectedDay})</Text>
          <View style={styles.headerLine} />
        </View>

        {/* Periods List */}
        {currentSchedule.map((item, idx) => {
          if (item.isRecess) {
            return (
              <View key={idx} style={styles.recessCard}>
                <Clock size={15} color="#B45309" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.recessTitle}>{item.subject}</Text>
                  <Text style={styles.recessTime}>{item.time} • {item.room}</Text>
                </View>
              </View>
            );
          }

          return (
            <View
              key={idx}
              style={[
                styles.periodCard,
                item.isCurrent && styles.periodCardCurrent,
              ]}
            >
              {/* Period Number Box */}
              <View style={[styles.periodBox, { backgroundColor: item.color }]}>
                <Text style={styles.periodNumber}>{item.period}</Text>
                <Text style={styles.periodLabel}>PERIOD</Text>
              </View>

              {/* Details */}
              <View style={styles.periodContent}>
                <View style={styles.periodHeaderRow}>
                  <Text style={styles.subjectText}>{item.subject}</Text>
                  {item.isCurrent && (
                    <View style={styles.liveBadge}>
                      <Text style={styles.liveBadgeText}>ONGOING</Text>
                    </View>
                  )}
                </View>

                <View style={styles.periodMetaRow}>
                  <Clock size={12} color="#8b4a0dff" />
                  <Text style={styles.metaTime}>{item.time}</Text>
                </View>

                <View style={styles.teacherRoomRow}>
                  <View style={styles.metaWithIcon}>
                    <User size={12} color="#666" />
                    <Text style={styles.metaName}>{item.teacher}</Text>
                  </View>
                  <View style={styles.metaWithIcon}>
                    <MapPin size={12} color="#666" />
                    <Text style={styles.metaName}>{item.room}</Text>
                  </View>
                </View>
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
  downloadBtn: {
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

  classBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e0d0',
    padding: 14,
    marginBottom: 14,
  },
  bannerClass: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#100707ff',
    fontWeight: '700',
  },
  bannerSub: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  termTag: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  termTagText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 11,
    color: '#6C4DFF',
    fontWeight: '700',
  },

  daySelectorRow: {
    flexDirection: 'row',
    backgroundColor: '#EBE7D8',
    borderRadius: 10,
    padding: 3,
    marginBottom: 14,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  dayButtonSelected: {
    backgroundColor: '#1b005a',
  },
  dayText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#555',
  },
  dayTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },

  componentHeader: { paddingLeft: '1%', marginBottom: 10, marginTop: 4 },
  componentText: { fontFamily: 'Roboto_300Light', fontSize: 18, color: '#222' },
  headerLine: { borderWidth: 1, width: 36, marginTop: 3, borderColor: '#0b2178ff', backgroundColor: '#0b2178ff' },

  periodCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  periodCardCurrent: {
    borderColor: '#0b2178ff',
    borderWidth: 1.8,
    backgroundColor: '#F8FAFC',
  },
  periodBox: {
    width: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  periodNumber: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
  },
  periodLabel: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 8,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '700',
    marginTop: 1,
  },
  periodContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  periodHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subjectText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: '#100707ff',
    fontWeight: '700',
  },
  liveBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveBadgeText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 9,
    color: '#15803D',
    fontWeight: '700',
  },
  periodMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaTime: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#666',
  },
  teacherRoomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 2,
  },
  metaWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaName: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#555',
  },

  recessCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  recessTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13,
    color: '#92400E',
    fontWeight: '700',
  },
  recessTime: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#B45309',
    marginTop: 2,
  },
});
