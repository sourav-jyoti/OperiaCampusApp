import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  SendHorizonal,
} from 'lucide-react-native';
import { useState } from 'react';
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

const leaveTypes = ['Sick Leave', 'Personal Leave', 'Emergency Leave', 'Casual Leave', 'Maternity/Paternity Leave', 'Earned Leave'];
const durationOptions = ['1 day', '2 days', '3 days', '4 days', '5 days', 'Half day'];

type LeaveStatus = {
  id: string;
  type: string;
  from: string;
  duration: string;
  status: 'pending' | 'approved' | 'rejected';
};

const pastLeaves: LeaveStatus[] = [
  { id: '1', type: 'Sick Leave', from: '15 Jun 2026', duration: '2 days', status: 'approved' },
  { id: '2', type: 'Casual Leave', from: '3 May 2026', duration: '1 day', status: 'approved' },
  { id: '3', type: 'Personal Leave', from: '10 Apr 2026', duration: '3 days', status: 'rejected' },
];

const statusConfig = {
  approved: { color: '#2e7d32', bg: '#dcfce7', label: 'Approved' },
  rejected: { color: '#c62828', bg: '#ffebee', label: 'Rejected' },
  pending: { color: '#b45309', bg: '#fef3c7', label: 'Pending' },
};

export default function LeaveRequestScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [leaveType, setLeaveType] = useState('Sick Leave');
  const [duration, setDuration] = useState('1 day');
  const [fromDate, setFromDate] = useState('');
  const [reason, setReason] = useState('');
  const [typeModal, setTypeModal] = useState(false);
  const [durationModal, setDurationModal] = useState(false);

  const handleSubmit = () => {
    if (!fromDate.trim()) {
      Alert.alert('Missing Info', 'Please enter the start date of your leave.');
      return;
    }
    if (!reason.trim()) {
      Alert.alert('Missing Info', 'Please provide a reason for your leave.');
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Leave Applied ✓',
      `Your ${leaveType} request for ${duration} starting ${fromDate} has been submitted for approval.`,
      [{ text: 'Done', onPress: () => router.back() }]
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
        <Text style={styles.navTitle}>Apply Leave</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Leave Balance Summary */}
        <View style={styles.balanceRow}>
          {[
            { label: 'Total', value: '20', color: '#0b2178ff', bg: '#EEF2FF' },
            { label: 'Used', value: '6', color: '#8b4a0dff', bg: '#feffe0ff' },
            { label: 'Available', value: '14', color: '#15803D', bg: '#dcfce7' },
          ].map((item) => (
            <View key={item.label} style={[styles.balanceCard, { backgroundColor: item.bg }]}>
              <Text style={[styles.balanceNum, { color: item.color }]}>{item.value}</Text>
              <Text style={styles.balanceLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Apply Form */}
        <View style={styles.componentHeader}>
          <Text style={styles.componentText}>New Leave Request</Text>
          <View style={styles.headerLine} />
        </View>

        <View style={styles.card}>
          {/* Leave Type */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Leave Type</Text>
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setTypeModal(true); }}
              style={({ pressed }) => [styles.dropdownBtn, pressed && { opacity: 0.85 }]}
            >
              <View style={styles.dropdownLeft}>
                <FileText size={15} color="#8b4a0dff" />
                <Text style={styles.dropdownBtnText}>{leaveType}</Text>
              </View>
              <ChevronDown size={16} color="#555" />
            </Pressable>
          </View>

          {/* From Date */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>From Date</Text>
            <View style={styles.inputRow}>
              <Calendar size={15} color="#8b4a0dff" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 5 Oct 2026"
                placeholderTextColor="#aaa"
                value={fromDate}
                onChangeText={setFromDate}
              />
            </View>
          </View>

          {/* Duration */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Duration</Text>
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setDurationModal(true); }}
              style={({ pressed }) => [styles.dropdownBtn, pressed && { opacity: 0.85 }]}
            >
              <View style={styles.dropdownLeft}>
                <Clock size={15} color="#8b4a0dff" />
                <Text style={styles.dropdownBtnText}>{duration}</Text>
              </View>
              <ChevronDown size={16} color="#555" />
            </Pressable>
          </View>

          {/* Reason */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Reason</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe the reason for your leave..."
              placeholderTextColor="#aaa"
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Submit Button */}
        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.88, transform: [{ scale: 0.98 }] }]}
        >
          <SendHorizonal size={18} color="#fff" />
          <Text style={styles.submitBtnText}>Submit Leave Request</Text>
        </Pressable>

        {/* Leave History */}
        <View style={styles.componentHeader}>
          <Text style={styles.componentText}>Recent Leaves</Text>
          <View style={styles.headerLine} />
        </View>

        {pastLeaves.map((leave) => {
          const conf = statusConfig[leave.status];
          return (
            <View key={leave.id} style={styles.historyCard}>
              <View style={styles.historyLeft}>
                <Text style={styles.historyType}>{leave.type}</Text>
                <Text style={styles.historyMeta}>{leave.from}  •  {leave.duration}</Text>
              </View>
              <View style={[styles.statusPill, { backgroundColor: conf.bg }]}>
                <Text style={[styles.statusPillText, { color: conf.color }]}>{conf.label}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Leave Type Modal */}
      <Modal visible={typeModal} transparent animationType="fade" onRequestClose={() => setTypeModal(false)}>
        <Pressable style={styles.overlay} onPress={() => setTypeModal(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Leave Type</Text>
            <View style={styles.modalDivider} />
            {leaveTypes.map((type) => (
              <Pressable
                key={type}
                onPress={() => { Haptics.selectionAsync(); setLeaveType(type); setTypeModal(false); }}
                style={({ pressed }) => [styles.modalOption, leaveType === type && styles.modalOptionActive, pressed && { opacity: 0.8 }]}
              >
                <Text style={[styles.modalOptionText, leaveType === type && styles.modalOptionTextActive]}>{type}</Text>
                {leaveType === type && <Check size={16} color="#1b005a" />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Duration Modal */}
      <Modal visible={durationModal} transparent animationType="fade" onRequestClose={() => setDurationModal(false)}>
        <Pressable style={styles.overlay} onPress={() => setDurationModal(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Duration</Text>
            <View style={styles.modalDivider} />
            {durationOptions.map((opt) => (
              <Pressable
                key={opt}
                onPress={() => { Haptics.selectionAsync(); setDuration(opt); setDurationModal(false); }}
                style={({ pressed }) => [styles.modalOption, duration === opt && styles.modalOptionActive, pressed && { opacity: 0.8 }]}
              >
                <Text style={[styles.modalOptionText, duration === opt && styles.modalOptionTextActive]}>{opt}</Text>
                {duration === opt && <Check size={16} color="#1b005a" />}
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
  scrollContent: { paddingHorizontal: 14, paddingTop: 10 },

  componentHeader: { paddingLeft: '1%', marginBottom: 10, marginTop: 16 },
  componentText: { fontFamily: 'Roboto_300Light', fontSize: 18, color: '#222' },
  headerLine: { borderWidth: 1, width: 36, marginTop: 3, borderColor: '#0b2178ff', backgroundColor: '#0b2178ff' },

  balanceRow: { flexDirection: 'row', gap: 10 },
  balanceCard: {
    flex: 1, borderRadius: 10, padding: 12, alignItems: 'center',
    borderWidth: 1, borderColor: '#e5e0d0',
  },
  balanceNum: { fontFamily: 'Roboto_700Bold', fontSize: 22, fontWeight: '700' },
  balanceLabel: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#666', marginTop: 2 },

  card: {
    backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1,
    borderColor: '#dbbfa5ff', padding: 14, gap: 14,
  },
  fieldGroup: { gap: 6 },
  fieldLabel: { fontFamily: 'Roboto_400Regular', fontSize: 12, color: '#666', paddingLeft: 2 },
  dropdownBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#dcd8c8', borderRadius: 8, paddingHorizontal: 12,
    paddingVertical: 10, backgroundColor: '#fafaf5',
  },
  dropdownLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dropdownBtnText: { fontFamily: 'Roboto_600SemiBold', fontSize: 14, color: '#100707ff' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#dcd8c8',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fafaf5', gap: 8,
  },
  inputIcon: {},
  textInput: { flex: 1, fontFamily: 'Roboto_400Regular', fontSize: 14, color: '#100707ff' },
  textArea: {
    borderWidth: 1, borderColor: '#dcd8c8', borderRadius: 8, paddingHorizontal: 12,
    paddingVertical: 10, fontFamily: 'Roboto_400Regular', fontSize: 14, color: '#100707ff',
    backgroundColor: '#fafaf5', minHeight: 100,
  },

  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#1b005a', paddingVertical: 13, borderRadius: 10, marginTop: 16,
  },
  submitBtnText: { color: '#fff', fontFamily: 'Roboto_700Bold', fontSize: 14, fontWeight: '700' },

  historyCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#ffffff', borderRadius: 8, padding: 12, marginBottom: 8,
    borderWidth: 1, borderColor: '#e5e0d0',
  },
  historyLeft: { flex: 1 },
  historyType: { fontFamily: 'Roboto_600SemiBold', fontSize: 13, color: '#100707ff' },
  historyMeta: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#888', marginTop: 2 },
  statusPill: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusPillText: { fontFamily: 'Roboto_600SemiBold', fontSize: 12, fontWeight: '600' },

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
