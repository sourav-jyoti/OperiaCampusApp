import { mockStudents } from '@/utilities/mockdata';
import type { Student } from '@/utilities/types';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check, ChevronDown, FileBarChart2, School2, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, FlatList, Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const classes = ['VI', 'VII', 'VIII', 'IX', 'X'];
const sections = ['Section A', 'Section B', 'Section C'];
const examTypes = ['Unit Test 1', 'Unit Test 2', 'Mid-Term', 'Final Exam'];

type ReportTheme = {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  preview: string[];
};

const reportThemes: ReportTheme[] = [
  {
    id: 'classic',
    name: 'Classic Blue',
    description: 'Clean, formal layout with navy header and white body.',
    primaryColor: '#0b2178ff',
    accentColor: '#4F6EDE',
    preview: ['#0b2178ff', '#4F6EDE', '#EEF2FF'],
  },
  {
    id: 'warm',
    name: 'Warm Amber',
    description: 'Warm tones with amber accents, perfect for printed reports.',
    primaryColor: '#8b4a0dff',
    accentColor: '#a78104ff',
    preview: ['#8b4a0dff', '#a78104ff', '#feffe0ff'],
  },
  {
    id: 'modern',
    name: 'Modern Green',
    description: 'Fresh, contemporary style with emerald green highlights.',
    primaryColor: '#15803D',
    accentColor: '#22C55E',
    preview: ['#15803D', '#22C55E', '#F0FDF4'],
  },
];

const avatarColors = [
  { bg: '#feffe0ff', text: '#8b4a0dff' },
  { bg: '#EDE9FE', text: '#7C3AED' },
  { bg: '#DCFCE7', text: '#15803D' },
  { bg: '#FEF3C7', text: '#B45309' },
  { bg: '#FCE7F3', text: '#BE185D' },
];

export default function GenerateReportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedClass, setSelectedClass] = useState('VI');
  const [selectedSection, setSelectedSection] = useState('Section A');
  const [selectedExam, setSelectedExam] = useState('Final Exam');

  const [themeSheetVisible, setThemeSheetVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ReportTheme>(reportThemes[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [classModal, setClassModal] = useState(false);
  const [sectionModal, setSectionModal] = useState(false);
  const [examModal, setExamModal] = useState(false);

  const handleGeneratePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setThemeSheetVisible(true);
  };

  const handleProceedGenerate = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setThemeSheetVisible(false);
      setTimeout(() => {
        Alert.alert('Report Generated ✓', `"${selectedExam}" reports for ${selectedClass} ${selectedSection} are ready to print or share.\nTheme: ${selectedTheme.name}`, [{ text: 'OK' }]);
      }, 300);
    }, 1500);
  };

  const SelectorButton = ({ label, value, onPress }: { label: string; value: string; onPress: () => void }) => (
    <View style={styles.selectorGroup}>
      <Text style={styles.configLabel}>{label}</Text>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={({ pressed }) => [styles.dropdownBtn, pressed && { opacity: 0.85 }]}
      >
        <Text style={styles.dropdownBtnText}>{value}</Text>
        <ChevronDown size={16} color="#555" />
      </Pressable>
    </View>
  );

  const initials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2);

  const renderStudent = ({ item, index }: { item: Student; index: number }) => {
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
        <View style={styles.readyBadge}>
          <Check size={14} color="#15803D" />
          <Text style={styles.readyBadgeText}>Ready</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f7f1ff" />

      {/* Header */}
      <View style={styles.topHeader}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }]} hitSlop={8}>
          <ArrowLeft size={20} color="#222" />
        </Pressable>
        <Text style={styles.navTitle}>Generate Report</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={mockStudents}
        keyExtractor={(item) => item.id}
        renderItem={renderStudent}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Section 1: Class & Section */}
            <View style={styles.componentHeader}>
              <Text style={styles.componentText}>Report Configuration</Text>
              <View style={styles.headerLine} />
            </View>

            <View style={styles.card}>
              <View style={styles.cardRow}>
                <View style={[styles.cardIconCircle, { backgroundColor: '#EEF2FF' }]}>
                  <School2 size={18} color="#0b2178ff" />
                </View>
                <Text style={styles.cardSectionTitle}>Class & Section</Text>
              </View>

              <View style={styles.twoColRow}>
                <View style={{ flex: 1 }}>
                  <SelectorButton label="Class" value={selectedClass} onPress={() => setClassModal(true)} />
                </View>
                <View style={{ flex: 2 }}>
                  <SelectorButton label="Section" value={selectedSection} onPress={() => setSectionModal(true)} />
                </View>
              </View>

              <SelectorButton label="Exam / Assessment" value={selectedExam} onPress={() => setExamModal(true)} />
            </View>

            <View style={styles.componentHeader}>
              <Text style={styles.componentText}>Students ({mockStudents.length})</Text>
              <View style={styles.headerLine} />
            </View>
          </>
        }
      />

      {/* Bottom Generate Bar */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <View>
          <Text style={styles.bottomLabel}>TOTAL</Text>
          <Text style={styles.bottomValue}>{mockStudents.length} Reports</Text>
        </View>
        <Pressable onPress={handleGeneratePress} style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.88, transform: [{ scale: 0.97 }] }]}>
          <FileBarChart2 size={16} color="#fff" />
          <Text style={styles.submitBtnText}>Generate</Text>
        </Pressable>
      </View>

      {/* Theme Selection Bottom Sheet Modal */}
      <Modal visible={themeSheetVisible} transparent animationType="slide" onRequestClose={() => setThemeSheetVisible(false)}>
        <View style={styles.sheetOverlay}>
          <Pressable style={styles.sheetDismissArea} onPress={() => setThemeSheetVisible(false)} />
          <View style={[styles.sheetContent, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Select Theme</Text>
            <Text style={styles.sheetSubtitle}>Choose a visual style for the generated reports</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.templatesScrollContent}
              snapToInterval={260 + 16} // card width + gap
              snapToAlignment="start"
              decelerationRate="fast"
            >
              {reportThemes.map((theme) => {
                const isActive = selectedTheme.id === theme.id;
                return (
                  <Pressable
                    key={theme.id}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedTheme(theme);
                    }}
                    style={({ pressed }) => [styles.templateWrapper, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}
                  >
                    <View style={[styles.templateCard, isActive && { borderColor: theme.primaryColor, borderWidth: 2 }]}>
                      {/* Marksheet Template UI */}
                      <View style={[styles.templateHeader, { backgroundColor: theme.primaryColor }]}>
                        <Text style={styles.templateSchoolName}>OPERIA CAMPUS</Text>
                        <Text style={styles.templateReportTitle}>{selectedExam} REPORT</Text>
                      </View>

                      <View style={[styles.templateBody, { backgroundColor: theme.preview[2] || '#fff' }]}>
                        <View style={styles.templateStudentInfo}>
                          <Text style={styles.templateStudentName}>Student Name: Aarav Sharma</Text>
                          <Text style={styles.templateStudentDetails}>
                            Class: {selectedClass} {selectedSection} | Roll: 01
                          </Text>
                        </View>

                        <View style={[styles.templateTable, { borderColor: theme.accentColor + '50' }]}>
                          <View style={[styles.templateTableHeader, { backgroundColor: theme.accentColor + '30', borderBottomColor: theme.accentColor + '50' }]}>
                            <Text style={styles.templateTableCol1}>SUBJECT</Text>
                            <Text style={styles.templateTableCol2}>MARKS</Text>
                            <Text style={styles.templateTableCol3}>GR</Text>
                          </View>
                          {['Mathematics', 'Science', 'English', 'History'].map((sub, i) => (
                            <View key={sub} style={[styles.templateTableRow, { borderBottomColor: theme.accentColor + '20' }]}>
                              <Text style={styles.templateTableText1}>{sub}</Text>
                              <Text style={styles.templateTableText2}>{90 - i * 4}</Text>
                              <Text style={styles.templateTableText3}>A</Text>
                            </View>
                          ))}
                        </View>

                        <View style={[styles.templateTotalRow, { borderTopColor: theme.primaryColor }]}>
                          <Text style={[styles.templateTotalText, { color: theme.primaryColor }]}>Total: 86%</Text>
                          <Text style={[styles.templateTotalText, { color: theme.primaryColor }]}>Result: PASS</Text>
                        </View>
                      </View>

                      {isActive && (
                        <View style={[styles.themeCheckBadge, { backgroundColor: theme.primaryColor }]}>
                          <Check size={14} color="#fff" strokeWidth={3} />
                        </View>
                      )}
                    </View>

                    <Text style={[styles.templateName, isActive && { color: theme.primaryColor }]}>{theme.name}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Pressable
              onPress={handleProceedGenerate}
              disabled={isGenerating}
              style={({ pressed }) => [
                styles.proceedBtn,
                { backgroundColor: selectedTheme.primaryColor },
                pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] },
                isGenerating && { opacity: 0.7 },
              ]}
            >
              <Sparkles size={18} color="#fff" />
              <Text style={styles.proceedBtnText}>{isGenerating ? 'Generating...' : 'Proceed to Generate'}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Selectors Modals */}
      {[
        { visible: classModal, close: () => setClassModal(false), title: 'Select Class', list: classes, current: selectedClass, onSelect: setSelectedClass },
        { visible: sectionModal, close: () => setSectionModal(false), title: 'Select Section', list: sections, current: selectedSection, onSelect: setSelectedSection },
        { visible: examModal, close: () => setExamModal(false), title: 'Select Exam', list: examTypes, current: selectedExam, onSelect: setSelectedExam },
      ].map(({ visible, close, title, list, current, onSelect }) => (
        <Modal key={title} visible={visible} transparent animationType="fade" onRequestClose={close}>
          <Pressable style={styles.overlay} onPress={close}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>{title}</Text>
              <View style={styles.modalDivider} />
              {list.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => {
                    Haptics.selectionAsync();
                    onSelect(item);
                    close();
                  }}
                  style={({ pressed }) => [styles.modalOption, current === item && styles.modalOptionActive, pressed && { opacity: 0.8 }]}
                >
                  <Text style={[styles.modalOptionText, current === item && styles.modalOptionTextActive]}>{item}</Text>
                  {current === item && <Check size={16} color="#1b005a" />}
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
      ))}
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
  navTitle: { fontFamily: 'Roboto_700Bold', fontSize: 17, color: '#100707ff' },
  listContent: { paddingHorizontal: 14, paddingTop: 4 },

  componentHeader: { paddingLeft: '1%', marginBottom: 10, marginTop: 14 },
  componentText: { fontFamily: 'Roboto_300Light', fontSize: 18, color: '#222' },
  headerLine: { borderWidth: 1, width: 36, marginTop: 3, borderColor: '#0b2178ff', backgroundColor: '#0b2178ff' },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    padding: 14,
    marginBottom: 6,
    gap: 12,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardSectionTitle: { fontFamily: 'Roboto_600SemiBold', fontSize: 14, color: '#100707ff' },
  twoColRow: { flexDirection: 'row', gap: 10 },
  selectorGroup: { gap: 6 },
  configLabel: { fontFamily: 'Roboto_400Regular', fontSize: 12, color: '#666', paddingLeft: 2 },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#dcd8c8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fafaf5',
  },
  dropdownBtnText: { fontFamily: 'Roboto_600SemiBold', fontSize: 14, color: '#100707ff' },

  // Students list
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e0d0',
  },
  studentLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  avatarText: { fontFamily: 'Roboto_700Bold', fontSize: 12, fontWeight: '700' },
  studentName: { fontFamily: 'Roboto_600SemiBold', fontSize: 13, color: '#100707ff' },
  rollNo: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#777', marginTop: 1 },
  readyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  readyBadgeText: { fontFamily: 'Roboto_600SemiBold', fontSize: 11, color: '#15803D' },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
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
  bottomLabel: { fontFamily: 'Roboto_400Regular', fontSize: 10, color: '#888', letterSpacing: 0.5 },
  bottomValue: { fontFamily: 'Roboto_600SemiBold', fontSize: 13, color: '#100707ff', marginTop: 1 },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1b005a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitBtnText: { color: '#fff', fontFamily: 'Roboto_600SemiBold', fontSize: 13 },

  // Bottom Sheet
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheetDismissArea: { flex: 1 },
  sheetContent: {
    backgroundColor: '#f7f7f1ff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 0,
  },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#ccc', borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  sheetTitle: { fontFamily: 'Roboto_700Bold', fontSize: 18, color: '#100707ff', marginBottom: 4, paddingHorizontal: 20 },
  sheetSubtitle: { fontFamily: 'Roboto_400Regular', fontSize: 13, color: '#666', marginBottom: 20, paddingHorizontal: 20 },

  // Template Cards
  templatesScrollContent: { paddingHorizontal: 20, gap: 16, marginBottom: 24 },
  templateWrapper: { width: 260 },
  templateCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  templateName: { fontFamily: 'Roboto_700Bold', fontSize: 14, color: '#555', textAlign: 'center', marginTop: 10 },

  templateHeader: { paddingVertical: 12, alignItems: 'center' },
  templateSchoolName: { fontFamily: 'Roboto_700Bold', fontSize: 13, color: '#fff', letterSpacing: 1 },
  templateReportTitle: { fontFamily: 'Roboto_400Regular', fontSize: 10, color: '#ffffffcc', marginTop: 2, letterSpacing: 0.5 },

  templateBody: { padding: 12, minHeight: 220 },
  templateStudentInfo: { marginBottom: 12 },
  templateStudentName: { fontFamily: 'Roboto_600SemiBold', fontSize: 12, color: '#333' },
  templateStudentDetails: { fontFamily: 'Roboto_400Regular', fontSize: 10, color: '#666', marginTop: 2 },

  templateTable: { borderWidth: 1, borderRadius: 6, overflow: 'hidden', marginBottom: 12 },
  templateTableHeader: { flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 8, borderBottomWidth: 1 },
  templateTableCol1: { flex: 2, fontFamily: 'Roboto_700Bold', fontSize: 9, color: '#333' },
  templateTableCol2: { flex: 1, fontFamily: 'Roboto_700Bold', fontSize: 9, color: '#333', textAlign: 'center' },
  templateTableCol3: { flex: 1, fontFamily: 'Roboto_700Bold', fontSize: 9, color: '#333', textAlign: 'center' },

  templateTableRow: { flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 8, borderBottomWidth: 1 },
  templateTableText1: { flex: 2, fontFamily: 'Roboto_600SemiBold', fontSize: 10, color: '#444' },
  templateTableText2: { flex: 1, fontFamily: 'Roboto_400Regular', fontSize: 10, color: '#555', textAlign: 'center' },
  templateTableText3: { flex: 1, fontFamily: 'Roboto_700Bold', fontSize: 10, color: '#333', textAlign: 'center' },

  templateTotalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 10, marginTop: 'auto' },
  templateTotalText: { fontFamily: 'Roboto_700Bold', fontSize: 12 },

  themeCheckBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },

  proceedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  proceedBtnText: { color: '#fff', fontFamily: 'Roboto_700Bold', fontSize: 15, fontWeight: '700' },

  // Simple Modals
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
  },
  modalTitle: { fontFamily: 'Roboto_700Bold', fontSize: 16, color: '#100707ff', marginBottom: 10 },
  modalDivider: { height: 1, backgroundColor: '#f0ece0', marginBottom: 8 },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  modalOptionActive: { backgroundColor: '#feffe0ff' },
  modalOptionText: { fontFamily: 'Roboto_400Regular', fontSize: 14, color: '#222' },
  modalOptionTextActive: { fontFamily: 'Roboto_700Bold', color: '#1b005a', fontWeight: '700' },
});
