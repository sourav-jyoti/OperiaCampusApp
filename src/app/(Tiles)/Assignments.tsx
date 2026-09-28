import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ChevronDown,
  Download,
  Check,
  CheckCircle2,
  FileText,
  Layers,
  Filter,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { mockAssignments } from '@/utilities/mockdata';
import type { Assignment, AssignmentStatus } from '@/utilities/types';

// Word icon badge component matching the provided design
function DocFileIcon() {
  return (
    <View style={styles.docIconContainer}>
      <View style={styles.docBackground}>
        <View style={styles.docBadge}>
          <Text style={styles.docBadgeLetter}>W</Text>
        </View>
        <View style={styles.docPageFold} />
      </View>
    </View>
  );
}

export default function AssignmentsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Extract unique subjects list
  const subjectsList = useMemo(() => {
    const list = Array.from(new Set(mockAssignments.map((a) => a.subject)));
    return ['All', ...list];
  }, []);

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    if (selectedSubject === 'All') return assignments;
    return assignments.filter((a) => a.subject.toLowerCase() === selectedSubject.toLowerCase());
  }, [assignments, selectedSubject]);

  // Handle submit assignment
  const handleSubmitAssignment = (id: string, subject: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAssignments((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'submitted' as AssignmentStatus,
              submittedAt: 'Just now',
            }
          : item
      )
    );
    Alert.alert('Assignment Submitted', `Your assignment for ${subject} has been successfully submitted.`);
  };

  // Handle file download
  const handleDownload = (assignment: Assignment) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Downloading Assignment', `Downloading "${assignment.fileName}"...`);
  };

  const renderAssignmentCard = ({ item }: { item: Assignment }) => {
    const isSubmitted = item.status === 'submitted';

    return (
      <View style={styles.cardContainer}>
        {/* Top Section: Icon, Subject Name & Due Date */}
        <View style={styles.cardTopRow}>
          <DocFileIcon />
          <View style={styles.cardInfo}>
            <Text style={styles.subjectTitle}>{item.subject}</Text>
            <Text style={styles.submitDateText}>
              {isSubmitted ? `Submitted on ${item.submittedAt || 'Today'}` : `Submit on ${item.dueDate}`}
            </Text>
          </View>
          {isSubmitted && (
            <View style={styles.submittedPill}>
              <CheckCircle2 size={13} color="#2e7d32" />
              <Text style={styles.submittedPillText}>Done</Text>
            </View>
          )}
        </View>

        {/* Bottom Section: Download Icon Button + Submit Button */}
        <View style={styles.cardActionRow}>
          <Pressable
            onPress={() => handleDownload(item)}
            style={({ pressed }) => [
              styles.downloadButton,
              pressed && { opacity: 0.7, transform: [{ scale: 0.96 }] },
            ]}
            accessibilityLabel="Download assignment file"
            accessibilityRole="button"
          >
            <Download size={18} color="#1b005a" strokeWidth={2.2} />
          </Pressable>

          <Pressable
            onPress={() => {
              if (!isSubmitted) {
                handleSubmitAssignment(item.id, item.subject);
              }
            }}
            disabled={isSubmitted}
            style={({ pressed }) => [
              styles.submitButton,
              isSubmitted && styles.submittedButton,
              pressed && !isSubmitted && { opacity: 0.88, transform: [{ scale: 0.98 }] },
            ]}
          >
            {isSubmitted ? (
              <View style={styles.buttonInnerRow}>
                <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={styles.submitButtonText}>Submitted</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7f7f1ff" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] }]}
          hitSlop={8}
          accessibilityLabel="Back"
          accessibilityRole="button"
        >
          <ArrowLeft size={20} color="#222" />
        </Pressable>
        <Text style={styles.navTitle}>Assignments</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={filteredAssignments}
        keyExtractor={(item) => item.id}
        renderItem={renderAssignmentCard}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Component Header matching app design system */}
            <View style={styles.componentHeader}>
              <Text style={styles.componentText}>All Assignments</Text>
              <View style={styles.headerLine} />
            </View>

            {/* Filter Dropdown Bar */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Filter by Subject:</Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setIsDropdownOpen(true);
                }}
                style={({ pressed }) => [
                  styles.dropdownTrigger,
                  pressed && { opacity: 0.85, transform: [{ scale: 0.99 }] },
                ]}
              >
                <View style={styles.dropdownLeft}>
                  <Filter size={15} color="#8b4a0dff" />
                  <Text style={styles.dropdownValueText}>{selectedSubject}</Text>
                </View>
                <ChevronDown size={16} color="#444" />
              </Pressable>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FileText size={48} color="#c5baa9" />
            <Text style={styles.emptyTitle}>No assignments found</Text>
            <Text style={styles.emptySubtitle}>There are no assignments for the selected subject.</Text>
          </View>
        }
      />

      {/* Subject Selector Modal */}
      <Modal
        visible={isDropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsDropdownOpen(false)}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Subject</Text>
              <Pressable onPress={() => setIsDropdownOpen(false)} hitSlop={8}>
                <Text style={styles.modalDoneText}>Close</Text>
              </Pressable>
            </View>

            <View style={styles.modalDivider} />

            {subjectsList.map((subject) => {
              const isSelected = selectedSubject === subject;
              return (
                <Pressable
                  key={subject}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedSubject(subject);
                    setIsDropdownOpen(false);
                  }}
                  style={({ pressed }) => [
                    styles.modalOption,
                    isSelected && styles.modalOptionSelected,
                    pressed && { backgroundColor: '#f1f0e4' },
                  ]}
                >
                  <Text style={[styles.modalOptionText, isSelected && styles.modalOptionTextSelected]}>
                    {subject}
                  </Text>
                  {isSelected && <Check size={18} color="#1b005a" strokeWidth={2.5} />}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f7f1ff',
  },
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
  navTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 17,
    fontWeight: '700',
    color: '#100707ff',
  },
  listContent: {
    paddingHorizontal: 14,
    paddingTop: 4,
  },

  // Design system header
  componentHeader: {
    paddingLeft: '1%',
    marginBottom: 10,
    marginTop: 10,
  },
  componentText: {
    fontFamily: 'Roboto_300Light',
    fontSize: 18,
    color: '#222222',
  },
  headerLine: {
    borderWidth: 1,
    width: 36,
    marginTop: 3,
    borderColor: '#0b2178ff',
    backgroundColor: '#0b2178ff',
  },

  /* Filter Section */
  filterSection: {
    marginBottom: 16,
    marginTop: 6,
  },
  filterLabel: {
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
    color: '#666666',
    marginBottom: 6,
    paddingLeft: 2,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  dropdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownValueText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 14,
    color: '#100707ff',
  },

  /* Assignment Card matching user design */
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1.5,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  subjectTitle: {
    fontSize: 16,
    fontFamily: 'Roboto_700Bold',
    fontWeight: '700',
    color: '#100707ff',
  },
  submitDateText: {
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
    color: '#666666',
    marginTop: 3,
  },
  submittedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#feffe0ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2e7d32',
    gap: 4,
  },
  submittedPillText: {
    fontSize: 11,
    fontFamily: 'Roboto_600SemiBold',
    color: '#2e7d32',
  },

  /* Custom Doc file icon */
  docIconContainer: {
    width: 36,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  docBackground: {
    width: 34,
    height: 38,
    backgroundColor: '#1E69BA',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  docPageFold: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 9,
    height: 9,
    backgroundColor: '#155294',
    borderBottomLeftRadius: 3,
  },
  docBadge: {
    backgroundColor: '#2B579A',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 0.8,
    borderColor: '#5482C7',
  },
  docBadgeLetter: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },

  /* Card Action Row */
  cardActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  downloadButton: {
    width: 44,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#dcd8c8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#1b005a', // Deep violet/indigo from the user screenshot
    justifyContent: 'center',
    alignItems: 'center',
  },
  submittedButton: {
    backgroundColor: '#2e7d32',
  },
  buttonInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Roboto_600SemiBold',
    fontWeight: '600',
  },

  /* Empty state */
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Roboto_700Bold',
    fontWeight: '700',
    color: '#222',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: 'Roboto_400Regular',
    color: '#777',
    marginTop: 4,
    textAlign: 'center',
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Roboto_700Bold',
    color: '#100707ff',
  },
  modalDoneText: {
    fontSize: 14,
    fontFamily: 'Roboto_600SemiBold',
    color: '#8b4a0dff',
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#f0ece0',
    marginBottom: 8,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  modalOptionSelected: {
    backgroundColor: '#feffe0ff',
  },
  modalOptionText: {
    fontSize: 14,
    fontFamily: 'Roboto_400Regular',
    color: '#222',
  },
  modalOptionTextSelected: {
    fontFamily: 'Roboto_700Bold',
    color: '#1b005a',
    fontWeight: '700',
  },
});
