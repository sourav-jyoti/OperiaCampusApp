import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FilePlus,
  GraduationCap,
  Plus,
  Send,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type ScheduledExam = {
  id: string;
  title: string;
  subject: string;
  targetClass: string;
  type: string;
  date: string;
  time: string;
  totalMarks: number;
  passMarks: number;
  status: 'Scheduled' | 'Draft';
};

const initialExams: ScheduledExam[] = [
  {
    id: 'ex-1',
    title: 'Unit Test 2: Algebra & Geometry',
    subject: 'Mathematics',
    targetClass: 'Class VI - B',
    type: 'Unit Test',
    date: '16 Jun 2026',
    time: '10:00 AM – 11:30 AM',
    totalMarks: 50,
    passMarks: 20,
    status: 'Scheduled',
  },
  {
    id: 'ex-2',
    title: 'Term 1 Science Lab Practical',
    subject: 'General Science',
    targetClass: 'Class VI - B',
    type: 'Practical Assessment',
    date: '22 Jun 2026',
    time: '01:00 PM – 02:30 PM',
    totalMarks: 30,
    passMarks: 12,
    status: 'Scheduled',
  },
  {
    id: 'ex-3',
    title: 'English Composition & Grammar Test',
    subject: 'English',
    targetClass: 'Class VI - B',
    type: 'Unit Test',
    date: '28 Jun 2026',
    time: '09:00 AM – 10:30 AM',
    totalMarks: 40,
    passMarks: 16,
    status: 'Draft',
  },
];

export default function CreateExamScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [scheduledExams, setScheduledExams] = useState<ScheduledExam[]>(initialExams);

  // Form states
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [targetClass, setTargetClass] = useState('Class VI - B');
  const [examType, setExamType] = useState('Unit Test');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('');
  const [totalMarks, setTotalMarks] = useState('50');
  const [passMarks, setPassMarks] = useState('20');

  const subjectList = ['Mathematics', 'General Science', 'English', 'Social Studies', 'Computer Science'];
  const typeList = ['Unit Test', 'Mid-Term', 'Practical', 'Quiz'];

  const handleCreateExam = () => {
    if (!title.trim() || !examDate.trim() || !examTime.trim()) {
      Alert.alert('Missing Details', 'Please enter Exam Title, Date, and Time slot.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const newExam: ScheduledExam = {
      id: `ex_${Date.now()}`,
      title: title.trim(),
      subject,
      targetClass,
      type: examType,
      date: examDate.trim(),
      time: examTime.trim(),
      totalMarks: parseInt(totalMarks, 10) || 50,
      passMarks: parseInt(passMarks, 10) || 20,
      status: 'Scheduled',
    };

    setScheduledExams([newExam, ...scheduledExams]);
    setTitle('');
    setExamDate('');
    setExamTime('');
    Alert.alert('Exam Created ✓', `"${newExam.title}" has been scheduled for ${newExam.targetClass}.`);
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
        <Text style={styles.navTitle}>Create Examination</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Form Card */}
        <View style={styles.componentHeader}>
          <Text style={styles.componentText}>New Examination Setup</Text>
          <View style={styles.headerLine} />
        </View>

        <View style={styles.card}>
          {/* Exam Title */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Exam Title *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Mid-Term Assessment 2026"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Subject Pills */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Subject</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
              {subjectList.map((sub) => (
                <Pressable
                  key={sub}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSubject(sub);
                  }}
                  style={[styles.pill, subject === sub && styles.pillActive]}
                >
                  <Text style={[styles.pillText, subject === sub && styles.pillTextActive]}>{sub}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Exam Type Pills */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Assessment Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
              {typeList.map((t) => (
                <Pressable
                  key={t}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setExamType(t);
                  }}
                  style={[styles.pill, examType === t && styles.pillActive]}
                >
                  <Text style={[styles.pillText, examType === t && styles.pillTextActive]}>{t}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Date & Time Row */}
          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Date *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 24 Jun 2026"
                placeholderTextColor="#999"
                value={examDate}
                onChangeText={setExamDate}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Time Slot *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="10:00 AM – 11:30 AM"
                placeholderTextColor="#999"
                value={examTime}
                onChangeText={setExamTime}
              />
            </View>
          </View>

          {/* Marks Row */}
          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Total Marks</Text>
              <TextInput
                style={styles.textInput}
                placeholder="50"
                keyboardType="numeric"
                placeholderTextColor="#999"
                value={totalMarks}
                onChangeText={setTotalMarks}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Pass Marks</Text>
              <TextInput
                style={styles.textInput}
                placeholder="20"
                keyboardType="numeric"
                placeholderTextColor="#999"
                value={passMarks}
                onChangeText={setPassMarks}
              />
            </View>
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleCreateExam}
            style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] }]}
          >
            <FilePlus size={16} color="#ffffff" />
            <Text style={styles.submitBtnText}>Publish Examination Schedule</Text>
          </Pressable>
        </View>

        {/* Existing Scheduled Exams */}
        <View style={styles.componentHeader}>
          <Text style={styles.componentText}>
            Upcoming Scheduled Exams ({scheduledExams.length})
          </Text>
          <View style={styles.headerLine} />
        </View>

        {scheduledExams.map((exam) => (
          <View key={exam.id} style={styles.examCard}>
            <View style={styles.examTopRow}>
              <View style={styles.examBadge}>
                <Text style={styles.examBadgeText}>{exam.type}</Text>
              </View>
              <Text style={styles.examSubjectText}>{exam.subject}</Text>
            </View>

            <Text style={styles.examTitle}>{exam.title}</Text>

            <View style={styles.examDetailsRow}>
              <View style={styles.detailItem}>
                <Calendar size={13} color="#8b4a0dff" />
                <Text style={styles.detailItemText}>{exam.date}</Text>
              </View>
              <View style={styles.detailItem}>
                <Clock size={13} color="#8b4a0dff" />
                <Text style={styles.detailItemText}>{exam.time}</Text>
              </View>
              <View style={styles.detailItem}>
                <GraduationCap size={13} color="#6C4DFF" />
                <Text style={styles.detailItemText}>{exam.targetClass}</Text>
              </View>
            </View>

            <View style={styles.examFooter}>
              <Text style={styles.marksText}>
                Total: <Text style={{ fontFamily: 'Roboto_700Bold', color: '#100707ff' }}>{exam.totalMarks} Marks</Text> (Pass: {exam.passMarks})
              </Text>
              <View style={[styles.statusTag, exam.status === 'Draft' && styles.statusTagDraft]}>
                <Text style={[styles.statusTagText, exam.status === 'Draft' && styles.statusTagTextDraft]}>
                  {exam.status}
                </Text>
              </View>
            </View>
          </View>
        ))}
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

  componentHeader: { paddingLeft: '1%', marginBottom: 10, marginTop: 12 },
  componentText: { fontFamily: 'Roboto_300Light', fontSize: 18, color: '#222' },
  headerLine: { borderWidth: 1, width: 36, marginTop: 3, borderColor: '#0b2178ff', backgroundColor: '#0b2178ff' },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    padding: 14,
    gap: 12,
    marginBottom: 16,
  },
  inputGroup: { gap: 4 },
  inputLabel: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#555',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#dcd8c8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#100707ff',
    backgroundColor: '#fafaf5',
  },
  pillRow: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fafaf5',
    borderWidth: 1,
    borderColor: '#dcd8c8',
  },
  pillActive: {
    backgroundColor: '#1b005a',
    borderColor: '#1b005a',
  },
  pillText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#555',
  },
  pillTextActive: {
    fontFamily: 'Roboto_700Bold',
    color: '#ffffff',
    fontWeight: '700',
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1b005a',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 6,
  },
  submitBtnText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '700',
  },

  examCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    padding: 14,
    marginBottom: 10,
  },
  examTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  examBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  examBadgeText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 10,
    color: '#B45309',
    fontWeight: '700',
  },
  examSubjectText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#666',
  },
  examTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: '#100707ff',
    fontWeight: '700',
    marginBottom: 8,
  },
  examDetailsRow: {
    backgroundColor: '#fafaf5',
    borderRadius: 8,
    padding: 8,
    gap: 4,
    marginBottom: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailItemText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#444',
  },
  examFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0ece0',
    paddingTop: 8,
  },
  marksText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#666',
  },
  statusTag: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusTagDraft: {
    backgroundColor: '#F1F5F9',
  },
  statusTagText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 11,
    color: '#15803D',
  },
  statusTagTextDraft: {
    color: '#64748B',
  },
});
