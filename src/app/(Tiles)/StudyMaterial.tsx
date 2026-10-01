import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bookmark,
  Check,
  Download,
  FileCode,
  FileSpreadsheet,
  FileText,
  Filter,
  Presentation,
  Search,
  Share2,
  Sparkles,
} from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
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

type Resource = {
  id: string;
  title: string;
  subject: string;
  type: 'PDF' | 'Notes' | 'Slides' | 'Worksheet';
  size: string;
  date: string;
  teacher: string;
  downloads: number;
  isBookmarked: boolean;
  isDownloaded: boolean;
};

const initialResources: Resource[] = [
  {
    id: 'res-1',
    title: 'Chapter 4: Basic Geometrical Ideas Comprehensive Handout',
    subject: 'Mathematics',
    type: 'PDF',
    size: '3.4 MB',
    date: '08 Jun 2026',
    teacher: 'Mr. Arvind Sharma',
    downloads: 124,
    isBookmarked: true,
    isDownloaded: false,
  },
  {
    id: 'res-2',
    title: 'Fibre to Fabric: Plant vs Synthetic Fibres Slide Deck',
    subject: 'Science',
    type: 'Slides',
    size: '8.2 MB',
    date: '05 Jun 2026',
    teacher: 'Mrs. Rekha Gupta',
    downloads: 98,
    isBookmarked: false,
    isDownloaded: true,
  },
  {
    id: 'res-3',
    title: 'Active & Passive Voice Rules & Practice Worksheet with Solutions',
    subject: 'English',
    type: 'Worksheet',
    size: '1.2 MB',
    date: '02 Jun 2026',
    teacher: 'Ms. Sunita Verma',
    downloads: 156,
    isBookmarked: true,
    isDownloaded: false,
  },
  {
    id: 'res-4',
    title: 'Harappan Civilisation: Archaeological Discoveries & Map Points',
    subject: 'SST',
    type: 'Notes',
    size: '4.1 MB',
    date: '28 May 2026',
    teacher: 'Mr. Tariq Khan',
    downloads: 87,
    isBookmarked: false,
    isDownloaded: false,
  },
  {
    id: 'res-5',
    title: 'Scratch 3.0 Game Logic, Coordinates & Variables Guide',
    subject: 'Computers',
    type: 'PDF',
    size: '5.6 MB',
    date: '25 May 2026',
    teacher: 'Mr. Dev Roy',
    downloads: 204,
    isBookmarked: false,
    isDownloaded: true,
  },
  {
    id: 'res-6',
    title: 'Mid-Term Quick Revision Formulas and Key Definitions',
    subject: 'Mathematics',
    type: 'Notes',
    size: '2.1 MB',
    date: '20 May 2026',
    teacher: 'Mr. Arvind Sharma',
    downloads: 312,
    isBookmarked: false,
    isDownloaded: false,
  },
];

const typeColors: Record<string, { bg: string; text: string; icon: any }> = {
  PDF: { bg: '#FEE2E2', text: '#DC2626', icon: FileText },
  Notes: { bg: '#FEF3C7', text: '#B45309', icon: FileText },
  Slides: { bg: '#EDE9FE', text: '#6C4DFF', icon: Presentation },
  Worksheet: { bg: '#E0F2FE', text: '#0284C7', icon: FileSpreadsheet },
};

export default function StudyMaterialScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  const subjectOptions = ['All', 'Mathematics', 'Science', 'English', 'SST', 'Computers'];

  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      const matchSubject = selectedSubject === 'All' || item.subject.toLowerCase() === selectedSubject.toLowerCase();
      const matchSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSubject && matchSearch;
    });
  }, [resources, selectedSubject, searchQuery]);

  const toggleBookmark = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isBookmarked: !r.isBookmarked } : r))
    );
  };

  const handleDownload = (res: Resource) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setResources((prev) =>
      prev.map((r) => (r.id === res.id ? { ...r, isDownloaded: true, downloads: r.downloads + 1 } : r))
    );
    Alert.alert('Download Completed', `"${res.title}" has been saved to offline storage.`);
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
        <Text style={styles.navTitle}>Study Material</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={16} color="#8b4a0dff" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search chapters, notes, worksheets..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {subjectOptions.map((subj) => {
            const isActive = selectedSubject === subj;
            return (
              <Pressable
                key={subj}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedSubject(subj);
                }}
                style={[styles.subjectFilterChip, isActive && styles.subjectFilterChipActive]}
              >
                <Text style={[styles.subjectFilterText, isActive && styles.subjectFilterTextActive]}>
                  {subj}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Section title */}
        <View style={styles.componentHeader}>
          <Text style={styles.componentText}>
            Available Resources ({filteredResources.length})
          </Text>
          <View style={styles.headerLine} />
        </View>

        {/* Resource Cards */}
        {filteredResources.map((item) => {
          const typeConf = typeColors[item.type] ?? { bg: '#F3F4F6', text: '#333', icon: FileText };
          const TypeIcon = typeConf.icon;

          return (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.badgeRow}>
                  <View style={[styles.typeBadge, { backgroundColor: typeConf.bg }]}>
                    <TypeIcon size={12} color={typeConf.text} />
                    <Text style={[styles.typeBadgeText, { color: typeConf.text }]}>{item.type}</Text>
                  </View>
                  <Text style={styles.subjectPill}>{item.subject}</Text>
                </View>

                <Pressable onPress={() => toggleBookmark(item.id)} hitSlop={8}>
                  <Bookmark
                    size={18}
                    color={item.isBookmarked ? '#F59E0B' : '#9CA3AF'}
                    fill={item.isBookmarked ? '#F59E0B' : 'none'}
                  />
                </Pressable>
              </View>

              <Text style={styles.titleText}>{item.title}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>{item.teacher}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaText}>{item.size}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaText}>{item.date}</Text>
              </View>

              <View style={styles.cardBottom}>
                <Text style={styles.downloadCountText}>
                  {item.downloads} downloads
                </Text>

                <Pressable
                  onPress={() => handleDownload(item)}
                  style={({ pressed }) => [
                    styles.downloadBtn,
                    item.isDownloaded ? styles.downloadBtnDone : styles.downloadBtnActive,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  {item.isDownloaded ? (
                    <>
                      <Check size={14} color="#15803D" />
                      <Text style={styles.downloadDoneText}>Downloaded</Text>
                    </>
                  ) : (
                    <>
                      <Download size={14} color="#ffffff" />
                      <Text style={styles.downloadActiveText}>Download</Text>
                    </>
                  )}
                </Pressable>
              </View>
            </View>
          );
        })}
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

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dcd8c8',
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Roboto_400Regular',
    fontSize: 13,
    color: '#100707ff',
  },

  filterScroll: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  subjectFilterChip: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dcd8c8',
  },
  subjectFilterChipActive: {
    backgroundColor: '#1b005a',
    borderColor: '#1b005a',
  },
  subjectFilterText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#555',
  },
  subjectFilterTextActive: {
    fontFamily: 'Roboto_700Bold',
    color: '#ffffff',
    fontWeight: '700',
  },

  componentHeader: { paddingLeft: '1%', marginBottom: 10, marginTop: 4 },
  componentText: { fontFamily: 'Roboto_300Light', fontSize: 18, color: '#222' },
  headerLine: { borderWidth: 1, width: 36, marginTop: 3, borderColor: '#0b2178ff', backgroundColor: '#0b2178ff' },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    padding: 14,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  typeBadgeText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 10,
    fontWeight: '700',
  },
  subjectPill: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 11,
    color: '#666',
    backgroundColor: '#f5f5f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  titleText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: '#100707ff',
    fontWeight: '700',
    lineHeight: 19,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  metaText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#777',
  },
  metaDot: {
    fontSize: 10,
    color: '#bbb',
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0ece0',
    paddingTop: 10,
  },
  downloadCountText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#888',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 7,
  },
  downloadBtnActive: {
    backgroundColor: '#1b005a',
  },
  downloadBtnDone: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
  },
  downloadActiveText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  downloadDoneText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#15803D',
    fontWeight: '600',
  },
});
