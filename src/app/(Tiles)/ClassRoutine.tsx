import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Download,
  GraduationCap,
  MapPin,
  Share2,
  Users,
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

type DayRoutine = {
  day: string;
  periods: { num: number; subject: string; teacher: string; room: string }[];
};

const fullWeekRoutine: DayRoutine[] = [
  {
    day: 'Monday',
    periods: [
      { num: 1, subject: 'Math', teacher: 'AS', room: '204' },
      { num: 2, subject: 'Science', teacher: 'RG', room: 'Lab 2' },
      { num: 3, subject: 'English', teacher: 'SV', room: '105' },
      { num: 4, subject: 'SST', teacher: 'TK', room: '203' },
      { num: 5, subject: 'Coding', teacher: 'DR', room: 'Lab 1' },
      { num: 6, subject: 'PE', teacher: 'DS', room: 'Ground' },
    ],
  },
  {
    day: 'Tuesday',
    periods: [
      { num: 1, subject: 'Science', teacher: 'RG', room: 'Lab 2' },
      { num: 2, subject: 'Math', teacher: 'AS', room: '204' },
      { num: 3, subject: 'Hindi', teacher: 'PJ', room: '204' },
      { num: 4, subject: 'English', teacher: 'SV', room: '105' },
      { num: 5, subject: 'Art', teacher: 'RS', room: 'Studio' },
      { num: 6, subject: 'Library', teacher: 'MJ', room: 'Lib' },
    ],
  },
  {
    day: 'Wednesday',
    periods: [
      { num: 1, subject: 'Math', teacher: 'AS', room: '204' },
      { num: 2, subject: 'SST', teacher: 'TK', room: '203' },
      { num: 3, subject: 'Sci Lab', teacher: 'RG', room: 'Lab 2' },
      { num: 4, subject: 'English', teacher: 'SV', room: '105' },
      { num: 5, subject: 'Music', teacher: 'PS', room: 'Music' },
      { num: 6, subject: 'Clubs', teacher: 'All', room: 'Hall' },
    ],
  },
  {
    day: 'Thursday',
    periods: [
      { num: 1, subject: 'Math', teacher: 'AS', room: '204' },
      { num: 2, subject: 'Science', teacher: 'RG', room: 'Lab 2' },
      { num: 3, subject: 'English', teacher: 'SV', room: '105' },
      { num: 4, subject: 'SST', teacher: 'TK', room: '203' },
      { num: 5, subject: 'Coding', teacher: 'DR', room: 'Lab 1' },
      { num: 6, subject: 'Sports', teacher: 'DS', room: 'Ground' },
    ],
  },
  {
    day: 'Friday',
    periods: [
      { num: 1, subject: 'Hindi', teacher: 'PJ', room: '204' },
      { num: 2, subject: 'Math', teacher: 'AS', room: '204' },
      { num: 3, subject: 'Science', teacher: 'RG', room: 'Lab 2' },
      { num: 4, subject: 'SST', teacher: 'TK', room: '203' },
      { num: 5, subject: 'Moral Sci', teacher: 'SV', room: '204' },
      { num: 6, subject: 'House Act.', teacher: 'All', room: 'Quad' },
    ],
  },
];

export default function ClassRoutineScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedClass, setSelectedClass] = useState('Class VI - B');

  const handleDownload = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Routine Exported', `Official Weekly Routine PDF for ${selectedClass} saved to downloads.`);
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
        <Text style={styles.navTitle}>Class Routine</Text>
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
        {/* Class Selection Pills */}
        <View style={styles.classPillRow}>
          {['Class VI - B', 'Class VI - A', 'Class VII - A', 'Class VIII - C'].map((c) => (
            <Pressable
              key={c}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedClass(c);
              }}
              style={[styles.classPill, selectedClass === c && styles.classPillActive]}
            >
              <Text style={[styles.classPillText, selectedClass === c && styles.classPillTextActive]}>
                {c}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Overview Stats */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeader}>
            <View>
              <Text style={styles.overviewTitle}>{selectedClass} Master Routine</Text>
              <Text style={styles.overviewSub}>Class Mentor: Mrs. Sunita Verma</Text>
            </View>
            <View style={styles.roomTag}>
              <MapPin size={11} color="#0284C7" />
              <Text style={styles.roomTagText}>Room 204</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>36</Text>
              <Text style={styles.statLbl}>Weekly Periods</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>6</Text>
              <Text style={styles.statLbl}>Periods / Day</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>45m</Text>
              <Text style={styles.statLbl}>Duration</Text>
            </View>
          </View>
        </View>

        {/* Section title */}
        <View style={styles.componentHeader}>
          <Text style={styles.componentText}>Weekly Grid Layout</Text>
          <View style={styles.headerLine} />
        </View>

        {/* Weekly Routine Day Cards */}
        {fullWeekRoutine.map((item) => (
          <View key={item.day} style={styles.dayCard}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayName}>{item.day}</Text>
              <Text style={styles.periodCountText}>6 Periods</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.periodScroll}>
              {item.periods.map((p) => (
                <View key={p.num} style={styles.periodChip}>
                  <Text style={styles.periodChipNum}>P{p.num}</Text>
                  <Text style={styles.periodChipSubject} numberOfLines={1}>{p.subject}</Text>
                  <Text style={styles.periodChipSub}>{p.teacher} • {p.room}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        ))}

        {/* Bell Schedule Summary */}
        <View style={styles.componentHeader}>
          <Text style={styles.componentText}>Standard Bell Schedule</Text>
          <View style={styles.headerLine} />
        </View>

        <View style={styles.bellCard}>
          {[
            { slot: 'Morning Assembly', time: '08:30 – 08:50 AM' },
            { slot: 'Zero Period (Attendance)', time: '08:50 – 09:00 AM' },
            { slot: 'Periods 1 & 2', time: '09:00 – 10:30 AM' },
            { slot: 'Short Water Break', time: '10:30 – 10:45 AM' },
            { slot: 'Period 3', time: '10:45 – 11:30 AM' },
            { slot: 'Lunch Recess', time: '11:30 – 12:00 PM' },
            { slot: 'Periods 4, 5 & 6', time: '12:00 – 02:15 PM' },
            { slot: 'Dispersal & Buses', time: '02:30 PM' },
          ].map((row, i) => (
            <View key={i} style={styles.bellRow}>
              <Text style={styles.bellSlot}>{row.slot}</Text>
              <Text style={styles.bellTime}>{row.time}</Text>
            </View>
          ))}
        </View>
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

  classPillRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  classPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dcd8c8',
  },
  classPillActive: {
    backgroundColor: '#1b005a',
    borderColor: '#1b005a',
  },
  classPillText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#555',
  },
  classPillTextActive: {
    fontFamily: 'Roboto_700Bold',
    color: '#ffffff',
    fontWeight: '700',
  },

  overviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    padding: 14,
    marginBottom: 16,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overviewTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 15,
    color: '#100707ff',
    fontWeight: '700',
  },
  overviewSub: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  roomTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roomTagText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '700',
  },
  divider: { height: 1, backgroundColor: '#f0ece0', marginVertical: 12 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: { alignItems: 'center' },
  statNum: { fontFamily: 'Roboto_700Bold', fontSize: 18, color: '#100707ff', fontWeight: '700' },
  statLbl: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#777', marginTop: 2 },

  componentHeader: { paddingLeft: '1%', marginBottom: 10, marginTop: 4 },
  componentText: { fontFamily: 'Roboto_300Light', fontSize: 18, color: '#222' },
  headerLine: { borderWidth: 1, width: 36, marginTop: 3, borderColor: '#0b2178ff', backgroundColor: '#0b2178ff' },

  dayCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    padding: 12,
    marginBottom: 10,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayName: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: '#100707ff',
    fontWeight: '700',
  },
  periodCountText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#888',
  },
  periodScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },
  periodChip: {
    width: 82,
    backgroundColor: '#fafaf5',
    borderWidth: 1,
    borderColor: '#dcd8c8',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  periodChipNum: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 10,
    color: '#0b2178ff',
    fontWeight: '700',
  },
  periodChipSubject: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12,
    color: '#100707ff',
    fontWeight: '700',
    marginTop: 2,
  },
  periodChipSub: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },

  bellCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    padding: 12,
    marginBottom: 20,
  },
  bellRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#f0ece0',
  },
  bellSlot: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#333',
  },
  bellTime: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#8b4a0dff',
  },
});
