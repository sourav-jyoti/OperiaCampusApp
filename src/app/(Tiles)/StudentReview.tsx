import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  Filter,
  MessageSquare,
  Plus,
  Search,
  Star,
  User,
  X,
} from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type Review = {
  id: string;
  studentName: string;
  rollNo: string;
  avatar: string;
  rating: number; // 1 to 5
  tag: 'Outstanding' | 'Consistent' | 'Needs Focus';
  teacherNote: string;
  date: string;
  subject: string;
};

const initialReviews: Review[] = [
  {
    id: 'r1',
    studentName: 'Sourav Jyoti',
    rollNo: '13',
    avatar: '👦🏻',
    rating: 5,
    tag: 'Outstanding',
    teacherNote: 'Exceptional conceptual clarity in linear equations. Proactively helps peers during group math sessions.',
    date: '09 Jun 2026',
    subject: 'Mathematics',
  },
  {
    id: 'r2',
    studentName: 'Aarav Sharma',
    rollNo: '01',
    avatar: '👦🏼',
    rating: 4,
    tag: 'Consistent',
    teacherNote: 'Consistently completes homework on time. Need to encourage him to speak up more in classroom presentations.',
    date: '07 Jun 2026',
    subject: 'General Science',
  },
  {
    id: 'r3',
    studentName: 'Ananya Iyer',
    rollNo: '04',
    avatar: '👧🏻',
    rating: 3,
    tag: 'Needs Focus',
    teacherNote: 'Distracted during afternoon lab hours. Needs focused guidance on chemical formulas revision.',
    date: '04 Jun 2026',
    subject: 'General Science',
  },
  {
    id: 'r4',
    studentName: 'Devansh Verma',
    rollNo: '18',
    avatar: '👦🏽',
    rating: 5,
    tag: 'Outstanding',
    teacherNote: 'Brilliant essay writing skills and creative vocabulary usage. High participation during debates.',
    date: '01 Jun 2026',
    subject: 'English',
  },
];

const tagColors: Record<string, { bg: string; text: string }> = {
  Outstanding: { bg: '#DCFCE7', text: '#15803D' },
  Consistent: { bg: '#E0F2FE', text: '#0284C7' },
  'Needs Focus': { bg: '#FEE2E2', text: '#DC2626' },
};

export default function StudentReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [filterTag, setFilterTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Add review modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStudent, setModalStudent] = useState('');
  const [modalRoll, setModalRoll] = useState('');
  const [modalRating, setModalRating] = useState(5);
  const [modalTag, setModalTag] = useState<'Outstanding' | 'Consistent' | 'Needs Focus'>('Consistent');
  const [modalNote, setModalNote] = useState('');

  const filterOptions = ['All', 'Outstanding', 'Consistent', 'Needs Focus'];

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchTag = filterTag === 'All' || r.tag === filterTag;
      const matchSearch =
        searchQuery.trim() === '' ||
        r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.rollNo.includes(searchQuery) ||
        r.teacherNote.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTag && matchSearch;
    });
  }, [reviews, filterTag, searchQuery]);

  const handleSaveReview = () => {
    if (!modalStudent.trim() || !modalNote.trim()) {
      Alert.alert('Incomplete Form', 'Please provide a student name and review comment.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      studentName: modalStudent.trim(),
      rollNo: modalRoll.trim() || '25',
      avatar: '👦🏻',
      rating: modalRating,
      tag: modalTag,
      teacherNote: modalNote.trim(),
      date: 'Just now',
      subject: 'Class VI - B Coordination',
    };

    setReviews([newRev, ...reviews]);
    setModalOpen(false);
    setModalStudent('');
    setModalRoll('');
    setModalNote('');
    Alert.alert('Review Recorded', 'Observation note logged in student academic profile.');
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
        <Text style={styles.navTitle}>Student Review</Text>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setModalOpen(true);
          }}
          style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.75 }]}
          hitSlop={8}
        >
          <Plus size={18} color="#1b005a" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Input */}
        <View style={styles.searchRow}>
          <Search size={16} color="#8b4a0dff" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search student by name or roll number..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterOptions.map((opt) => {
            const isActive = filterTag === opt;
            return (
              <Pressable
                key={opt}
                onPress={() => {
                  Haptics.selectionAsync();
                  setFilterTag(opt);
                }}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {opt}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Section title */}
        <View style={styles.componentHeader}>
          <Text style={styles.componentText}>
            Class VI-B Observations ({filteredReviews.length})
          </Text>
          <View style={styles.headerLine} />
        </View>

        {/* Reviews List */}
        {filteredReviews.map((rev) => {
          const pill = tagColors[rev.tag] ?? { bg: '#F3F4F6', text: '#555' };

          return (
            <View key={rev.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.studentInfo}>
                  <View style={styles.avatarBubble}>
                    <Text style={styles.avatarEmoji}>{rev.avatar}</Text>
                  </View>
                  <View>
                    <Text style={styles.studentName}>{rev.studentName}</Text>
                    <Text style={styles.studentSub}>
                      Roll #{rev.rollNo} • {rev.subject}
                    </Text>
                  </View>
                </View>

                <View style={[styles.tagBadge, { backgroundColor: pill.bg }]}>
                  <Text style={[styles.tagBadgeText, { color: pill.text }]}>{rev.tag}</Text>
                </View>
              </View>

              {/* Star Rating */}
              <View style={styles.starRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={15}
                    color="#F59E0B"
                    fill={star <= rev.rating ? '#F59E0B' : 'transparent'}
                  />
                ))}
                <Text style={styles.ratingNumber}>{rev.rating}.0 / 5.0</Text>
              </View>

              {/* Comment */}
              <View style={styles.commentBox}>
                <Text style={styles.commentText}>"{rev.teacherNote}"</Text>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.dateText}>Logged: {rev.date}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Add Review Modal */}
      <Modal visible={modalOpen} transparent animationType="slide" onRequestClose={() => setModalOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalOpen(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Record Student Observation</Text>
              <Pressable onPress={() => setModalOpen(false)} hitSlop={10}>
                <X size={20} color="#333" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Student Name *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Sourav Jyoti"
                  placeholderTextColor="#aaa"
                  value={modalStudent}
                  onChangeText={setModalStudent}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Roll Number</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 13"
                  placeholderTextColor="#aaa"
                  keyboardType="numeric"
                  value={modalRoll}
                  onChangeText={setModalRoll}
                />
              </View>

              {/* Rating selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Performance Rating</Text>
                <View style={styles.ratingSelectRow}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Pressable
                      key={s}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setModalRating(s);
                      }}
                      style={styles.starSelectBtn}
                    >
                      <Star
                        size={24}
                        color="#F59E0B"
                        fill={s <= modalRating ? '#F59E0B' : 'transparent'}
                      />
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Conduct Tag selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Conduct Category</Text>
                <View style={styles.tagSelectRow}>
                  {(['Outstanding', 'Consistent', 'Needs Focus'] as const).map((t) => (
                    <Pressable
                      key={t}
                      onPress={() => {
                        Haptics.selectionAsync();
                        setModalTag(t);
                      }}
                      style={[styles.tagSelectBtn, modalTag === t && styles.tagSelectBtnActive]}
                    >
                      <Text style={[styles.tagSelectText, modalTag === t && styles.tagSelectTextActive]}>
                        {t}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Comment text area */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Observations / Recommendations *</Text>
                <TextInput
                  style={[styles.textInput, { minHeight: 80 }]}
                  placeholder="Note on behavior, academic aptitude, or areas to improve..."
                  placeholderTextColor="#aaa"
                  value={modalNote}
                  onChangeText={setModalNote}
                  multiline
                />
              </View>

              <Pressable
                onPress={handleSaveReview}
                style={({ pressed }) => [styles.submitModalBtn, pressed && { opacity: 0.85 }]}
              >
                <Text style={styles.submitModalBtnText}>Save Review to Record</Text>
              </Pressable>
            </ScrollView>
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
  addButton: {
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

  searchRow: {
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
  filterChip: {
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dcd8c8',
  },
  filterChipActive: {
    backgroundColor: '#1b005a',
    borderColor: '#1b005a',
  },
  filterChipText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#555',
  },
  filterChipTextActive: {
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
    marginBottom: 10,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#feffe0ff',
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 18 },
  studentName: { fontFamily: 'Roboto_700Bold', fontSize: 14, color: '#100707ff', fontWeight: '700' },
  studentSub: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#777', marginTop: 1 },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagBadgeText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 10,
    fontWeight: '700',
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  ratingNumber: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  commentBox: {
    backgroundColor: '#fafaf5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  commentText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#333',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0ece0',
    paddingTop: 8,
  },
  dateText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#888',
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
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 17,
    color: '#100707ff',
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 12,
    gap: 4,
  },
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
  ratingSelectRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  starSelectBtn: {
    padding: 4,
  },
  tagSelectRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tagSelectBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fafaf5',
    borderWidth: 1,
    borderColor: '#dcd8c8',
  },
  tagSelectBtnActive: {
    backgroundColor: '#1b005a',
    borderColor: '#1b005a',
  },
  tagSelectText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#555',
  },
  tagSelectTextActive: {
    fontFamily: 'Roboto_700Bold',
    color: '#ffffff',
    fontWeight: '700',
  },
  submitModalBtn: {
    backgroundColor: '#1b005a',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  submitModalBtnText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '700',
  },
});
