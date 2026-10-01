import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  MapPin,
  Plus,
  Send,
  Users,
  Video,
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

type Meeting = {
  id: string;
  title: string;
  organizer: string;
  date: string;
  time: string;
  mode: 'In-Person' | 'Virtual';
  venue: string;
  attendees: string;
  agenda: string;
  status: 'upcoming' | 'completed';
};

const initialMeetings: Meeting[] = [
  {
    id: 'm1',
    title: 'Department Academic Curriculum Review',
    organizer: 'Dr. Anita Roy (Academic Dean)',
    date: 'Today, 11 Jun',
    time: '02:30 PM – 03:30 PM',
    mode: 'In-Person',
    venue: 'Conference Hall A (Admin Wing)',
    attendees: 'All Science & Math Faculty (14 members)',
    agenda: 'Quarterly syllabus tracking, unit test blueprint finalization, and practical lab schedule revisions.',
    status: 'upcoming',
  },
  {
    id: 'm2',
    title: 'Parent-Teacher Council (Executive Body)',
    organizer: 'Mr. Arvind Sharma (Principal)',
    date: 'Friday, 12 Jun',
    time: '04:30 PM – 05:30 PM',
    mode: 'Virtual',
    venue: 'Google Meet (meet.google.com/qrs-camp-adm)',
    attendees: 'PTA Core Committee & Teachers (22 members)',
    agenda: 'Transportation safety protocol review, monsoon festival preparations, and canteen food audit.',
    status: 'upcoming',
  },
  {
    id: 'm3',
    title: 'Class VI Faculty Coordination Meeting',
    organizer: 'Mrs. Sunita Verma',
    date: 'Tuesday, 16 Jun',
    time: '12:30 PM – 01:15 PM',
    mode: 'In-Person',
    venue: 'Staff Room 2',
    attendees: 'Subject Teachers of Class VI (8 members)',
    agenda: 'Remedial coaching for students requiring additional support in mathematics.',
    status: 'upcoming',
  },
  {
    id: 'm4',
    title: 'Annual Sports Day Planning Session',
    organizer: 'Coach Devendra Singh',
    date: '04 Jun 2026',
    time: '10:00 AM – 11:30 AM',
    mode: 'In-Person',
    venue: 'Sports Pavilion',
    attendees: 'Physical Education & House Mentors',
    agenda: 'Event list finalization, medals procurement, and referee assignments.',
    status: 'completed',
  },
];

export default function MeetingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Past'>('Upcoming');

  // Schedule modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newAgenda, setNewAgenda] = useState('');

  const upcomingCount = meetings.filter((m) => m.status === 'upcoming').length;
  const pastCount = meetings.filter((m) => m.status === 'completed').length;

  const filteredMeetings = useMemo(() => {
    if (activeTab === 'Upcoming') return meetings.filter((m) => m.status === 'upcoming');
    return meetings.filter((m) => m.status === 'completed');
  }, [meetings, activeTab]);

  const handleCreateMeeting = () => {
    if (!newTitle.trim() || !newDate.trim() || !newTime.trim()) {
      Alert.alert('Missing Fields', 'Please enter at least Title, Date, and Time.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const newMeeting: Meeting = {
      id: `m_${Date.now()}`,
      title: newTitle.trim(),
      organizer: 'You (Sourav)',
      date: newDate.trim(),
      time: newTime.trim(),
      mode: newVenue.toLowerCase().includes('http') || newVenue.toLowerCase().includes('meet') ? 'Virtual' : 'In-Person',
      venue: newVenue.trim() || 'Staff Conference Room',
      attendees: 'Invited Staff Members',
      agenda: newAgenda.trim() || 'Discussion on academic agenda.',
      status: 'upcoming',
    };

    setMeetings([newMeeting, ...meetings]);
    setModalVisible(false);
    setNewTitle('');
    setNewDate('');
    setNewTime('');
    setNewVenue('');
    setNewAgenda('');
    Alert.alert('Meeting Scheduled', 'Calendar invite generated and dispatched to attendees.');
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
        <Text style={styles.navTitle}>Meetings</Text>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setModalVisible(true);
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
        {/* Metric Badges */}
        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, { backgroundColor: '#F3E5F5' }]}>
            <Text style={[styles.metricNumber, { color: '#7B1FA2' }]}>{upcomingCount}</Text>
            <Text style={styles.metricLabel}>Upcoming</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: '#E8F5E9' }]}>
            <Text style={[styles.metricNumber, { color: '#15803D' }]}>{pastCount}</Text>
            <Text style={styles.metricLabel}>Past / Logged</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: '#FFF3E0' }]}>
            <Text style={[styles.metricNumber, { color: '#E65100' }]}>{meetings.length}</Text>
            <Text style={styles.metricLabel}>Total Sessions</Text>
          </View>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          {(['Upcoming', 'Past'] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => {
                Haptics.selectionAsync();
                setActiveTab(tab);
              }}
              style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
            >
              <Text style={[styles.tabButtonText, activeTab === tab && styles.tabButtonTextActive]}>
                {tab} {tab === 'Upcoming' ? `(${upcomingCount})` : `(${pastCount})`}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Section title */}
        <View style={styles.componentHeader}>
          <Text style={styles.componentText}>{activeTab} Meetings</Text>
          <View style={styles.headerLine} />
        </View>

        {/* Meetings List */}
        {filteredMeetings.map((item) => {
          const isVirtual = item.mode === 'Virtual';

          return (
            <View key={item.id} style={styles.meetingCard}>
              <View style={styles.cardTop}>
                <View style={[styles.modeBadge, { backgroundColor: isVirtual ? '#EDE9FE' : '#FFF3E0' }]}>
                  {isVirtual ? (
                    <Video size={12} color="#6C4DFF" />
                  ) : (
                    <MapPin size={12} color="#E65100" />
                  )}
                  <Text style={[styles.modeText, { color: isVirtual ? '#6C4DFF' : '#E65100' }]}>
                    {item.mode}
                  </Text>
                </View>
                <Text style={styles.organizerText}>{item.organizer}</Text>
              </View>

              <Text style={styles.meetingTitle}>{item.title}</Text>

              <View style={styles.infoBox}>
                <View style={styles.infoRow}>
                  <Calendar size={14} color="#8b4a0dff" />
                  <Text style={styles.infoText}>{item.date}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Clock size={14} color="#8b4a0dff" />
                  <Text style={styles.infoText}>{item.time}</Text>
                </View>
                <View style={styles.infoRow}>
                  <MapPin size={14} color="#6C4DFF" />
                  <Text style={styles.infoText} numberOfLines={1}>{item.venue}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Users size={14} color="#666" />
                  <Text style={styles.infoText}>{item.attendees}</Text>
                </View>
              </View>

              {/* Agenda */}
              <View style={styles.agendaBox}>
                <Text style={styles.agendaLabel}>Agenda:</Text>
                <Text style={styles.agendaText}>{item.agenda}</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.cardActionRow}>
                {isVirtual && item.status === 'upcoming' ? (
                  <Pressable
                    onPress={() => {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      Alert.alert('Joining Meeting', `Connecting to video room:\n${item.venue}`);
                    }}
                    style={({ pressed }) => [styles.joinBtn, pressed && { opacity: 0.85 }]}
                  >
                    <Video size={14} color="#ffffff" />
                    <Text style={styles.joinBtnText}>Join Meeting</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => {
                      Haptics.selectionAsync();
                      Alert.alert('Meeting Details', `${item.title}\n\nOrganizer: ${item.organizer}\nVenue: ${item.venue}`);
                    }}
                    style={({ pressed }) => [styles.detailsBtn, pressed && { opacity: 0.7 }]}
                  >
                    <Text style={styles.detailsBtnText}>View Minutes / Agenda</Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Schedule Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule New Meeting</Text>
              <Pressable onPress={() => setModalVisible(false)} hitSlop={10}>
                <X size={20} color="#333" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 420 }}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Meeting Title *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Science Fair Coordination"
                  placeholderTextColor="#aaa"
                  value={newTitle}
                  onChangeText={setNewTitle}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 15 Jun 2026"
                  placeholderTextColor="#aaa"
                  value={newDate}
                  onChangeText={setNewDate}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Time *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 03:00 PM – 04:00 PM"
                  placeholderTextColor="#aaa"
                  value={newTime}
                  onChangeText={setNewTime}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Venue or Link</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Staff Room 1 or Google Meet link"
                  placeholderTextColor="#aaa"
                  value={newVenue}
                  onChangeText={setNewVenue}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Key Agenda</Text>
                <TextInput
                  style={[styles.textInput, { minHeight: 70 }]}
                  placeholder="Points to discuss..."
                  placeholderTextColor="#aaa"
                  value={newAgenda}
                  onChangeText={setNewAgenda}
                  multiline
                />
              </View>

              <Pressable
                onPress={handleCreateMeeting}
                style={({ pressed }) => [styles.submitModalBtn, pressed && { opacity: 0.85 }]}
              >
                <Send size={16} color="#ffffff" />
                <Text style={styles.submitModalBtnText}>Schedule & Notify Faculty</Text>
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

  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  metricCard: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e0d0',
  },
  metricNumber: { fontFamily: 'Roboto_700Bold', fontSize: 22, fontWeight: '700' },
  metricLabel: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#666', marginTop: 2 },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#EBE7D8',
    borderRadius: 9,
    padding: 3,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 7,
  },
  tabButtonActive: {
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  tabButtonText: { fontFamily: 'Roboto_400Regular', fontSize: 13, color: '#666' },
  tabButtonTextActive: { fontFamily: 'Roboto_700Bold', color: '#1b005a', fontWeight: '700' },

  componentHeader: { paddingLeft: '1%', marginBottom: 10, marginTop: 4 },
  componentText: { fontFamily: 'Roboto_300Light', fontSize: 18, color: '#222' },
  headerLine: { borderWidth: 1, width: 36, marginTop: 3, borderColor: '#0b2178ff', backgroundColor: '#0b2178ff' },

  meetingCard: {
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
  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  modeText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  organizerText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#777',
  },
  meetingTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 15,
    color: '#100707ff',
    fontWeight: '700',
    marginBottom: 10,
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#fafaf5',
    borderRadius: 8,
    padding: 10,
    gap: 6,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#444',
    flex: 1,
  },
  agendaBox: {
    backgroundColor: '#fff',
    borderLeftWidth: 3,
    borderLeftColor: '#7B1FA2',
    paddingLeft: 8,
    marginVertical: 6,
  },
  agendaLabel: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 11,
    color: '#7B1FA2',
  },
  agendaText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#555',
    lineHeight: 16,
    marginTop: 2,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0ece0',
    paddingTop: 10,
    marginTop: 6,
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#6C4DFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinBtnText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  detailsBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  detailsBtnText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#1b005a',
    fontWeight: '600',
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
  submitModalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1b005a',
    borderRadius: 10,
    paddingVertical: 12,
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
