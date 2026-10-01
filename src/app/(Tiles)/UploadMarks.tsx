import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Upload,
  Zap,
} from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type StudentMark = {
  id: string;
  name: string;
  rollNo: string;
  marks: string;
};

const examSubjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science'];
const examTypes = ['Unit Test 1', 'Unit Test 2', 'Mid-Term', 'Final Exam', 'Assignment'];

const mockRoster: StudentMark[] = [
  { id: '1', name: 'Aarav Sharma', rollNo: 'CSE-001', marks: '' },
  { id: '2', name: 'Ananya Iyer', rollNo: 'CSE-002', marks: '' },
  { id: '3', name: 'Devansh Verma', rollNo: 'CSE-003', marks: '' },
  { id: '4', name: 'Ishita Patel', rollNo: 'CSE-004', marks: '' },
  { id: '5', name: 'Kabir Mukherjee', rollNo: 'CSE-005', marks: '' },
  { id: '6', name: 'Meera Nair', rollNo: 'CSE-006', marks: '' },
  { id: '7', name: 'Rohan Gupta', rollNo: 'CSE-007', marks: '' },
  { id: '8', name: 'Saanvi Kulkarni', rollNo: 'CSE-008', marks: '' },
  { id: '9', name: 'Vihaan Reddy', rollNo: 'CSE-009', marks: '' },
  { id: '10', name: 'Zoya Khan', rollNo: 'CSE-010', marks: '' },
];

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

export default function UploadMarksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [students, setStudents] = useState<StudentMark[]>(mockRoster);
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedExamType, setSelectedExamType] = useState('Unit Test 1');
  const [totalMarks, setTotalMarks] = useState('100');
  const [subjectDropdown, setSubjectDropdown] = useState(false);
  const [examDropdown, setExamDropdown] = useState(false);

  // Refs for sequential keyboard navigation
  const inputRefs = useRef<Record<string, TextInput | null>>({});

  const filledCount = useMemo(() => students.filter((s) => s.marks.trim() !== '').length, [students]);
  const progressPercent = Math.round((filledCount / students.length) * 100);

  const updateMarks = (id: string, value: string) => {
    const max = parseInt(totalMarks) || 100;
    const num = parseInt(value);
    if (value !== '' && (isNaN(num) || num < 0 || num > max)) return;
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, marks: value } : s)));
  };

  const handleAutoFill = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const max = parseInt(totalMarks) || 100;
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        marks: s.marks.trim() === '' ? String(Math.floor(Math.random() * (max + 1))) : s.marks,
      }))
    );
  };

  const handleSubmit = () => {
    Keyboard.dismiss();
    const unfilled = students.filter((s) => s.marks.trim() === '');
    if (unfilled.length > 0) {
      Alert.alert(
        'Marks Incomplete',
        `${unfilled.length} student(s) still have empty marks. Submit anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Submit',
            onPress: () => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert(
                'Marks Uploaded',
                `${selectedExamType} marks for ${selectedSubject} submitted successfully.`,
                [{ text: 'OK', onPress: () => router.back() }]
              );
            },
          },
        ]
      );
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Marks Uploaded',
        `${selectedExamType} marks for ${selectedSubject} submitted successfully.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };

  const renderStudent = ({ item, index }: { item: StudentMark; index: number }) => {
    const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
    const studentIds = students.map((s) => s.id);
    const currentIdx = studentIds.indexOf(item.id);
    const nextId = currentIdx < studentIds.length - 1 ? studentIds[currentIdx + 1] : null;
    const isLast = !nextId;
    const isFirst = index === 0;
    const isLastRow = index === students.length - 1;

    return (
      <View
        style={[
          styles.studentRow,
          index > 0 && styles.studentRowBorder,
          isFirst && styles.studentRowFirst,
          isLastRow && styles.studentRowLast,
        ]}
      >
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

        {/* Marks input */}
        <View style={styles.marksInputWrapper}>
          <TextInput
            ref={(ref) => {
              inputRefs.current[item.id] = ref;
            }}
            style={[styles.marksInput, item.marks !== '' && styles.marksInputFilled]}
            keyboardType="numeric"
            placeholder="—"
            placeholderTextColor="#C0BAB0"
            value={item.marks}
            onChangeText={(v) => updateMarks(item.id, v)}
            maxLength={3}
            returnKeyType={isLast ? 'done' : 'next'}
            onSubmitEditing={() => {
              if (nextId && inputRefs.current[nextId]) {
                inputRefs.current[nextId]?.focus();
              } else {
                Keyboard.dismiss();
              }
            }}
            selectTextOnFocus
          />
          <Text style={styles.outOf}>/{totalMarks}</Text>
        </View>
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
        <Text style={styles.navTitle}>Upload Marks</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderStudent}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 92 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <>
            {/* ── Exam Details Card ── */}
            <View style={styles.configCard}>
              <Text style={styles.cardTitle}>Exam Details</Text>
              <Text style={styles.cardSubtitle}>Select exam information and enter marks.</Text>

              {/* Subject */}
              <Text style={styles.fieldLabel}>Subject</Text>
              <Pressable
                onPress={() => setSubjectDropdown(true)}
                style={({ pressed }) => [styles.dropdownBtn, pressed && { opacity: 0.85 }]}
              >
                <Text style={styles.dropdownBtnText}>{selectedSubject}</Text>
                <ChevronDown size={16} color="#687080" />
              </Pressable>

              {/* Exam Type */}
              <Text style={[styles.fieldLabel, styles.fieldLabelMargin]}>Exam Type</Text>
              <Pressable
                onPress={() => setExamDropdown(true)}
                style={({ pressed }) => [styles.dropdownBtn, pressed && { opacity: 0.85 }]}
              >
                <Text style={styles.dropdownBtnText}>{selectedExamType}</Text>
                <ChevronDown size={16} color="#687080" />
              </Pressable>

              {/* Total Marks */}
              <Text style={[styles.fieldLabel, styles.fieldLabelMargin]}>Total Marks</Text>
              <TextInput
                style={styles.totalMarksInput}
                keyboardType="numeric"
                value={totalMarks}
                onChangeText={setTotalMarks}
                maxLength={3}
                placeholder="100"
                placeholderTextColor="#C0BAB0"
                selectTextOnFocus
              />

              {/* Progress Row */}
              <View style={styles.progressRow}>
                <Text style={styles.progressText}>
                  {filledCount} / {students.length} marks filled
                </Text>
                <Text style={styles.progressPercent}>{progressPercent}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
              </View>
            </View>

            {/* ── Student Marks header ── */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>Student Marks</Text>
                <Text style={styles.sectionSubtitle}>Enter marks for each student.</Text>
              </View>
              <Pressable
                onPress={handleAutoFill}
                style={({ pressed }) => [styles.autoFillBtn, pressed && { opacity: 0.8 }]}
                accessibilityLabel="Auto Fill"
                accessibilityRole="button"
              >
                <Zap size={13} color="#F28C28" strokeWidth={2} />
                <Text style={styles.autoFillText}>Auto Fill</Text>
              </Pressable>
            </View>

            {/* Column Labels */}
            <View style={styles.columnLabels}>
              <Text style={styles.columnLabelLeft}>Student</Text>
              <Text style={styles.columnLabelRight}>Marks (/{totalMarks})</Text>
            </View>

            {/* Card wrapper starts here — rows will be rendered inside */}
            <View style={styles.studentListCard} />
          </>
        }
        ListHeaderComponentStyle={styles.listHeaderWrapper}
      />

      {/* Bottom Submit Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View style={styles.bottomInfo}>
          <Text style={styles.bottomLabel}>EXAM</Text>
          <Text style={styles.bottomValue} numberOfLines={1}>
            {selectedExamType} • {selectedSubject}
          </Text>
        </View>
        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.88, transform: [{ scale: 0.97 }] }]}
          accessibilityLabel="Upload Marks"
          accessibilityRole="button"
        >
          <Upload size={15} color="#fff" strokeWidth={2.2} />
          <Text style={styles.submitBtnText}>Upload Marks</Text>
        </Pressable>
      </View>

      {/* Subject Modal */}
      <Modal visible={subjectDropdown} transparent animationType="fade" onRequestClose={() => setSubjectDropdown(false)}>
        <Pressable style={styles.overlay} onPress={() => setSubjectDropdown(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Subject</Text>
            <View style={styles.modalDivider} />
            {examSubjects.map((s) => (
              <Pressable
                key={s}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedSubject(s);
                  setSubjectDropdown(false);
                }}
                style={({ pressed }) => [
                  styles.modalOption,
                  selectedSubject === s && styles.modalOptionActive,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={[styles.modalOptionText, selectedSubject === s && styles.modalOptionTextActive]}>
                  {s}
                </Text>
                {selectedSubject === s && <Check size={16} color="#F2A51A" />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Exam Type Modal */}
      <Modal visible={examDropdown} transparent animationType="fade" onRequestClose={() => setExamDropdown(false)}>
        <Pressable style={styles.overlay} onPress={() => setExamDropdown(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Exam Type</Text>
            <View style={styles.modalDivider} />
            {examTypes.map((e) => (
              <Pressable
                key={e}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedExamType(e);
                  setExamDropdown(false);
                }}
                style={({ pressed }) => [
                  styles.modalOption,
                  selectedExamType === e && styles.modalOptionActive,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={[styles.modalOptionText, selectedExamType === e && styles.modalOptionTextActive]}>
                  {e}
                </Text>
                {selectedExamType === e && <Check size={16} color="#F2A51A" />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
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
  listHeaderWrapper: {},

  /* Exam Details Card */
  configCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#EEEAD8',
  },
  cardTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 15,
    color: '#172033',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#687080',
    marginBottom: 14,
  },
  fieldLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#687080',
    marginBottom: 6,
  },
  fieldLabelMargin: {
    marginTop: 12,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#DDD8C8',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    backgroundColor: '#FAFAF5',
  },
  dropdownBtnText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14,
    color: '#172033',
  },
  totalMarksInput: {
    borderWidth: 1,
    borderColor: '#DDD8C8',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14,
    color: '#172033',
    backgroundColor: '#FAFAF5',
  },

  /* Progress */
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 6,
  },
  progressText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#687080',
  },
  progressPercent: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12,
    color: '#F28C28',
  },
  progressTrack: {
    height: 5,
    backgroundColor: '#F0ECE0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F2A51A',
    borderRadius: 3,
  },

  /* Section Header Row */
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 15,
    color: '#172033',
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#687080',
  },

  autoFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#F28C28',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFF8EF',
  },
  autoFillText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#F28C28',
  },

  /* Column labels */
  columnLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F5F3EB',
    borderRadius: 8,
    marginBottom: 4,
  },
  columnLabelLeft: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 11,
    color: '#687080',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  columnLabelRight: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 11,
    color: '#687080',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Placeholder — actual rows rendered by FlatList
  studentListCard: {},

  /* Student row */
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  studentRowFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  studentRowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  studentRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F0ECE0',
  },
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
  marksInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  marksInput: {
    width: 52,
    height: 36,
    borderWidth: 1,
    borderColor: '#DDD8C8',
    borderRadius: 8,
    paddingHorizontal: 6,
    fontFamily: 'Roboto_700Bold',
    fontSize: 15,
    color: '#172033',
    textAlign: 'center',
    backgroundColor: '#FAFAF5',
  },
  marksInputFilled: {
    borderColor: '#F2A51A',
    backgroundColor: '#FFF9EE',
    color: '#172033',
  },
  outOf: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#687080',
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
  bottomInfo: {
    flex: 1,
    marginRight: 12,
  },
  bottomLabel: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 10,
    color: '#687080',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  bottomValue: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 13,
    color: '#172033',
    marginTop: 1,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#172033',
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 13,
  },

  /* Modals */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#172033',
    marginBottom: 10,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#F0ECE0',
    marginBottom: 6,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  modalOptionActive: {
    backgroundColor: '#FFF9EE',
  },
  modalOptionText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#172033',
  },
  modalOptionTextActive: {
    fontFamily: 'Roboto_700Bold',
    color: '#172033',
  },
});
