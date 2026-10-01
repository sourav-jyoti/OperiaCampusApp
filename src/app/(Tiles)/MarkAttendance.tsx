import { mockStudents } from '@/utilities/mockdata';
import type { AttendanceStatus, Student } from '@/utilities/types';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Check,
  CheckCircle2,
  GraduationCap,
  Search,
  Users2,
  X,
  XCircle,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Cycling pastel avatar colors
const AVATAR_COLORS = [
  { bg: '#FFF3E0', text: '#F28C28' },
  { bg: '#EDE9FE', text: '#6C4DFF' },
  { bg: '#E8F5E9', text: '#2E8B3C' },
  { bg: '#FEF3C7', text: '#B45309' },
  { bg: '#FCE7F3', text: '#BE185D' },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export default function MarkAttendanceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const todayDateFormatted = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }, []);

  const classInfo = { className: 'VI', section: 'Section A' };

  // Attendance state: studentId → 'present' | 'absent'
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(() => {
    const initial: Record<string, AttendanceStatus> = {};
    mockStudents.forEach((s) => {
      initial[s.id] = 'present';
    });
    return initial;
  });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);

  const totalCount = mockStudents.length;
  const presentCount = useMemo(
    () => Object.values(attendance).filter((s) => s === 'present').length,
    [attendance]
  );
  const absentCount = totalCount - presentCount;

  // Filtered list
  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return mockStudents;
    return mockStudents.filter(
      (s) => s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const toggleStudent = (studentId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'present' ? 'absent' : 'present',
    }));
  };

  const handleMarkAllPresent = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const updated: Record<string, AttendanceStatus> = {};
    mockStudents.forEach((s) => {
      updated[s.id] = 'present';
    });
    setAttendance(updated);
  };

  const handleMarkAllAbsent = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    const updated: Record<string, AttendanceStatus> = {};
    mockStudents.forEach((s) => {
      updated[s.id] = 'absent';
    });
    setAttendance(updated);
  };

  const handleSubmit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Attendance Submitted',
      `Present: ${presentCount}\nAbsent: ${absentCount}\nTotal: ${totalCount}`,
      [{ text: 'Done', onPress: () => router.back() }]
    );
  };

  const renderStudent = ({ item, index }: { item: Student; index: number }) => {
    const isPresent = attendance[item.id] === 'present';
    const color = AVATAR_COLORS[index % AVATAR_COLORS.length];

    return (
      <View style={[styles.studentRow, index > 0 && styles.studentRowBorder]}>
        {/* Left accent bar */}
        <View style={[styles.statusAccent, { backgroundColor: isPresent ? '#2E8B3C' : '#E53935' }]} />

        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: color.bg }]}>
          <Text style={[styles.avatarText, { color: color.text }]}>{getInitials(item.name)}</Text>
        </View>

        {/* Name + Roll */}
        <View style={styles.studentInfo}>
          <Text style={styles.studentName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.rollNo}>{item.rollNo}</Text>
        </View>

        {/* Toggle Pill */}
        <Pressable
          onPress={() => toggleStudent(item.id)}
          style={({ pressed }) => [
            styles.statusPill,
            isPresent ? styles.presentPill : styles.absentPill,
            pressed && { opacity: 0.82, transform: [{ scale: 0.94 }] },
          ]}
          accessibilityLabel={isPresent ? 'Mark absent' : 'Mark present'}
          accessibilityRole="button"
        >
          {isPresent ? (
            <>
              <Check size={13} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.pillText}>Present</Text>
            </>
          ) : (
            <>
              <X size={13} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.pillText}>Absent</Text>
            </>
          )}
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9ea" />

      {/* Top Navigation Bar */}
      <View style={styles.topHeader}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }]}
          hitSlop={8}
          accessibilityLabel="Back"
          accessibilityRole="button"
        >
          <ArrowLeft size={20} color="#172033" />
        </Pressable>
        <Text style={styles.navTitle}>Mark Attendance</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id}
        renderItem={renderStudent}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 92 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            {/* ── Attendance Details Card ── */}
            <View style={styles.detailsCard}>
              {/* Date Row */}
              <View style={styles.dateRow}>
                <View style={styles.dateBadge}>
                  <CalendarIcon size={14} color="#F28C28" />
                  <Text style={styles.dateBadgeText}>{todayDateFormatted}</Text>
                </View>
                <View style={styles.todayPill}>
                  <View style={styles.todayDot} />
                  <Text style={styles.todayPillText}>Today</Text>
                </View>
              </View>

              <View style={styles.cardDivider} />

              {/* Class & Section */}
              <View style={styles.classRow}>
                <View style={styles.classBox}>
                  <View style={styles.classIconBox}>
                    <GraduationCap size={15} color="#F28C28" />
                  </View>
                  <View>
                    <Text style={styles.classLabel}>Class</Text>
                    <Text style={styles.classValue}>{classInfo.className}</Text>
                  </View>
                </View>
                <View style={styles.classBoxSep} />
                <View style={styles.classBox}>
                  <View style={styles.classIconBox}>
                    <Users2 size={15} color="#F28C28" />
                  </View>
                  <View>
                    <Text style={styles.classLabel}>Section</Text>
                    <Text style={styles.classValue}>{classInfo.section}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardDivider} />

              {/* Stats */}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{totalCount}</Text>
                  <Text style={styles.statLabel}>Total</Text>
                </View>
                <View style={styles.statSep} />
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, styles.presentColor]}>{presentCount}</Text>
                  <Text style={styles.statLabel}>Present</Text>
                </View>
                <View style={styles.statSep} />
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, styles.absentColor]}>{absentCount}</Text>
                  <Text style={styles.statLabel}>Absent</Text>
                </View>
              </View>
            </View>

            {/* ── Bulk Actions ── */}
            <View style={styles.bulkRow}>
              <Pressable
                onPress={handleMarkAllPresent}
                style={({ pressed }) => [
                  styles.bulkBtn,
                  styles.bulkPresentBtn,
                  presentCount === totalCount && styles.bulkBtnActive,
                  pressed && { opacity: 0.82, transform: [{ scale: 0.97 }] },
                ]}
                accessibilityLabel="Mark all present"
                accessibilityRole="button"
              >
                <CheckCircle2 size={15} color="#2E8B3C" />
                <Text style={styles.bulkPresentText}>Mark All Present</Text>
              </Pressable>
              <Pressable
                onPress={handleMarkAllAbsent}
                style={({ pressed }) => [
                  styles.bulkBtn,
                  styles.bulkAbsentBtn,
                  absentCount === totalCount && styles.bulkBtnActive,
                  pressed && { opacity: 0.82, transform: [{ scale: 0.97 }] },
                ]}
                accessibilityLabel="Mark all absent"
                accessibilityRole="button"
              >
                <XCircle size={15} color="#E53935" />
                <Text style={styles.bulkAbsentText}>Mark All Absent</Text>
              </Pressable>
            </View>

            {/* ── Students header with search ── */}
            <View style={styles.studentsHeader}>
              <Text style={styles.studentsTitle}>Students ({totalCount})</Text>
              <Pressable
                onPress={() => {
                  setSearchVisible((v) => !v);
                  if (searchVisible) setSearchQuery('');
                }}
                style={({ pressed }) => [
                  styles.searchIconBtn,
                  searchVisible && styles.searchIconBtnActive,
                  pressed && { opacity: 0.7 },
                ]}
                accessibilityLabel="Search students"
                accessibilityRole="button"
              >
                <Search size={16} color={searchVisible ? '#F2A51A' : '#687080'} />
              </Pressable>
            </View>

            {/* Inline search input */}
            {searchVisible && (
              <View style={styles.searchBar}>
                <Search size={15} color="#687080" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by name or ID…"
                  placeholderTextColor="#A0A8B0"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                  returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                  <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
                    <X size={15} color="#687080" />
                  </Pressable>
                )}
              </View>
            )}

            {/* Column hint */}
            <View style={styles.columnHint}>
              <Text style={styles.columnHintLeft}>Student</Text>
              <Text style={styles.columnHintRight}>Tap to toggle</Text>
            </View>
          </>
        }
      />

      {/* ── Sticky Bottom Bar ── */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View style={styles.bottomSummary}>
          <Text style={styles.bottomSummaryLabel}>SUMMARY</Text>
          <Text style={styles.bottomSummaryValue}>
            {presentCount} Present • {absentCount} Absent • {totalCount} Total
          </Text>
        </View>
        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.submitButton,
            pressed && { opacity: 0.88, transform: [{ scale: 0.97 }] },
          ]}
          accessibilityLabel="Submit attendance"
          accessibilityRole="button"
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAF5',
  },

  /* Header */
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#f9f9ea',
    borderBottomWidth: 1,
    borderBottomColor: '#EDECDF',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DDD8C8',
  },
  navTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 17,
    color: '#172033',
  },

  listContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
  },

  /* Details Card */
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#EEEAD8',
  },

  /* Date row */
  dateRow: {
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
    fontSize: 13,
    color: '#172033',
  },
  todayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEFFE0',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F2A51A',
    gap: 5,
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F2A51A',
  },
  todayPillText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 11,
    color: '#F2A51A',
  },

  cardDivider: {
    height: 1,
    backgroundColor: '#F0ECE0',
    marginVertical: 10,
  },

  /* Class row */
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  classBoxSep: {
    width: 1,
    height: 32,
    backgroundColor: '#F0ECE0',
    marginHorizontal: 12,
  },
  classIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  classLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 10,
    color: '#687080',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  classValue: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13,
    color: '#172033',
    marginTop: 1,
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 22,
    color: '#172033',
  },
  statLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#687080',
    marginTop: 1,
  },
  statSep: {
    width: 1,
    height: 28,
    backgroundColor: '#E5E0D0',
  },
  presentColor: {
    color: '#2E8B3C',
  },
  absentColor: {
    color: '#E53935',
  },

  /* Bulk actions */
  bulkRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  bulkBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  bulkPresentBtn: {
    borderColor: '#2E8B3C',
    backgroundColor: '#F1F8E9',
  },
  bulkAbsentBtn: {
    borderColor: '#E53935',
    backgroundColor: '#FFEBEE',
  },
  bulkBtnActive: {
    borderWidth: 2,
  },
  bulkPresentText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#2E8B3C',
  },
  bulkAbsentText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#E53935',
  },

  /* Students header */
  studentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  studentsTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 15,
    color: '#172033',
  },
  searchIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DDD8C8',
    backgroundColor: '#FFFFFF',
  },
  searchIconBtnActive: {
    borderColor: '#F2A51A',
    backgroundColor: '#FFF9EE',
  },

  /* Search bar */
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F2A51A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    gap: 8,
  },
  searchIcon: {},
  searchInput: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#172033',
    paddingVertical: 0,
  },

  /* Column hint */
  columnHint: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F5F3EB',
    borderRadius: 8,
    marginBottom: 4,
  },
  columnHintLeft: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 11,
    color: '#687080',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  columnHintRight: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#A0A8B0',
  },

  /* Student Row */
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingRight: 12,
    overflow: 'hidden',
  },
  studentRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F0ECE0',
  },

  /* Left accent bar (4px colored strip) */
  statusAccent: {
    width: 4,
    alignSelf: 'stretch',
    marginRight: 10,
    borderRadius: 2,
    minHeight: 44,
  },

  /* Avatar */
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12,
  },

  /* Student info */
  studentInfo: {
    flex: 1,
    marginRight: 8,
  },
  studentName: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 13,
    color: '#172033',
  },
  rollNo: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#687080',
    marginTop: 1,
  },

  /* Status pill */
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 16,
  },
  presentPill: {
    backgroundColor: '#2E8B3C',
  },
  absentPill: {
    backgroundColor: '#E53935',
  },
  pillText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
  },

  /* Bottom Bar */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EDECDF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 5,
  },
  bottomSummary: {
    flex: 1,
    marginRight: 12,
  },
  bottomSummaryLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 10,
    color: '#687080',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  bottomSummaryValue: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#172033',
    marginTop: 1,
  },
  submitButton: {
    backgroundColor: '#172033',
    paddingVertical: 11,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 13,
  },
});
