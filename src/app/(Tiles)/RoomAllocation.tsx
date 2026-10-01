import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  DoorOpen,
  Filter,
  Monitor,
  Plus,
  Send,
  Users,
  Wifi,
  Wind,
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

type Room = {
  id: string;
  name: string;
  wing: 'Block A' | 'Block B' | 'Science Wing' | 'Halls';
  floor: string;
  capacity: number;
  features: string[];
  status: 'Vacant' | 'Occupied';
  currentOccupant?: string;
  nextAvailable?: string;
};

const initialRooms: Room[] = [
  {
    id: 'r-204',
    name: 'Classroom 204',
    wing: 'Block A',
    floor: '2nd Floor',
    capacity: 42,
    features: ['Smart Board', 'Projector', 'Wi-Fi'],
    status: 'Occupied',
    currentOccupant: 'Class VI - B (Mathematics with Mr. Sharma)',
    nextAvailable: '10:30 AM',
  },
  {
    id: 'r-lab2',
    name: 'Science Lab 2',
    wing: 'Science Wing',
    floor: 'Ground Floor',
    capacity: 35,
    features: ['Microscopes', 'Fume Hood', 'Gas Supply', 'Smart Board'],
    status: 'Vacant',
    nextAvailable: 'Available until 11:30 AM',
  },
  {
    id: 'r-105',
    name: 'Classroom 105',
    wing: 'Block A',
    floor: '1st Floor',
    capacity: 40,
    features: ['Projector', 'Wi-Fi'],
    status: 'Occupied',
    currentOccupant: 'Class VII - A (English with Ms. Verma)',
    nextAvailable: '11:15 AM',
  },
  {
    id: 'r-clab1',
    name: 'Computer Lab 1',
    wing: 'Science Wing',
    floor: '1st Floor',
    capacity: 45,
    features: ['45 PCs', 'High-speed LAN', 'AC', 'Projector'],
    status: 'Vacant',
    nextAvailable: 'Available all morning',
  },
  {
    id: 'r-conf',
    name: 'Executive Conference Hall',
    wing: 'Halls',
    floor: 'Admin Block 1st Floor',
    capacity: 60,
    features: ['Video Conferencing', 'Surround Audio', 'AC'],
    status: 'Occupied',
    currentOccupant: 'Department HOD Council Meeting',
    nextAvailable: '03:30 PM',
  },
  {
    id: 'r-art',
    name: 'Art & Design Studio',
    wing: 'Block B',
    floor: 'Ground Floor',
    capacity: 30,
    features: ['Display Easels', 'Pottery Wheels', 'Sink Stations'],
    status: 'Vacant',
    nextAvailable: 'Available now',
  },
];

export default function RoomAllocationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [selectedWing, setSelectedWing] = useState<string>('All');

  // Booking modal
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const [purpose, setPurpose] = useState('');
  const [slotTime, setSlotTime] = useState('');

  const wings = ['All', 'Block A', 'Block B', 'Science Wing', 'Halls'];

  const vacantCount = rooms.filter((r) => r.status === 'Vacant').length;
  const occupiedCount = rooms.filter((r) => r.status === 'Occupied').length;

  const filteredRooms = useMemo(() => {
    if (selectedWing === 'All') return rooms;
    return rooms.filter((r) => r.wing === selectedWing);
  }, [rooms, selectedWing]);

  const handleConfirmBooking = () => {
    if (!bookingRoom || !purpose.trim()) {
      Alert.alert('Missing Info', 'Please state the purpose of the booking.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setRooms((prev) =>
      prev.map((r) =>
        r.id === bookingRoom.id
          ? {
              ...r,
              status: 'Occupied',
              currentOccupant: `Reserved by Faculty (${purpose.trim()})`,
              nextAvailable: slotTime.trim() ? `After ${slotTime}` : 'Until 02:00 PM',
            }
          : r
      )
    );

    setBookingRoom(null);
    setPurpose('');
    setSlotTime('');
    Alert.alert('Room Reserved ✓', `${bookingRoom.name} successfully booked.`);
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
        <Text style={styles.navTitle}>Room Allocation</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Metric Badges */}
        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, { backgroundColor: '#E8F5E9' }]}>
            <Text style={[styles.metricNumber, { color: '#15803D' }]}>{vacantCount}</Text>
            <Text style={styles.metricLabel}>Vacant Now</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: '#FEE2E2' }]}>
            <Text style={[styles.metricNumber, { color: '#DC2626' }]}>{occupiedCount}</Text>
            <Text style={styles.metricLabel}>Occupied</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: '#EDE9FE' }]}>
            <Text style={[styles.metricNumber, { color: '#6C4DFF' }]}>{rooms.length}</Text>
            <Text style={styles.metricLabel}>Total Facilities</Text>
          </View>
        </View>

        {/* Wing Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {wings.map((w) => {
            const isActive = selectedWing === w;
            return (
              <Pressable
                key={w}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedWing(w);
                }}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {w}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Section title */}
        <View style={styles.componentHeader}>
          <Text style={styles.componentText}>
            Campus Facilities & Rooms ({filteredRooms.length})
          </Text>
          <View style={styles.headerLine} />
        </View>

        {/* Room Cards */}
        {filteredRooms.map((room) => {
          const isVacant = room.status === 'Vacant';

          return (
            <View key={room.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View>
                  <Text style={styles.roomName}>{room.name}</Text>
                  <Text style={styles.roomWing}>{room.wing}  •  {room.floor}</Text>
                </View>

                <View style={[styles.statusBadge, isVacant ? styles.statusBadgeVacant : styles.statusBadgeOcc]}>
                  <Text style={[styles.statusBadgeText, isVacant ? styles.statusTextVacant : styles.statusTextOcc]}>
                    {room.status}
                  </Text>
                </View>
              </View>

              {/* Status details */}
              <View style={styles.statusBox}>
                <View style={styles.statusRow}>
                  <Clock size={13} color="#8b4a0dff" />
                  <Text style={styles.statusDetailText}>
                    {isVacant ? room.nextAvailable : `Occupant: ${room.currentOccupant}`}
                  </Text>
                </View>
                {!isVacant && room.nextAvailable && (
                  <View style={styles.statusRow}>
                    <DoorOpen size={13} color="#666" />
                    <Text style={styles.statusDetailText}>Vacates at: {room.nextAvailable}</Text>
                  </View>
                )}
              </View>

              {/* Capacity and Features */}
              <View style={styles.featuresRow}>
                <View style={styles.capacityBadge}>
                  <Users size={12} color="#666" />
                  <Text style={styles.capacityText}>{room.capacity} Seats</Text>
                </View>
                {room.features.map((feat, idx) => (
                  <View key={idx} style={styles.featurePill}>
                    <Text style={styles.featurePillText}>{feat}</Text>
                  </View>
                ))}
              </View>

              {/* Action Button */}
              {isVacant ? (
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setBookingRoom(room);
                  }}
                  style={({ pressed }) => [styles.bookBtn, pressed && { opacity: 0.85 }]}
                >
                  <Text style={styles.bookBtnText}>Reserve This Room</Text>
                </Pressable>
              ) : null}
            </View>
          );
        })}
      </ScrollView>

      {/* Booking Modal */}
      <Modal visible={bookingRoom !== null} transparent animationType="slide" onRequestClose={() => setBookingRoom(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setBookingRoom(null)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {bookingRoom && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>Reserve {bookingRoom.name}</Text>
                    <Text style={styles.modalSub}>{bookingRoom.wing} • {bookingRoom.floor}</Text>
                  </View>
                  <Pressable onPress={() => setBookingRoom(null)} hitSlop={10}>
                    <X size={20} color="#333" />
                  </Pressable>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Purpose of Booking *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Science Fair Practice / Remedial Class"
                    placeholderTextColor="#aaa"
                    value={purpose}
                    onChangeText={setPurpose}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Required Time Slot</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 11:30 AM – 12:30 PM"
                    placeholderTextColor="#aaa"
                    value={slotTime}
                    onChangeText={setSlotTime}
                  />
                </View>

                <Pressable
                  onPress={handleConfirmBooking}
                  style={({ pressed }) => [styles.submitModalBtn, pressed && { opacity: 0.85 }]}
                >
                  <CheckCircle2 size={16} color="#ffffff" />
                  <Text style={styles.submitModalBtnText}>Confirm Room Reservation</Text>
                </Pressable>
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

  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  metricCard: {
    flex: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e0d0',
  },
  metricNumber: { fontFamily: 'Roboto_700Bold', fontSize: 20, fontWeight: '700' },
  metricLabel: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#666', marginTop: 2 },

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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  roomName: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 15,
    color: '#100707ff',
    fontWeight: '700',
  },
  roomWing: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeVacant: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeOcc: {
    backgroundColor: '#FEE2E2',
  },
  statusBadgeText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statusTextVacant: { color: '#15803D' },
  statusTextOcc: { color: '#DC2626' },

  statusBox: {
    backgroundColor: '#fafaf5',
    borderRadius: 8,
    padding: 10,
    gap: 6,
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDetailText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#444',
    flex: 1,
  },

  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
    marginBottom: 10,
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0ece0',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  capacityText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 11,
    color: '#555',
  },
  featurePill: {
    backgroundColor: '#f5f5f0',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  featurePillText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#666',
  },

  bookBtn: {
    backgroundColor: '#1b005a',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
    marginTop: 2,
  },
  bookBtnText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#ffffff',
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
    marginBottom: 14,
  },
  modalTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 17,
    color: '#100707ff',
    fontWeight: '700',
  },
  modalSub: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#777',
    marginTop: 2,
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
    marginTop: 8,
    marginBottom: 20,
  },
  submitModalBtnText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '700',
  },
});
