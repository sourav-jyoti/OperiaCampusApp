import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  BookOpen,
  BookMarked,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Search,
  Tag,
  User,
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

type BookStatus = 'available' | 'issued' | 'overdue';

type LibraryBook = {
  id: string;
  title: string;
  author: string;
  subject: string;
  dueDate?: string;
  issuedTo?: string;
  status: BookStatus;
  accessionNo: string;
};

const mockBooks: LibraryBook[] = [
  { id: '1', title: 'Mathematics Class X', author: 'R.D. Sharma', subject: 'Mathematics', status: 'available', accessionNo: 'LIB-001' },
  { id: '2', title: 'Science & Technology', author: 'NCERT', subject: 'Science', status: 'issued', issuedTo: 'Aarav Sharma', dueDate: '10 Oct 2026', accessionNo: 'LIB-002' },
  { id: '3', title: 'English Literature', author: 'Michael West', subject: 'English', status: 'available', accessionNo: 'LIB-003' },
  { id: '4', title: 'History of Ancient India', author: 'Romila Thapar', subject: 'History', status: 'overdue', issuedTo: 'Ananya Iyer', dueDate: '20 Sep 2026', accessionNo: 'LIB-004' },
  { id: '5', title: 'Computer Fundamentals', author: 'Pradeep Sinha', subject: 'Computer Science', status: 'available', accessionNo: 'LIB-005' },
  { id: '6', title: 'Physics Vol. I', author: 'H.C. Verma', subject: 'Physics', status: 'issued', issuedTo: 'Devansh Verma', dueDate: '15 Oct 2026', accessionNo: 'LIB-006' },
  { id: '7', title: 'Social Science Geography', author: 'NCERT', subject: 'Geography', status: 'available', accessionNo: 'LIB-007' },
  { id: '8', title: 'Organic Chemistry', author: 'Morrison & Boyd', subject: 'Chemistry', status: 'overdue', issuedTo: 'Meera Nair', dueDate: '5 Sep 2026', accessionNo: 'LIB-008' },
];

const statusConfig: Record<BookStatus, { color: string; bg: string; label: string }> = {
  available: { color: '#15803D', bg: '#dcfce7', label: 'Available' },
  issued: { color: '#b45309', bg: '#fef3c7', label: 'Issued' },
  overdue: { color: '#c62828', bg: '#ffebee', label: 'Overdue' },
};

const subjectColors: Record<string, string> = {
  Mathematics: '#0b2178ff',
  Science: '#15803D',
  English: '#7C3AED',
  History: '#b45309',
  'Computer Science': '#0e7490',
  Physics: '#1d4ed8',
  Geography: '#065f46',
  Chemistry: '#c62828',
};

export default function LibraryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<BookStatus | 'all'>('all');

  const filteredBooks = useMemo(() => {
    return mockBooks.filter((book) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || book.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filterStatus]);

  const stats = useMemo(() => ({
    total: mockBooks.length,
    available: mockBooks.filter((b) => b.status === 'available').length,
    issued: mockBooks.filter((b) => b.status === 'issued').length,
    overdue: mockBooks.filter((b) => b.status === 'overdue').length,
  }), []);

  const handleIssueReturn = (book: LibraryBook) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (book.status === 'available') {
      Alert.alert('Issue Book', `Issue "${book.title}" to a student?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Issue',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Book Issued', `"${book.title}" has been issued.`);
          },
        },
      ]);
    } else {
      Alert.alert('Return Book', `Mark "${book.title}" as returned?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Return',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Book Returned', `"${book.title}" has been returned.`);
          },
        },
      ]);
    }
  };

  const renderBook = ({ item }: { item: LibraryBook }) => {
    const conf = statusConfig[item.status];
    const subjectColor = subjectColors[item.subject] || '#555';
    return (
      <Pressable
        onPress={() => handleIssueReturn(item)}
        style={({ pressed }) => [styles.bookCard, pressed && { opacity: 0.88, transform: [{ scale: 0.99 }] }]}
      >
        {/* Left accent bar */}
        <View style={[styles.cardAccentBar, { backgroundColor: subjectColor }]} />

        <View style={styles.bookContent}>
          <View style={styles.bookTopRow}>
            <View style={styles.bookIconWrapper}>
              <BookOpen size={20} color={subjectColor} />
            </View>
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.bookAuthor}>{item.author}</Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: conf.bg }]}>
              <Text style={[styles.statusPillText, { color: conf.color }]}>{conf.label}</Text>
            </View>
          </View>

          <View style={styles.bookMetaRow}>
            <View style={styles.metaChip}>
              <Tag size={11} color="#888" />
              <Text style={styles.metaChipText}>{item.subject}</Text>
            </View>
            <View style={styles.metaChip}>
              <BookMarked size={11} color="#888" />
              <Text style={styles.metaChipText}>{item.accessionNo}</Text>
            </View>
          </View>

          {item.status !== 'available' && (
            <View style={styles.issuedRow}>
              {item.issuedTo && (
                <View style={styles.issuedChip}>
                  <User size={11} color={subjectColor} />
                  <Text style={[styles.issuedText, { color: subjectColor }]}>{item.issuedTo}</Text>
                </View>
              )}
              {item.dueDate && (
                <View style={styles.issuedChip}>
                  <Clock size={11} color={item.status === 'overdue' ? '#c62828' : '#b45309'} />
                  <Text style={[styles.issuedText, { color: item.status === 'overdue' ? '#c62828' : '#b45309' }]}>
                    Due: {item.dueDate}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
        <ChevronRight size={16} color="#ccc" />
      </Pressable>
    );
  };

  const filterTabs: { key: BookStatus | 'all'; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'available', label: 'Available' },
    { key: 'issued', label: 'Issued' },
    { key: 'overdue', label: 'Overdue' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f7f1ff" />

      {/* Header */}
      <View style={styles.topHeader}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }]}
          hitSlop={8}
        >
          <ArrowLeft size={20} color="#222" />
        </Pressable>
        <Text style={styles.navTitle}>Library</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={renderBook}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 30 }]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Stats Strip */}
            <View style={styles.statsStrip}>
              {[
                { label: 'Total', value: stats.total, color: '#0b2178ff' },
                { label: 'Available', value: stats.available, color: '#15803D' },
                { label: 'Issued', value: stats.issued, color: '#b45309' },
                { label: 'Overdue', value: stats.overdue, color: '#c62828' },
              ].map((item, i, arr) => (
                <View key={item.label} style={[styles.statCol, i < arr.length - 1 && styles.statColBorder]}>
                  <Text style={[styles.statNum, { color: item.color }]}>{item.value}</Text>
                  <Text style={styles.statLabel}>{item.label}</Text>
                </View>
              ))}
            </View>

            {/* Search */}
            <View style={styles.searchBar}>
              <Search size={16} color="#888" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by title, author or subject..."
                placeholderTextColor="#aaa"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterTabRow}>
              {filterTabs.map((tab) => (
                <Pressable
                  key={tab.key}
                  onPress={() => { Haptics.selectionAsync(); setFilterStatus(tab.key); }}
                  style={[styles.filterTab, filterStatus === tab.key && styles.filterTabActive]}
                >
                  <Text style={[styles.filterTabText, filterStatus === tab.key && styles.filterTabTextActive]}>
                    {tab.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.componentHeader}>
              <Text style={styles.componentText}>Books ({filteredBooks.length})</Text>
              <View style={styles.headerLine} />
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <BookOpen size={48} color="#c5baa9" />
            <Text style={styles.emptyTitle}>No books found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search or filter.</Text>
          </View>
        }
      />
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

  statsStrip: {
    flexDirection: 'row', backgroundColor: '#feffe0ff', borderRadius: 12,
    borderWidth: 1, borderColor: '#895f05de', paddingVertical: 10, marginTop: 8, marginBottom: 12,
  },
  statCol: { flex: 1, alignItems: 'center' },
  statColBorder: { borderRightWidth: 1, borderRightColor: '#dcd8c8' },
  statNum: { fontFamily: 'Roboto_700Bold', fontSize: 18, fontWeight: '700' },
  statLabel: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#666', marginTop: 2 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#ffffff',
    borderWidth: 1, borderColor: '#dcd8c8', borderRadius: 10, paddingHorizontal: 12,
    paddingVertical: 10, marginBottom: 12,
  },
  searchInput: { flex: 1, fontFamily: 'Roboto_400Regular', fontSize: 14, color: '#100707ff' },

  filterTabRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  filterTab: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, borderWidth: 1,
    borderColor: '#dcd8c8', backgroundColor: '#ffffff',
  },
  filterTabActive: { backgroundColor: '#0b2178ff', borderColor: '#0b2178ff' },
  filterTabText: { fontFamily: 'Roboto_400Regular', fontSize: 12, color: '#555' },
  filterTabTextActive: { fontFamily: 'Roboto_600SemiBold', color: '#fff', fontWeight: '600' },

  bookCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff',
    borderRadius: 10, marginBottom: 10, borderWidth: 1, borderColor: '#e5e0d0',
    overflow: 'hidden',
  },
  cardAccentBar: { width: 4, alignSelf: 'stretch' },
  bookContent: { flex: 1, padding: 12, gap: 6 },
  bookTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  bookIconWrapper: {
    width: 36, height: 36, borderRadius: 8, backgroundColor: '#f3f8fc',
    justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#dcd8c8',
    flexShrink: 0,
  },
  bookInfo: { flex: 1 },
  bookTitle: { fontFamily: 'Roboto_600SemiBold', fontSize: 13, color: '#100707ff', lineHeight: 18 },
  bookAuthor: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#777', marginTop: 2 },
  statusPill: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', flexShrink: 0 },
  statusPillText: { fontFamily: 'Roboto_600SemiBold', fontSize: 11, fontWeight: '600' },
  bookMetaRow: { flexDirection: 'row', gap: 8 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f7f7f1', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  metaChipText: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#666' },
  issuedRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  issuedChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  issuedText: { fontFamily: 'Roboto_400Regular', fontSize: 11 },

  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50 },
  emptyTitle: { fontFamily: 'Roboto_700Bold', fontSize: 16, color: '#222', marginTop: 12 },
  emptySubtitle: { fontFamily: 'Roboto_400Regular', fontSize: 13, color: '#777', marginTop: 4 },
});
