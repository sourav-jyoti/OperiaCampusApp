import type { AssignmentStatus } from '@/utilities/types';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Upload,
  User,
} from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
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
  status: 'saved' | 'pending';
};

const examSubjects = ['Mathematics', 'Science', 'English', 'Social Studies', 'Computer Science'];
const examTypes = ['Unit Test 1', 'Unit Test 2', 'Mid-Term', 'Final Exam', 'Assignment'];

const mockRoster: StudentMark[] = [
  { id: '1', name: 'Aarav Sharma', rollNo: 'CSE-001', marks: '', status: 'pending' },
  { id: '2', name: 'Ananya Iyer', rollNo: 'CSE-002', marks: '', status: 'pending' },
  { id: '3', name: 'Devansh Verma', rollNo: 'CSE-003', marks: '', status: 'pending' },
  { id: '4', name: 'Ishita Patel', rollNo: 'CSE-004', marks: '', status: 'pending' },
  { id: '5', name: 'Kabir Mukherjee', rollNo: 'CSE-005', marks: '', status: 'pending' },
  { id: '6', name: 'Meera Nair', rollNo: 'CSE-006', marks: '', status: 'pending' },
  { id: '7', name: 'Rohan Gupta', rollNo: 'CSE-007', marks: '', status: 'pending' },
  { id: '8', name: 'Saanvi Kulkarni', rollNo: 'CSE-008', marks: '', status: 'pending' },
  { id: '9', name: 'Vihaan Reddy', rollNo: 'CSE-009', marks: '', status: 'pending' },
  { id: '10', name: 'Zoya Khan', rollNo: 'CSE-010', marks: '', status: 'pending' },
];

const avatarColors = [
  { bg: '#feffe0ff', text: '#8b4a0dff' },
  { bg: '#EDE9FE', text: '#7C3AED' },
  { bg: '#DCFCE7', text: '#15803D' },
  { bg: '#FEF3C7', text: '#B45309' },
  { bg: '#FCE7F3', text: '#BE185D' },
];

export default function UploadMarksScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [students, setStudents] = useState<StudentMark[]>(mockRoster);
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedExamType, setSelectedExamType] = useState('Unit Test 1');
  const [totalMarks, setTotalMarks] = useState('100');
  const [subjectDropdown, setSubjectDropdown] = useState(false);
  const [examDropdown, setExamDropdown] = useState(false);

  const filledCount = useMemo(() => students.filter((s) => s.marks.trim() !== '').length, [students]);

  const updateMarks = (id: string, value: string) => {
    const max = parseInt(totalMarks) || 100;
    const num = parseInt(value);
    if (value !== '' && (isNaN(num) || num < 0 || num > max)) return;
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, marks: value } : s)));
  };

  const handleSubmit = () => {
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
              Alert.alert('Marks Uploaded', `${selectedExamType} marks for ${selectedSubject} have been submitted successfully.`, [
                { text: 'OK', onPress: () => router.back() },
              ]);
            },
          },
        ]
      );
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Marks Uploaded', `${selectedExamType} marks for ${selectedSubject} have been submitted successfully.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  const initials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2);

  const renderStudent = ({ item, index }: { item: StudentMark; index: number }) => {
    const color = avatarColors[index % avatarColors.length];
    return (
      <View style={styles.studentRow}>
        <View style={styles.studentLeft}>
          <View style={[styles.avatar, { backgroundColor: color.bg, borderColor: color.text + '55' }]}>
            <Text style={[styles.avatarText, { color: color.text }]}>{initials(item.name)}</Text>
          </View>
          <View>
            <Text style={styles.studentName}>{item.name}</Text>
            <Text style={styles.rollNo}>{item.rollNo}</Text>
          </View>
        </View>
        <View style={styles.marksInputWrapper}>
          <TextInput
            style={styles.marksInput}
            keyboardType="numeric"
            placeholder="—"
            placeholderTextColor="#bbb"
            value={item.marks}
            onChangeText={(v) => updateMarks(item.id, v)}
            maxLength={3}
          />
          <Text style={styles.outOf}>/{totalMarks}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f7f1ff" />

      <View style={styles.topHeader}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }]}
          hitSlop={8}
        >
          <ArrowLeft size={20} color="#222" />
        </Pressable>
        <Text style={styles.navTitle}>Upload Marks</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderStudent}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Exam Config */}
            <View style={styles.configCard}>
              <View style={styles.componentHeader}>
                <Text style={styles.componentText}>Exam Details</Text>
                <View style={styles.headerLine} />
              </View>

              {/* Subject */}
              <Text style={styles.configLabel}>Subject</Text>
              <Pressable
                onPress={() => setSubjectDropdown(true)}
                style={({ pressed }) => [styles.dropdownBtn, pressed && { opacity: 0.85 }]}
              >
                <Text style={styles.dropdownBtnText}>{selectedSubject}</Text>
                <ChevronDown size={16} color="#555" />
              </Pressable>

              {/* Exam Type */}
              <Text style={[styles.configLabel, { marginTop: 12 }]}>Exam Type</Text>
              <Pressable
                onPress={() => setExamDropdown(true)}
                style={({ pressed }) => [styles.dropdownBtn, pressed && { opacity: 0.85 }]}
              >
                <Text style={styles.dropdownBtnText}>{selectedExamType}</Text>
                <ChevronDown size={16} color="#555" />
              </Pressable>

              {/* Total Marks */}
              <Text style={[styles.configLabel, { marginTop: 12 }]}>Total Marks</Text>
              <TextInput
                style={styles.totalMarksInput}
                keyboardType="numeric"
                value={totalMarks}
                onChangeText={setTotalMarks}
                maxLength={3}
                placeholder="100"
                placeholderTextColor="#bbb"
              />

              {/* Progress Badge */}
              <View style={styles.progressBadge}>
                <Text style={styles.progressBadgeText}>
                  {filledCount} / {students.length} filled
                </Text>
              </View>
            </View>

            <View style={styles.componentHeader}>
              <Text style={styles.componentText}>Student Marks</Text>
              <View style={styles.headerLine} />
            </View>
          </>
        }
      />

      {/* Bottom Submit */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View>
          <Text style={styles.bottomLabel}>EXAM</Text>
          <Text style={styles.bottomValue}>{selectedExamType} • {selectedSubject}</Text>
        </View>
        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.88, transform: [{ scale: 0.97 }] }]}
        >
          <Upload size={16} color="#fff" />
          <Text style={styles.submitBtnText}>Upload</Text>
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
                onPress={() => { Haptics.selectionAsync(); setSelectedSubject(s); setSubjectDropdown(false); }}
                style={({ pressed }) => [styles.modalOption, selectedSubject === s && styles.modalOptionActive, pressed && { opacity: 0.8 }]}
              >
                <Text style={[styles.modalOptionText, selectedSubject === s && styles.modalOptionTextActive]}>{s}</Text>
                {selectedSubject === s && <Check size={16} color="#1b005a" />}
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
                onPress={() => { Haptics.selectionAsync(); setSelectedExamType(e); setExamDropdown(false); }}
                style={({ pressed }) => [styles.modalOption, selectedExamType === e && styles.modalOptionActive, pressed && { opacity: 0.8 }]}
              >
                <Text style={[styles.modalOptionText, selectedExamType === e && styles.modalOptionTextActive]}>{e}</Text>
                {selectedExamType === e && <Check size={16} color="#1b005a" />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7f7f1ff' },
  topHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#f7f7f1ff',
  },
  backButton: {
    width: 36, height: 36, borderRadius: 11, backgroundColor: '#ffffff',
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#dcd8c8',
  },
  navTitle: { fontFamily: 'Roboto_700Bold', fontSize: 17, color: '#100707ff' },
  listContent: { paddingHorizontal: 14, paddingTop: 4 },

  componentHeader: { paddingLeft: '1%', marginBottom: 10, marginTop: 14 },
  componentText: { fontFamily: 'Roboto_300Light', fontSize: 18, color: '#222' },
  headerLine: { borderWidth: 1, width: 36, marginTop: 3, borderColor: '#0b2178ff', backgroundColor: '#0b2178ff' },

  configCard: {
    backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1,
    borderColor: '#dbbfa5ff', padding: 14, marginBottom: 6,
  },
  configLabel: { fontFamily: 'Roboto_400Regular', fontSize: 12, color: '#666', marginBottom: 6 },
  dropdownBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#dcd8c8', borderRadius: 8, paddingHorizontal: 12,
    paddingVertical: 10, backgroundColor: '#fafaf5',
  },
  dropdownBtnText: { fontFamily: 'Roboto_600SemiBold', fontSize: 14, color: '#100707ff' },
  totalMarksInput: {
    borderWidth: 1, borderColor: '#dcd8c8', borderRadius: 8, paddingHorizontal: 12,
    paddingVertical: 10, fontFamily: 'Roboto_600SemiBold', fontSize: 14, color: '#100707ff',
    backgroundColor: '#fafaf5',
  },
  progressBadge: {
    alignSelf: 'flex-start', backgroundColor: '#feffe0ff', borderWidth: 1, borderColor: '#895f05de',
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, marginTop: 12,
  },
  progressBadgeText: { fontFamily: 'Roboto_600SemiBold', fontSize: 12, color: '#8b4a0dff' },

  studentRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#ffffff', borderRadius: 8, padding: 10, marginBottom: 8,
    borderWidth: 1, borderColor: '#e5e0d0',
  },
  studentLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  avatar: {
    width: 36, height: 36, borderRadius: 18, justifyContent: 'center',
    alignItems: 'center', borderWidth: 1,
  },
  avatarText: { fontFamily: 'Roboto_700Bold', fontSize: 12, fontWeight: '700' },
  studentName: { fontFamily: 'Roboto_600SemiBold', fontSize: 13, color: '#100707ff' },
  rollNo: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#777', marginTop: 1 },
  marksInputWrapper: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  marksInput: {
    width: 54, borderWidth: 1, borderColor: '#0b2178ff', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 6, fontFamily: 'Roboto_700Bold',
    fontSize: 15, color: '#1b005a', textAlign: 'center', backgroundColor: '#f0f0fc',
  },
  outOf: { fontFamily: 'Roboto_400Regular', fontSize: 12, color: '#888' },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#dcd8c8',
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 4,
  },
  bottomLabel: { fontFamily: 'Roboto_400Regular', fontSize: 10, color: '#888', letterSpacing: 0.5 },
  bottomValue: { fontFamily: 'Roboto_600SemiBold', fontSize: 13, color: '#100707ff', marginTop: 1 },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#1b005a',
    paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8,
  },
  submitBtnText: { color: '#fff', fontFamily: 'Roboto_600SemiBold', fontSize: 13 },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalCard: {
    width: '100%', backgroundColor: '#fff', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#dbbfa5ff',
  },
  modalTitle: { fontFamily: 'Roboto_700Bold', fontSize: 16, color: '#100707ff', marginBottom: 10 },
  modalDivider: { height: 1, backgroundColor: '#f0ece0', marginBottom: 8 },
  modalOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 11, paddingHorizontal: 8, borderRadius: 8,
  },
  modalOptionActive: { backgroundColor: '#feffe0ff' },
  modalOptionText: { fontFamily: 'Roboto_400Regular', fontSize: 14, color: '#222' },
  modalOptionTextActive: { fontFamily: 'Roboto_700Bold', color: '#1b005a', fontWeight: '700' },
});
