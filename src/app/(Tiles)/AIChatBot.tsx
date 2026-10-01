import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Award,
  BookOpen,
  Bot,
  Calendar,
  CheckCircle2,
  FileBarChart2,
  RotateCcw,
  Send,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';

interface TeacherFeedback {
  date: string;
  teacher: string;
  subject: string;
  feedback: string;
}

interface ExamScore {
  examName: string;
  period: string;
  totalMarks: string;
  percentage: string;
  grade: string;
  subjects: { name: string; score: string; max: string }[];
}

interface Extracurricular {
  title: string;
  category: string;
  achievement: string;
  badge: string;
  iconBg: string;
}

interface StudentDetailData {
  name: string;
  class: string;
  section: string;
  rollNo: string;
  admNo: string;
  attendanceRate: string;
  overallGrade: string;
  teacherFeedback: TeacherFeedback[];
  examScores: ExamScore[];
  extracurriculars: Extracurricular[];
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text?: string;
  isStudentDetail?: boolean;
  studentData?: StudentDetailData;
}

const DEMO_STUDENT_DATA: StudentDetailData = {
  name: 'Sourav',
  class: 'Class 6',
  section: 'Section A',
  rollNo: '13',
  admNo: 'SIS-2024-0613',
  attendanceRate: '96.5%',
  overallGrade: 'A+ (93.4%)',
  teacherFeedback: [
    {
      date: '24 Sep 2026',
      teacher: 'Mrs. Ananya Sharma',
      subject: 'Class Teacher & Mathematics',
      feedback:
        'Demonstrates sharp mathematical acumen and logical problem-solving. Consistently punctual, respectful to peers, and actively participates in classroom discussions.',
    },
    {
      date: '18 Aug 2026',
      teacher: 'Mr. Rajesh Verma',
      subject: 'Science (Physics & Chemistry)',
      feedback:
        'Shows great curiosity during practical laboratory experiments. Lab journal is neatly organized with accurate observations on Light & Reflection.',
    },
    {
      date: '12 Jul 2026',
      teacher: 'Ms. Priya Sen',
      subject: 'English Language & Literature',
      feedback:
        'Excellent articulation in creative writing essays and reading comprehension. Commended for fluency in the inter-house elocution competition.',
    },
  ],
  examScores: [
    {
      examName: 'Mid-Term Examination',
      period: 'September 2026',
      totalMarks: '467 / 500',
      percentage: '93.4%',
      grade: 'Grade A+',
      subjects: [
        { name: 'Mathematics', score: '98', max: '100' },
        { name: 'Science', score: '95', max: '100' },
        { name: 'Computer Science', score: '96', max: '100' },
        { name: 'English', score: '89', max: '100' },
        { name: 'Social Studies', score: '89', max: '100' },
      ],
    },
    {
      examName: 'Unit Test 2',
      period: 'November 2026',
      totalMarks: '96 / 100',
      percentage: '96.0%',
      grade: 'Grade A+',
      subjects: [
        { name: 'Mathematics', score: '25', max: '25' },
        { name: 'Science', score: '24', max: '25' },
        { name: 'English', score: '24', max: '25' },
        { name: 'Social Studies', score: '23', max: '25' },
      ],
    },
    {
      examName: 'Unit Test 1',
      period: 'July 2026',
      totalMarks: '90 / 100',
      percentage: '90.0%',
      grade: 'Grade A',
      subjects: [
        { name: 'Mathematics', score: '24', max: '25' },
        { name: 'Science', score: '23', max: '25' },
        { name: 'English', score: '22', max: '25' },
        { name: 'Social Studies', score: '21', max: '25' },
      ],
    },
  ],
  extracurriculars: [
    {
      title: 'Inter-School Robotics Championship 2026',
      category: 'STEM & Robotics',
      achievement: '🥇 1st Place - Gold Medalist (Junior Autonomous Rover)',
      badge: 'Gold',
      iconBg: '#FEF3C7',
    },
    {
      title: 'School Football Team (Junior Wing)',
      category: 'Sports & Athletics',
      achievement: '⚽ Starting Midfielder - District Interschool Finalist',
      badge: 'Team Rep',
      iconBg: '#DCFCE7',
    },
    {
      title: 'Annual Campus Science Exhibition',
      category: 'Innovation',
      achievement: '🔬 Best Project Award: "Automated Solar Micro-Irrigation Model"',
      badge: 'Best Project',
      iconBg: '#E0F2FE',
    },
    {
      title: 'Inter-House Bilingual Debate',
      category: 'Literary Arts',
      achievement: '🎭 Represented Red House; 2nd Place in Junior Category',
      badge: 'Finalist',
      iconBg: '#EDE9FE',
    },
  ],
};

const SUGGESTED_PROMPTS = [
  'tell me about sourav class 6 A roll no 13',
  'Summary of Class 6 A Mid-Term performance',
  'Teacher remarks for Roll No 13',
  'List extracurricular achievements of Sourav',
];

export default function AIChatBotScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      timestamp: 'Just now',
      text: 'Hello! I am your Operia Campus AI Assistant. 🎓\n\nI can retrieve instant student dossiers, exam scorecards, teacher observations, and extracurricular milestones.\n\nTry entering: "tell me about sourav class 6 A roll no 13"',
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
    return () => clearTimeout(timer);
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const rawQuery = (textToSend ?? inputQuery).trim();
    if (!rawQuery) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: rawQuery,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    // Normalize query for matching
    const queryLower = rawQuery.toLowerCase();
    const isSouravQuery =
      queryLower.includes('sourav') ||
      (queryLower.includes('6') && queryLower.includes('13')) ||
      (queryLower.includes('class 6') && queryLower.includes('roll')) ||
      queryLower.includes('roll no 13');

    setTimeout(() => {
      setIsTyping(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (isSouravQuery) {
        const botResponse: Message = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isStudentDetail: true,
          studentData: DEMO_STUDENT_DATA,
        };
        setMessages((prev) => [...prev, botResponse]);
      } else {
        const botResponse: Message = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `I found results related to "${rawQuery}". For full demo records, try searching for Sourav:\n\n👉 "tell me about sourav class 6 A roll no 13"\n\nThis will load teacher feedback logs, exam score breakdowns, and extracurricular achievements!`,
        };
        setMessages((prev) => [...prev, botResponse]);
      }
    }, 800);
  };

  const handleResetChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'Just now',
        text: 'Chat history cleared. What student information or campus record would you like to query?\n\nTip: You can ask: "tell me about sourav class 6 A roll no 13"',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9f9ea" />

      {/* Top Navigation Bar */}
      <View style={styles.topHeader}>
        <View style={styles.headerLeft}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7, transform: [{ scale: 0.94 }] }]}
            hitSlop={8}
            accessibilityLabel="Back"
            accessibilityRole="button"
          >
            <ArrowLeft size={20} color="#172033" />
          </Pressable>

          <View style={styles.headerTitleContainer}>
            <View style={styles.headerTitleRow}>
              <Text style={styles.headerTitle}>Campus AI Bot</Text>
              <View style={styles.onlineBadge}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Active</Text>
              </View>
            </View>
            <Text style={styles.headerSubtitle}>Student Performance & Records</Text>
          </View>
        </View>

        <Pressable
          onPress={handleResetChat}
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.7, transform: [{ scale: 0.94 }] }]}
          hitSlop={8}
          accessibilityLabel="Reset Chat"
          accessibilityRole="button"
        >
          <RotateCcw size={17} color="#687080" />
        </Pressable>
      </View>

      {/* Suggestion Chips Header */}
      <View style={styles.chipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScrollContent}>
          <View style={styles.quickPromptLead}>
            <Sparkles size={13} color="#6C4DFF" />
            <Text style={styles.quickPromptLabel}>Try:</Text>
          </View>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <Pressable
              key={idx}
              onPress={() => handleSend(prompt)}
              style={({ pressed }) => [
                styles.chip,
                idx === 0 && styles.activeDemoChip,
                pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
              ]}
            >
              <Text style={[styles.chipText, idx === 0 && styles.activeDemoChipText]}>
                {prompt}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Chat Messages */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.messagesContainer, { paddingBottom: 16 }]}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg) => {
            if (msg.sender === 'user') {
              return (
                <View key={msg.id} style={styles.userMessageRow}>
                  <View style={styles.userBubble}>
                    <Text style={styles.userText}>{msg.text}</Text>
                    <Text style={styles.userTimestamp}>{msg.timestamp}</Text>
                  </View>
                </View>
              );
            }

            // Assistant standard text message
            if (!msg.isStudentDetail || !msg.studentData) {
              return (
                <View key={msg.id} style={styles.assistantMessageRow}>
                  <View style={styles.botAvatar}>
                    <Bot size={18} color="#6C4DFF" />
                  </View>
                  <View style={styles.assistantBubble}>
                    <View style={styles.assistantHeader}>
                      <Text style={styles.assistantSenderName}>Operia AI</Text>
                      <Text style={styles.assistantTimestamp}>{msg.timestamp}</Text>
                    </View>
                    <Text style={styles.assistantText}>{msg.text}</Text>
                  </View>
                </View>
              );
            }

            // Rich Student Details Output (Requested Demo Format)
            const student = msg.studentData;
            return (
              <View key={msg.id} style={styles.assistantMessageRow}>
                <View style={styles.botAvatar}>
                  <Bot size={18} color="#6C4DFF" />
                </View>

                <View style={styles.studentDetailCard}>
                  {/* Card Header: Student Profile Banner */}
                  <View style={styles.profileBanner}>
                    <View style={styles.profileAvatarBox}>
                      <Text style={styles.profileAvatarText}>{student.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.profileInfoCol}>
                      <View style={styles.profileNameRow}>
                        <Text style={styles.profileName}>{student.name}</Text>
                        <View style={styles.gradeBadge}>
                          <Text style={styles.gradeBadgeText}>{student.overallGrade}</Text>
                        </View>
                      </View>
                      <Text style={styles.profileMeta}>
                        {student.class} {student.section} • Roll No. {student.rollNo}
                      </Text>
                      <Text style={styles.profileSubMeta}>
                        Adm ID: {student.admNo} • Attendance: {student.attendanceRate}
                      </Text>
                    </View>
                  </View>

                  {/* ───────────────────────────────────────────────────────────── */}
                  {/* 1. TEACHER FEEDBACK (BY VARIOUS DATES) */}
                  {/* ───────────────────────────────────────────────────────────── */}
                  <View style={styles.sectionBlock}>
                    <View style={styles.sectionHeaderRow}>
                      <View style={[styles.sectionIconPill, { backgroundColor: '#EDE9FE' }]}>
                        <BookOpen size={14} color="#6C4DFF" />
                      </View>
                      <Text style={styles.sectionTitle}>Feedback Written by Teachers</Text>
                      <View style={styles.sectionBadge}>
                        <Text style={styles.sectionBadgeText}>{student.teacherFeedback.length} Notes</Text>
                      </View>
                    </View>

                    <View style={styles.feedbackList}>
                      {student.teacherFeedback.map((fb, idx) => (
                        <View key={idx} style={styles.feedbackCard}>
                          <View style={styles.feedbackTopRow}>
                            <View style={styles.dateChip}>
                              <Calendar size={11} color="#687080" />
                              <Text style={styles.dateChipText}>{fb.date}</Text>
                            </View>
                            <Text style={styles.feedbackTeacherRole}>{fb.subject}</Text>
                          </View>
                          <Text style={styles.feedbackTeacherName}>{fb.teacher}</Text>
                          <Text style={styles.feedbackBodyText}>"{fb.feedback}"</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* ───────────────────────────────────────────────────────────── */}
                  {/* 2. MARKS OBTAINED IN VARIOUS EXAMS */}
                  {/* ───────────────────────────────────────────────────────────── */}
                  <View style={styles.sectionBlock}>
                    <View style={styles.sectionHeaderRow}>
                      <View style={[styles.sectionIconPill, { backgroundColor: '#FEF3C7' }]}>
                        <FileBarChart2 size={14} color="#B45309" />
                      </View>
                      <Text style={styles.sectionTitle}>Marks Obtained in Various Exams</Text>
                      <View style={styles.sectionBadge}>
                        <Text style={styles.sectionBadgeText}>{student.examScores.length} Exams</Text>
                      </View>
                    </View>

                    <View style={styles.examsList}>
                      {student.examScores.map((exam, idx) => (
                        <View key={idx} style={styles.examCard}>
                          <View style={styles.examCardHeader}>
                            <View>
                              <Text style={styles.examNameText}>{exam.examName}</Text>
                              <Text style={styles.examPeriodText}>{exam.period}</Text>
                            </View>
                            <View style={styles.examScorePill}>
                              <Text style={styles.examScoreText}>{exam.totalMarks}</Text>
                              <Text style={styles.examPercentageText}>({exam.percentage})</Text>
                            </View>
                          </View>

                          <View style={styles.examDivider} />

                          {/* Subjects Grid */}
                          <View style={styles.subjectGrid}>
                            {exam.subjects.map((sub, sIdx) => (
                              <View key={sIdx} style={styles.subjectCell}>
                                <Text style={styles.subjectCellName} numberOfLines={1}>
                                  {sub.name}
                                </Text>
                                <Text style={styles.subjectCellScore}>
                                  {sub.score}
                                  <Text style={styles.subjectCellMax}>/{sub.max}</Text>
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* ───────────────────────────────────────────────────────────── */}
                  {/* 3. EXTRA CURRICULAR ACTIVITIES */}
                  {/* ───────────────────────────────────────────────────────────── */}
                  <View style={styles.sectionBlock}>
                    <View style={styles.sectionHeaderRow}>
                      <View style={[styles.sectionIconPill, { backgroundColor: '#DCFCE7' }]}>
                        <Trophy size={14} color="#15803D" />
                      </View>
                      <Text style={styles.sectionTitle}>Extracurricular Activities</Text>
                      <View style={styles.sectionBadge}>
                        <Text style={styles.sectionBadgeText}>{student.extracurriculars.length} Events</Text>
                      </View>
                    </View>

                    <View style={styles.extraList}>
                      {student.extracurriculars.map((extra, idx) => (
                        <View key={idx} style={styles.extraCard}>
                          <View style={[styles.extraIconBox, { backgroundColor: extra.iconBg }]}>
                            <Award size={18} color="#172033" />
                          </View>
                          <View style={styles.extraInfoCol}>
                            <View style={styles.extraHeaderRow}>
                              <Text style={styles.extraTitle} numberOfLines={1}>
                                {extra.title}
                              </Text>
                              <View style={styles.extraBadge}>
                                <Text style={styles.extraBadgeText}>{extra.badge}</Text>
                              </View>
                            </View>
                            <Text style={styles.extraCategory}>{extra.category}</Text>
                            <Text style={styles.extraAchievement}>{extra.achievement}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Quick Action Footer inside Card */}
                  <View style={styles.cardActionsRow}>
                    <Pressable
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.push('/(Tiles)/GenerateReport');
                      }}
                      style={({ pressed }) => [
                        styles.actionBtnPrimary,
                        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
                      ]}
                    >
                      <FileBarChart2 size={14} color="#FFFFFF" />
                      <Text style={styles.actionBtnPrimaryText}>Generate Report Card</Text>
                    </Pressable>

                    <Pressable
                      onPress={() => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        Alert.alert('Student Record Shared', `Summary for ${student.name} copied to clipboard!`, [
                          { text: 'OK' },
                        ]);
                      }}
                      style={({ pressed }) => [
                        styles.actionBtnSecondary,
                        pressed && { opacity: 0.75, transform: [{ scale: 0.98 }] },
                      ]}
                    >
                      <CheckCircle2 size={14} color="#172033" />
                      <Text style={styles.actionBtnSecondaryText}>Share Summary</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <View style={styles.assistantMessageRow}>
              <View style={styles.botAvatar}>
                <Bot size={18} color="#6C4DFF" />
              </View>
              <View style={styles.typingBubble}>
                <ActivityIndicator size="small" color="#6C4DFF" />
                <Text style={styles.typingText}>Searching campus student records...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Bar */}
        <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          {/* Quick Demo Fill Pill */}
          <Pressable
            onPress={() => {
              setInputQuery('tell me about sourav class 6 A roll no 13');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={({ pressed }) => [
              styles.quickFillPill,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Sparkles size={12} color="#6C4DFF" />
            <Text style={styles.quickFillText}>
              Tap to query: <Text style={styles.quickFillBold}>"sourav class 6 A roll no 13"</Text>
            </Text>
          </Pressable>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={inputQuery}
              onChangeText={setInputQuery}
              placeholder="Ask about a student, class, or marks..."
              placeholderTextColor="#8E95A5"
              returnKeyType="send"
              onSubmitEditing={() => handleSend()}
            />

            {inputQuery.length > 0 && (
              <Pressable
                onPress={() => setInputQuery('')}
                style={styles.clearInputBtn}
                hitSlop={6}
              >
                <X size={15} color="#8E95A5" />
              </Pressable>
            )}

            <Pressable
              onPress={() => handleSend()}
              disabled={!inputQuery.trim()}
              style={({ pressed }) => [
                styles.sendBtn,
                !inputQuery.trim() && styles.sendBtnDisabled,
                pressed && inputQuery.trim() && { opacity: 0.85, transform: [{ scale: 0.94 }] },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Send message"
            >
              <Send size={18} color={inputQuery.trim() ? '#FFFFFF' : '#A0A7B8'} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DDD8C8',
  },
  headerTitleContainer: {
    marginLeft: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 17,
    color: '#172033',
    letterSpacing: -0.3,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#15803D',
  },
  onlineText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 9,
    color: '#15803D',
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#687080',
    marginTop: 1,
  },

  /* Chips */
  chipsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDECDF',
    paddingVertical: 8,
  },
  chipsScrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  quickPromptLead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 2,
  },
  quickPromptLabel: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 11,
    color: '#6C4DFF',
    textTransform: 'uppercase',
  },
  chip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeDemoChip: {
    backgroundColor: '#EDE9FE',
    borderColor: '#DDD6FE',
  },
  chipText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 12,
    color: '#4B5563',
  },
  activeDemoChipText: {
    color: '#5B21B6',
    fontFamily: 'Roboto_700Bold',
  },

  /* Messages Area */
  messagesContainer: {
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  userMessageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 14,
  },
  userBubble: {
    maxWidth: '82%',
    backgroundColor: '#0b2178ff',
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#0b2178ff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  userText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  userTimestamp: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 10,
    color: '#BAC8F3',
    alignSelf: 'flex-end',
    marginTop: 4,
  },

  assistantMessageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 10,
  },
  botAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EDE9FE',
    borderWidth: 1,
    borderColor: '#DDD6FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  assistantBubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderTopLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#EEEAD8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  assistantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  assistantSenderName: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12,
    color: '#6C4DFF',
  },
  assistantTimestamp: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 10,
    color: '#8E95A5',
  },
  assistantText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#172033',
    lineHeight: 19,
  },

  /* Typing Bubble */
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#EEEAD8',
  },
  typingText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#687080',
    fontStyle: 'italic',
  },

  /* ── Student Detail Card ── */
  studentDetailCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2DCF7',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },

  /* Profile Header */
  profileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F6FF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E9E5FF',
    marginBottom: 14,
  },
  profileAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6C4DFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  profileAvatarText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  profileInfoCol: {
    flex: 1,
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  profileName: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 16,
    color: '#172033',
  },
  gradeBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  gradeBadgeText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 11,
    color: '#15803D',
  },
  profileMeta: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#4B5563',
  },
  profileSubMeta: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#687080',
    marginTop: 1,
  },

  /* Section Structure */
  sectionBlock: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  sectionIconPill: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13,
    color: '#172033',
    flex: 1,
  },
  sectionBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  sectionBadgeText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 10,
    color: '#687080',
  },

  /* 1. Teacher Feedback */
  feedbackList: {
    gap: 8,
  },
  feedbackCard: {
    backgroundColor: '#FAFAF8',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EEEAD8',
  },
  feedbackTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateChipText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 11,
    color: '#687080',
  },
  feedbackTeacherRole: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#8E95A5',
  },
  feedbackTeacherName: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#172033',
    marginBottom: 3,
  },
  feedbackBodyText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#374151',
    lineHeight: 17,
    fontStyle: 'italic',
  },

  /* 2. Exams List */
  examsList: {
    gap: 10,
  },
  examCard: {
    backgroundColor: '#FAFAF8',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EEEAD8',
  },
  examCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  examNameText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13,
    color: '#172033',
  },
  examPeriodText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#687080',
    marginTop: 1,
  },
  examScorePill: {
    alignItems: 'flex-end',
  },
  examScoreText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 13,
    color: '#0b2178ff',
  },
  examPercentageText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 10,
    color: '#15803D',
  },
  examDivider: {
    height: 1,
    backgroundColor: '#EBE7D8',
    marginVertical: 8,
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  subjectCell: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#EDE9DE',
    minWidth: '29%',
    flexGrow: 1,
  },
  subjectCellName: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 10,
    color: '#687080',
    marginBottom: 1,
  },
  subjectCellScore: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 12,
    color: '#172033',
  },
  subjectCellMax: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 10,
    color: '#8E95A5',
  },

  /* 3. Extra Curricular */
  extraList: {
    gap: 8,
  },
  extraCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAF8',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EEEAD8',
    gap: 10,
  },
  extraIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraInfoCol: {
    flex: 1,
  },
  extraHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  extraTitle: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#172033',
    flex: 1,
  },
  extraBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  extraBadgeText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 9,
    color: '#B45309',
  },
  extraCategory: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 10,
    color: '#687080',
    marginTop: 1,
  },
  extraAchievement: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 11,
    color: '#15803D',
    marginTop: 2,
  },

  /* Card Actions */
  cardActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEAD8',
  },
  actionBtnPrimary: {
    flex: 1,
    backgroundColor: '#0b2178ff',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionBtnPrimaryText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 11,
    color: '#FFFFFF',
  },
  actionBtnSecondary: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionBtnSecondaryText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 11,
    color: '#172033',
  },

  /* Input Container */
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EDECDF',
    paddingHorizontal: 14,
    paddingTop: 8,
  },
  quickFillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    marginBottom: 8,
    gap: 6,
  },
  quickFillText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#4B5563',
  },
  quickFillBold: {
    fontFamily: 'Roboto_700Bold',
    color: '#5B21B6',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#FAFAF5',
    borderWidth: 1,
    borderColor: '#DDD8C8',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingRight: 36,
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#172033',
  },
  clearInputBtn: {
    position: 'absolute',
    right: 56,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0b2178ff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0b2178ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  sendBtnDisabled: {
    backgroundColor: '#E5E7EB',
    shadowOpacity: 0,
    elevation: 0,
  },
});
