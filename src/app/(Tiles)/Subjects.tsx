import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronRight,
  Download,
  GraduationCap,
  Sparkles,
  User,
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

type Subject = {
  id: string;
  name: string;
  code: string;
  teacher: string;
  periodsPerWeek: number;
  progressPercent: number;
  completedChapters: number;
  totalChapters: number;
  nextTopic: string;
  color: string;
  badgeBg: string;
  chapters: { id: string; name: string; completed: boolean }[];
};

const mockSubjects: Subject[] = [
  {
    id: 's1',
    name: 'Mathematics',
    code: 'MATH-601',
    teacher: 'Mr. Arvind Sharma',
    periodsPerWeek: 6,
    progressPercent: 65,
    completedChapters: 8,
    totalChapters: 12,
    nextTopic: 'Linear Equations in One Variable',
    color: '#0b2178ff',
    badgeBg: '#EEF2FF',
    chapters: [
      { id: 'c1', name: 'Knowing Our Numbers', completed: true },
      { id: 'c2', name: 'Whole Numbers', completed: true },
      { id: 'c3', name: 'Playing with Numbers', completed: true },
      { id: 'c4', name: 'Basic Geometrical Ideas', completed: true },
      { id: 'c5', name: 'Understanding Elementary Shapes', completed: true },
      { id: 'c6', name: 'Integers', completed: true },
      { id: 'c7', name: 'Fractions', completed: true },
      { id: 'c8', name: 'Decimals', completed: true },
      { id: 'c9', name: 'Data Handling', completed: false },
      { id: 'c10', name: 'Mensuration', completed: false },
      { id: 'c11', name: 'Algebra Introduction', completed: false },
      { id: 'c12', name: 'Ratio and Proportion', completed: false },
    ],
  },
  {
    id: 's2',
    name: 'General Science',
    code: 'SCI-602',
    teacher: 'Mrs. Rekha Gupta',
    periodsPerWeek: 5,
    progressPercent: 55,
    completedChapters: 6,
    totalChapters: 11,
    nextTopic: 'Components of Food & Nutrients',
    color: '#15803D',
    badgeBg: '#DCFCE7',
    chapters: [
      { id: 'sc1', name: 'Food: Where Does It Come From?', completed: true },
      { id: 'sc2', name: 'Components of Food', completed: true },
      { id: 'sc3', name: 'Fibre to Fabric', completed: true },
      { id: 'sc4', name: 'Sorting Materials into Groups', completed: true },
      { id: 'sc5', name: 'Separation of Substances', completed: true },
      { id: 'sc6', name: 'Changes Around Us', completed: true },
      { id: 'sc7', name: 'Getting to Know Plants', completed: false },
      { id: 'sc8', name: 'Body Movements', completed: false },
      { id: 'sc9', name: 'The Living Organisms & Surroundings', completed: false },
      { id: 'sc10', name: 'Motion and Measurement of Distances', completed: false },
      { id: 'sc11', name: 'Light, Shadows and Reflections', completed: false },
    ],
  },
  {
    id: 's3',
    name: 'English Language & Literature',
    code: 'ENG-603',
    teacher: 'Ms. Sunita Verma',
    periodsPerWeek: 5,
    progressPercent: 80,
    completedChapters: 8,
    totalChapters: 10,
    nextTopic: 'Active & Passive Voice in Composition',
    color: '#7C3AED',
    badgeBg: '#EDE9FE',
    chapters: [
      { id: 'e1', name: 'A Tale of Two Birds', completed: true },
      { id: 'e2', name: 'The Friendly Mongoose', completed: true },
      { id: 'e3', name: "The Shepherd's Treasure", completed: true },
      { id: 'e4', name: 'Tansen', completed: true },
      { id: 'e5', name: 'The Monkey and the Crocodile', completed: true },
      { id: 'e6', name: 'The Wonder Called Sleep', completed: true },
      { id: 'e7', name: 'A Pact with the Sun', completed: true },
      { id: 'e8', name: 'Formal Letter Writing', completed: true },
      { id: 'e9', name: 'Voice & Direct Speech', completed: false },
      { id: 'e10', name: 'Reading Comprehension', completed: false },
    ],
  },
  {
    id: 's4',
    name: 'Social Studies',
    code: 'SST-604',
    teacher: 'Mr. Tariq Khan',
    periodsPerWeek: 4,
    progressPercent: 50,
    completedChapters: 5,
    totalChapters: 10,
    nextTopic: 'In the Earliest Cities (Harappa)',
    color: '#B45309',
    badgeBg: '#FEF3C7',
    chapters: [
      { id: 'sst1', name: 'What, Where, How and When?', completed: true },
      { id: 'sst2', name: 'From Hunting-Gathering to Growing Food', completed: true },
      { id: 'sst3', name: 'In the Earliest Cities', completed: true },
      { id: 'sst4', name: 'The Earth in the Solar System', completed: true },
      { id: 'sst5', name: 'Globe: Latitudes and Longitudes', completed: true },
      { id: 'sst6', name: 'Motions of the Earth', completed: false },
      { id: 'sst7', name: 'Maps and Symbols', completed: false },
      { id: 'sst8', name: 'Major Domains of the Earth', completed: false },
      { id: 'sst9', name: 'Understanding Diversity', completed: false },
      { id: 'sst10', name: 'Diversity and Discrimination', completed: false },
    ],
  },
  {
    id: 's5',
    name: 'Computer Science & Coding',
    code: 'CS-605',
    teacher: 'Mr. Dev Roy',
    periodsPerWeek: 3,
    progressPercent: 75,
    completedChapters: 6,
    totalChapters: 8,
    nextTopic: 'Scratch 3.0 Game Loops & Variables',
    color: '#0284C7',
    badgeBg: '#E0F2FE',
    chapters: [
      { id: 'cs1', name: 'Computer System Overview', completed: true },
      { id: 'cs2', name: 'Operating System Basics', completed: true },
      { id: 'cs3', name: 'File Management in Windows', completed: true },
      { id: 'cs4', name: 'Introduction to Algorithms', completed: true },
      { id: 'cs5', name: 'Block-based Coding with Scratch', completed: true },
      { id: 'cs6', name: 'Working with Sprites and Sound', completed: true },
      { id: 'cs7', name: 'Conditionals and Loops', completed: false },
      { id: 'cs8', name: 'Internet Safety and Netiquette', completed: false },
    ],
  },
];

export default function SubjectsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedTerm, setSelectedTerm] = useState<'Term 1' | 'Term 2'>('Term 1');
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);

  const totalWeeklyPeriods = mockSubjects.reduce((acc, s) => acc + s.periodsPerWeek, 0);

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
        <Text style={styles.navTitle}>Academic Subjects</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Term Switcher */}
        <View style={styles.termRow}>
          {(['Term 1', 'Term 2'] as const).map((term) => (
            <Pressable
              key={term}
              onPress={() => {
                Haptics.selectionAsync();
                setSelectedTerm(term);
              }}
              style={[styles.termBtn, selectedTerm === term && styles.termBtnActive]}
            >
              <Text style={[styles.termBtnText, selectedTerm === term && styles.termBtnTextActive]}>
                {term} {term === 'Term 1' ? '(Active)' : ''}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Quick Highlights Banner */}
        <View style={styles.highlightBanner}>
          <View style={styles.highlightItem}>
            <Text style={styles.highlightVal}>{mockSubjects.length}</Text>
            <Text style={styles.highlightLbl}>Total Subjects</Text>
          </View>
          <View style={styles.highlightDivider} />
          <View style={styles.highlightItem}>
            <Text style={styles.highlightVal}>{totalWeeklyPeriods}</Text>
            <Text style={styles.highlightLbl}>Periods/Week</Text>
          </View>
          <View style={styles.highlightDivider} />
          <View style={styles.highlightItem}>
            <Text style={styles.highlightVal}>65%</Text>
            <Text style={styles.highlightLbl}>Avg Progress</Text>
          </View>
        </View>

        {/* Section title */}
        <View style={styles.componentHeader}>
          <Text style={styles.componentText}>Enrolled Courses</Text>
          <View style={styles.headerLine} />
        </View>

        {/* Subjects List */}
        {mockSubjects.map((sub) => (
          <Pressable
            key={sub.id}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActiveSubject(sub);
            }}
            style={({ pressed }) => [styles.subjectCard, pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] }]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.codeBadge, { backgroundColor: sub.badgeBg }]}>
                <Text style={[styles.codeText, { color: sub.color }]}>{sub.code}</Text>
              </View>
              <Text style={styles.periodBadge}>{sub.periodsPerWeek} Periods/wk</Text>
            </View>

            <Text style={styles.subjectName}>{sub.name}</Text>

            <View style={styles.teacherRow}>
              <User size={13} color="#666" />
              <Text style={styles.teacherName}>{sub.teacher}</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressStatusText}>
                  {sub.completedChapters} of {sub.totalChapters} Chapters Completed
                </Text>
                <Text style={[styles.progressPercentText, { color: sub.color }]}>
                  {sub.progressPercent}%
                </Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${sub.progressPercent}%`, backgroundColor: sub.color },
                  ]}
                />
              </View>
            </View>

            {/* Next Topic */}
            <View style={styles.nextTopicBox}>
              <Text style={styles.nextTopicLabel}>UP NEXT:</Text>
              <Text style={styles.nextTopicText} numberOfLines={1}>
                {sub.nextTopic}
              </Text>
              <ChevronRight size={14} color="#888" />
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Chapter Breakdown Modal */}
      <Modal visible={activeSubject !== null} transparent animationType="slide" onRequestClose={() => setActiveSubject(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setActiveSubject(null)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {activeSubject && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>{activeSubject.name}</Text>
                    <Text style={styles.modalSubtitle}>{activeSubject.code} • {activeSubject.teacher}</Text>
                  </View>
                  <Pressable onPress={() => setActiveSubject(null)} hitSlop={10}>
                    <X size={20} color="#333" />
                  </Pressable>
                </View>

                <View style={styles.syllabusActions}>
                  <Pressable
                    onPress={() => {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      Alert.alert('Download Started', `${activeSubject.name} curriculum PDF saved to downloads.`);
                    }}
                    style={styles.downloadSyllabusBtn}
                  >
                    <Download size={14} color="#1b005a" />
                    <Text style={styles.downloadSyllabusText}>Download Syllabus PDF</Text>
                  </Pressable>
                </View>

                <Text style={styles.chapterSectionTitle}>Chapter-wise Breakdown</Text>

                <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 350 }}>
                  {activeSubject.chapters.map((ch, idx) => (
                    <View key={ch.id} style={styles.chapterItem}>
                      <View style={styles.chapterLeft}>
                        <View style={[styles.chapterNumBox, ch.completed && styles.chapterNumBoxDone]}>
                          <Text style={[styles.chapterNumText, ch.completed && styles.chapterNumTextDone]}>
                            {idx + 1}
                          </Text>
                        </View>
                        <Text style={[styles.chapterTitle, ch.completed && styles.chapterTitleDone]}>
                          {ch.name}
                        </Text>
                      </View>
                      <CheckCircle
                        size={18}
                        color={ch.completed ? '#15803D' : '#CBD5E1'}
                      />
                    </View>
                  ))}
                </ScrollView>
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

  termRow: {
    flexDirection: 'row',
    backgroundColor: '#EBE7D8',
    borderRadius: 9,
    padding: 3,
    marginBottom: 16,
  },
  termBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 7,
  },
  termBtnActive: {
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  termBtnText: { fontFamily: 'Roboto_400Regular', fontSize: 13, color: '#666' },
  termBtnTextActive: { fontFamily: 'Roboto_700Bold', color: '#1b005a', fontWeight: '700' },

  highlightBanner: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e0d0',
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  highlightItem: { alignItems: 'center' },
  highlightVal: { fontFamily: 'Roboto_700Bold', fontSize: 20, color: '#100707ff', fontWeight: '700' },
  highlightLbl: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#777', marginTop: 2 },
  highlightDivider: { width: 1, height: 26, backgroundColor: '#E5E7EB' },

  componentHeader: { paddingLeft: '1%', marginBottom: 10, marginTop: 4 },
  componentText: { fontFamily: 'Roboto_300Light', fontSize: 18, color: '#222' },
  headerLine: { borderWidth: 1, width: 36, marginTop: 3, borderColor: '#0b2178ff', backgroundColor: '#0b2178ff' },

  subjectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    padding: 14,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  codeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  codeText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 11,
    fontWeight: '700',
  },
  periodBadge: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#777',
  },
  subjectName: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#100707ff',
    fontWeight: '700',
    marginBottom: 4,
  },
  teacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  teacherName: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#555',
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressStatusText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#666',
  },
  progressPercentText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: '#f0ece0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  nextTopicBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafaf5',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
  },
  nextTopicLabel: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 10,
    color: '#8b4a0dff',
    fontWeight: '700',
  },
  nextTopicText: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#333',
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
    marginBottom: 12,
  },
  modalTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#100707ff',
    fontWeight: '700',
  },
  modalSubtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  syllabusActions: {
    marginBottom: 14,
  },
  downloadSyllabusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fafaf5',
    borderWidth: 1,
    borderColor: '#dcd8c8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  downloadSyllabusText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#1b005a',
    fontWeight: '600',
  },
  chapterSectionTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13,
    color: '#333',
    fontWeight: '700',
    marginBottom: 10,
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0ece0',
  },
  chapterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    paddingRight: 10,
  },
  chapterNumBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chapterNumBoxDone: {
    backgroundColor: '#DCFCE7',
  },
  chapterNumText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  chapterNumTextDone: {
    color: '#15803D',
  },
  chapterTitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#222',
    flex: 1,
  },
  chapterTitleDone: {
    color: '#666',
  },
});
