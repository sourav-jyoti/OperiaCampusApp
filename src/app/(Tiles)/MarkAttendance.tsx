import { mockStudents } from '@/utilities/mockdata';
import type { AttendanceStatus, Student } from '@/utilities/types';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar as CalendarIcon, Check, CheckCircle2, GraduationCap, Users2, X, XCircle } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MarkAttendanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Header Details
  const todayDateFormatted = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }, []);

  const classInfo = {
    className: 'VI',
    section: 'Section A',
  };

  // State: attendance mapping studentId -> 'present' | 'absent'
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(() => {
    const initial: Record<string, AttendanceStatus> = {};
    mockStudents.forEach((student) => {
      initial[student.id] = 'present';
    });
    return initial;
  });

  const totalCount = mockStudents.length;
  const presentCount = useMemo(() => Object.values(attendance).filter((s) => s === 'present').length, [attendance]);
  const absentCount = totalCount - presentCount;

  // Toggle individual student
  const toggleStudentStatus = (studentId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
    }));
  };

  // Mark all present
  const handleMarkAllPresent = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAttendance(() => {
      const updated: Record<string, AttendanceStatus> = {};
      mockStudents.forEach((student) => {
        updated[student.id] = 'present';
      });
      return updated;
    });
  };

  // Mark all absent
  const handleMarkAllAbsent = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setAttendance(() => {
      const updated: Record<string, AttendanceStatus> = {};
      mockStudents.forEach((student) => {
        updated[student.id] = 'absent';
      });
      return updated;
    });
  };

  // Submit attendance
  const handleSubmit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Attendance Submitted', `Present: ${presentCount}\nAbsent: ${absentCount}\nTotal: ${totalCount}`, [
      {
        text: 'Done',
        onPress: () => router.back(),
      },
    ]);
  };

  const renderStudentItem = ({ item }: { item: Student; index: number }) => {
    const isPresent = attendance[item.id] === 'present';
    const initials = item.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2);

    return (
      <View style={[styles.studentCard, isPresent ? styles.studentCardPresent : styles.studentCardAbsent]}>
        <View style={styles.studentInfoContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.nameSection}>
            <Text style={styles.studentName}>{item.name}</Text>
            <View style={styles.rollBadge}>
              <Text style={styles.rollText}>{item.rollNo}</Text>
            </View>
          </View>
        </View>

        {/* Toggle Button */}
        <Pressable
          onPress={() => toggleStudentStatus(item.id)}
          style={({ pressed }) => [styles.statusToggleButton, isPresent ? styles.presentButton : styles.absentButton, pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] }]}
        >
          {isPresent ? (
            <>
              <Check size={15} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.statusButtonText}>Present</Text>
            </>
          ) : (
            <>
              <X size={15} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.statusButtonText}>Absent</Text>
            </>
          )}
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9eaff" />

      {/* Top Navigation Bar */}
      <View style={styles.topHeader}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }]}
          hitSlop={8}
          accessibilityLabel="Back"
          accessibilityRole="button"
        >
          <ArrowLeft size={20} color="#222" />
        </Pressable>
        <Text style={styles.navTitle}>Mark Attendance</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={mockStudents}
        keyExtractor={(item) => item.id}
        renderItem={renderStudentItem}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Header: Class, Section, Date */}

            <View style={styles.infoCard}>
              <View style={styles.infoRowTop}>
                <View style={styles.dateBadge}>
                  <CalendarIcon size={15} color="#a78104" />
                  <Text style={styles.dateBadgeText}>{todayDateFormatted}</Text>
                </View>

                <View style={styles.todayPill}>
                  <View style={styles.todayDot} />
                  <Text style={styles.todayPillText}>Today</Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              <View style={styles.classDetailsRow}>
                <View style={styles.detailBox}>
                  <View style={styles.detailIconCircle}>
                    <GraduationCap size={16} color="#8b4a0d" />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>Class</Text>
                    <Text style={styles.detailValue}>{classInfo.className}</Text>
                  </View>
                </View>

                <View style={styles.detailBox}>
                  <View style={styles.detailIconCircle}>
                    <Users2 size={16} color="#8b4a0d" />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>Section</Text>
                    <Text style={styles.detailValue}>{classInfo.section}</Text>
                  </View>
                </View>
              </View>

              {/* Attendance Stats Counter */}
              <View style={styles.statsStrip}>
                <View style={styles.statCol}>
                  <Text style={styles.statCount}>{totalCount}</Text>
                  <Text style={styles.statTitle}>Total</Text>
                </View>
                <View style={styles.statSep} />
                <View style={styles.statCol}>
                  <Text style={[styles.statCount, { color: '#2e7d32' }]}>{presentCount}</Text>
                  <Text style={styles.statTitle}>Present</Text>
                </View>
                <View style={styles.statSep} />
                <View style={styles.statCol}>
                  <Text style={[styles.statCount, { color: '#c62828' }]}>{absentCount}</Text>
                  <Text style={styles.statTitle}>Absent</Text>
                </View>
              </View>
            </View>

            {/* Toggle Buttons: Mark All Absent or All Present */}
            <View style={styles.quickActionRow}>
              <Pressable
                onPress={handleMarkAllPresent}
                style={({ pressed }) => [
                  styles.quickActionBtn,
                  styles.markAllPresentBtn,
                  presentCount === totalCount && styles.quickActionBtnActive,
                  pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                ]}
              >
                <CheckCircle2 size={17} color="#2e7d32" />
                <Text style={styles.markAllPresentText}>Mark All Present</Text>
              </Pressable>

              <Pressable
                onPress={handleMarkAllAbsent}
                style={({ pressed }) => [
                  styles.quickActionBtn,
                  styles.markAllAbsentBtn,
                  absentCount === totalCount && styles.quickActionBtnActive,
                  pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                ]}
              >
                <XCircle size={17} color="#c62828" />
                <Text style={styles.markAllAbsentText}>Mark All Absent</Text>
              </Pressable>
            </View>

            {/* Students List Header */}
            <View style={styles.studentsHeaderContainer}>
              <View style={styles.componentHeaderNoMargin}>
                <Text style={styles.componentText}>Students ({totalCount})</Text>
                <View style={styles.headerLine} />
              </View>
              <Text style={styles.tapTipText}>Tap to toggle</Text>
            </View>
          </>
        }
      />

      {/* Floating Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View style={styles.bottomSummary}>
          <Text style={styles.bottomSummaryLabel}>SUMMARY</Text>
          <Text style={styles.bottomSummaryValue}>
            {presentCount} Present • {absentCount} Absent
          </Text>
        </View>
        <Pressable onPress={handleSubmit} style={({ pressed }) => [styles.submitButton, pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] }]}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f7f1ff',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f9f9eaff',
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
  navTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 17,
    fontWeight: '700',
    color: '#100707ff',
  },
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 6,
  },

  // Component Header matching DashboardStyles & MoreSTyle
  componentHeader: {
    paddingLeft: '1%',
    marginBottom: 8,
    marginTop: 14,
  },
  componentHeaderNoMargin: {
    paddingLeft: '1%',
  },
  componentText: {
    fontFamily: 'Roboto_300Light',
    fontSize: 18,
    color: '#222222',
  },
  headerLine: {
    borderWidth: 1,
    width: 36,
    marginTop: 3,
    borderColor: '#0b2178ff',
    backgroundColor: '#0b2178ff',
  },

  /* Info Card (warm campus theme) */
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    padding: 14,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  infoRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateBadgeText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#222222',
  },
  todayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#feffe0ff',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a78104ff',
    gap: 5,
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#a78104',
  },
  todayPillText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 11,
    color: '#a78104',
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#f0ece0',
    marginVertical: 12,
  },
  classDetailsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  detailBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f3f8fc',
    padding: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#969387ff',
  },
  detailIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dcd8c8',
  },
  detailLabel: {
    fontSize: 10,
    fontFamily: 'Roboto_400Regular',
    color: '#666666',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 12,
    fontFamily: 'Roboto_700Bold',
    fontWeight: '600',
    color: '#100707ff',
    marginTop: 1,
  },

  /* Stats Ribbon */
  statsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#feffe0ff',
    borderRadius: 8,
    marginTop: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#895f05de',
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statCount: {
    fontSize: 18,
    fontFamily: 'Roboto_700Bold',
    fontWeight: '700',
    color: '#8b4a0dff',
  },
  statTitle: {
    fontSize: 11,
    fontFamily: 'Roboto_400Regular',
    color: '#666666',
    marginTop: 1,
  },
  statSep: {
    width: 1,
    height: 22,
    backgroundColor: '#dcd8c8',
  },

  /* Quick Actions */
  quickActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
    marginTop: 18,
  },
  quickActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#969387ff',
  },
  markAllPresentBtn: {
    borderColor: '#2e7d32',
    backgroundColor: '#f1f8e9',
  },
  markAllAbsentBtn: {
    borderColor: '#c62828',
    backgroundColor: '#ffebee',
  },
  quickActionBtnActive: {
    borderWidth: 1.5,
  },
  markAllPresentText: {
    fontSize: 12,
    fontFamily: 'Roboto_600SemiBold',
    fontWeight: '600',
    color: '#2e7d32',
  },
  markAllAbsentText: {
    fontSize: 12,
    fontFamily: 'Roboto_600SemiBold',
    fontWeight: '600',
    color: '#c62828',
  },

  /* Students Header */
  studentsHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 10,
  },
  tapTipText: {
    fontSize: 11,
    fontFamily: 'Roboto_300Light',
    color: '#777777',
  },

  /* Student Card */
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#969387ff',
  },
  studentCardPresent: {
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  studentCardAbsent: {
    borderLeftWidth: 4,
    borderLeftColor: '#c62828',
  },
  studentInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#feffe0ff',
    borderWidth: 1,
    borderColor: '#895f05de',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontFamily: 'Roboto_600SemiBold',
    fontWeight: '600',
    color: '#8b4a0dff',
  },
  nameSection: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontFamily: 'Roboto_600SemiBold',
    fontWeight: '600',
    color: '#100707ff',
  },
  rollBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f8fc',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#dcd8c8',
    marginTop: 3,
  },
  rollText: {
    fontSize: 10,
    fontFamily: 'Roboto_400Regular',
    color: '#555555',
  },

  /* Individual Toggle Button */
  statusToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  presentButton: {
    backgroundColor: '#2e7d32',
  },
  absentButton: {
    backgroundColor: '#c62828',
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Roboto_600SemiBold',
    fontWeight: '600',
  },

  /* Bottom Submit Bar */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#dcd8c8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  bottomSummary: {
    flex: 1,
  },
  bottomSummaryLabel: {
    fontSize: 10,
    fontFamily: 'Roboto_400Regular',
    color: '#777777',
    letterSpacing: 0.5,
  },
  bottomSummaryValue: {
    fontSize: 13,
    fontFamily: 'Roboto_600SemiBold',
    fontWeight: '600',
    color: '#100707ff',
    marginTop: 1,
  },
  submitButton: {
    backgroundColor: '#0b2178ff',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Roboto_600SemiBold',
    fontWeight: '600',
  },
});
