import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Edit2,
  RefreshCw,
  Send,
  UserCheck,
  Users,
  X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type EditablePeriod = {
  id: string;
  period: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  isSubstituted?: boolean;
};

const initialPeriods: EditablePeriod[] = [
  { id: 'p1', period: '1', time: '09:00 – 09:45 AM', subject: 'Mathematics', teacher: 'Mr. Arvind Sharma', room: 'Room 204' },
  { id: 'p2', period: '2', time: '09:45 – 10:30 AM', subject: 'General Science', teacher: 'Mrs. Rekha Gupta (On Leave)', room: 'Science Lab 2', isSubstituted: true },
  { id: 'p3', period: '3', time: '10:45 – 11:30 AM', subject: 'English Literature', teacher: 'Ms. Sunita Verma', room: 'Room 105' },
  { id: 'p4', period: '4', time: '12:00 – 12:45 PM', subject: 'Social Studies', teacher: 'Mr. Tariq Khan', room: 'Room 203' },
  { id: 'p5', period: '5', time: '12:45 – 01:30 PM', subject: 'Computer Coding', teacher: 'Mr. Dev Roy', room: 'Computer Lab 1' },
  { id: 'p6', period: '6', time: '01:30 – 02:15 PM', subject: 'Physical Education', teacher: 'Coach Singh', room: 'East Playground' },
];

const availableSubstitutes = [
  { name: 'Mr. Michael David', subject: 'Science / Environmental', status: 'Available' },
  { name: 'Ms. Priya Sen', subject: 'Mathematics / Statistics', status: 'Available' },
  { name: 'Mr. Anuj Saxena', subject: 'English / Communications', status: 'Busy Period 2' },
];

export default function ManageTimetableScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [periods, setPeriods] = useState<EditablePeriod[]>(initialPeriods);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedClass, setSelectedClass] = useState('Class VI - B');

  // Modal edit state
  const [editingPeriod, setEditingPeriod] = useState<EditablePeriod | null>(null);

  const handleAssignSubstitute = (subName: string) => {
    if (!editingPeriod) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setPeriods((prev) =>
      prev.map((p) =>
        p.id === editingPeriod.id
          ? { ...p, teacher: `${subName} (Substitute)`, isSubstituted: true }
          : p
      )
    );
    setEditingPeriod(null);
    Alert.alert('Substitute Assigned', `${subName} assigned to ${editingPeriod.subject} (Period ${editingPeriod.period}).`);
  };

  const handlePublish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Schedule Published ✓',
      `Updated timetable for ${selectedClass} (${selectedDay}) notified to teachers and students.`,
      [{ text: 'OK', onPress: () => router.back() }]
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
        <Text style={styles.navTitle}>Manage Timetable</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Class and Day Selection Info */}
        <View style={styles.filterBanner}>
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>TARGET CLASS</Text>
            <Text style={styles.filterValue}>{selectedClass}</Text>
          </View>
          <View style={styles.filterDivider} />
          <View style={styles.filterItem}>
            <Text style={styles.filterLabel}>SCHEDULE DAY</Text>
            <Text style={styles.filterValue}>{selectedDay}</Text>
          </View>
        </View>

        {/* Warning / Notice Banner */}
        <View style={styles.noticeBanner}>
          <AlertCircle size={16} color="#B45309" />
          <Text style={styles.noticeText}>
            1 substitution required today due to faculty leave in Science Lab.
          </Text>
        </View>

        {/* Section title */}
        <View style={styles.componentHeader}>
          <Text style={styles.componentText}>Adjust Slots & Teachers</Text>
          <View style={styles.headerLine} />
        </View>

        {/* Periods List */}
        {periods.map((item) => (
          <View key={item.id} style={[styles.periodCard, item.isSubstituted && styles.periodCardSub]}>
            <View style={styles.periodLeft}>
              <View style={[styles.periodNumBox, item.isSubstituted && styles.periodNumBoxSub]}>
                <Text style={styles.periodNumText}>P{item.period}</Text>
              </View>

              <View style={styles.periodMain}>
                <View style={styles.periodTitleRow}>
                  <Text style={styles.subjectText}>{item.subject}</Text>
                  {item.isSubstituted && (
                    <View style={styles.subTag}>
                      <Text style={styles.subTagText}>SUBSTITUTE</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.teacherText}>{item.teacher}</Text>
                <Text style={styles.timeRoomText}>{item.time}  •  {item.room}</Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setEditingPeriod(item);
              }}
              style={({ pressed }) => [styles.editBtn, pressed && { opacity: 0.7 }]}
            >
              <Edit2 size={15} color="#1b005a" />
            </Pressable>
          </View>
        ))}

        {/* Publish Action Button */}
        <Pressable
          onPress={handlePublish}
          style={({ pressed }) => [styles.publishBtn, pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] }]}
        >
          <Send size={16} color="#ffffff" />
          <Text style={styles.publishBtnText}>Publish Changes to Live Grid</Text>
        </Pressable>
      </ScrollView>

      {/* Substitute Selector Modal */}
      <Modal visible={editingPeriod !== null} transparent animationType="slide" onRequestClose={() => setEditingPeriod(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setEditingPeriod(null)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {editingPeriod && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>Reassign Period {editingPeriod.period}</Text>
                    <Text style={styles.modalSub}>{editingPeriod.subject} • {editingPeriod.time}</Text>
                  </View>
                  <Pressable onPress={() => setEditingPeriod(null)} hitSlop={10}>
                    <X size={20} color="#333" />
                  </Pressable>
                </View>

                <Text style={styles.subListHeader}>Available Faculty for Substitution</Text>

                {availableSubstitutes.map((teacher, idx) => {
                  const isBusy = teacher.status.includes('Busy');
                  return (
                    <Pressable
                      key={idx}
                      disabled={isBusy}
                      onPress={() => handleAssignSubstitute(teacher.name)}
                      style={({ pressed }) => [
                        styles.teacherOption,
                        isBusy && styles.teacherOptionBusy,
                        pressed && !isBusy && { backgroundColor: '#feffe0ff' },
                      ]}
                    >
                      <View>
                        <Text style={[styles.teacherOptName, isBusy && { color: '#999' }]}>{teacher.name}</Text>
                        <Text style={styles.teacherOptSub}>{teacher.subject}</Text>
                      </View>
                      <View style={[styles.statusBadge, isBusy ? styles.statusBadgeBusy : styles.statusBadgeAvail]}>
                        <Text style={[styles.statusBadgeText, isBusy ? styles.statusTextBusy : styles.statusTextAvail]}>
                          {teacher.status}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
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

  filterBanner: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e0d0',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  filterItem: { alignItems: 'center' },
  filterLabel: { fontFamily: 'Roboto_400Regular', fontSize: 10, color: '#888', letterSpacing: 0.5 },
  filterValue: { fontFamily: 'Roboto_700Bold', fontSize: 14, color: '#100707ff', fontWeight: '700', marginTop: 2 },
  filterDivider: { width: 1, height: 24, backgroundColor: '#E5E7EB' },

  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  noticeText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#92400E',
    flex: 1,
  },

  componentHeader: { paddingLeft: '1%', marginBottom: 10, marginTop: 4 },
  componentText: { fontFamily: 'Roboto_300Light', fontSize: 18, color: '#222' },
  headerLine: { borderWidth: 1, width: 36, marginTop: 3, borderColor: '#0b2178ff', backgroundColor: '#0b2178ff' },

  periodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    padding: 12,
    marginBottom: 10,
  },
  periodCardSub: {
    borderColor: '#F59E0B',
    backgroundColor: '#FFFEF8',
  },
  periodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  periodNumBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#0b2178ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodNumBoxSub: {
    backgroundColor: '#B45309',
  },
  periodNumText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '700',
  },
  periodMain: {
    flex: 1,
    gap: 2,
  },
  periodTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subjectText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: '#100707ff',
    fontWeight: '700',
  },
  subTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  subTagText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 8,
    color: '#B45309',
    fontWeight: '700',
  },
  teacherText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#555',
  },
  timeRoomText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#888',
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#fafaf5',
    borderWidth: 1,
    borderColor: '#dcd8c8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },

  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1b005a',
    borderRadius: 10,
    paddingVertical: 13,
    marginTop: 10,
  },
  publishBtnText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 17,
    color: '#100707ff',
    fontWeight: '700',
  },
  modalSub: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  subListHeader: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#555',
    marginBottom: 10,
  },
  teacherOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0ece0',
  },
  teacherOptionBusy: {
    opacity: 0.5,
  },
  teacherOptName: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 13,
    color: '#100707ff',
  },
  teacherOptSub: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#777',
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  statusBadgeAvail: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeBusy: {
    backgroundColor: '#F1F5F9',
  },
  statusBadgeText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 10,
    fontWeight: '700',
  },
  statusTextAvail: { color: '#15803D' },
  statusTextBusy: { color: '#64748B' },
});
