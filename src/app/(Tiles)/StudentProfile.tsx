import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  AlertCircle,
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  Download,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StudentProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'General' | 'Performance' | 'Badges'>('General');

  const student = {
    name: 'Sourav Jyoti',
    rollNo: '13',
    grade: 'Class VI',
    section: 'Section B',
    admissionNo: 'ADM-2024-042',
    dob: '14 May 2014',
    bloodGroup: 'O+ Positive',
    house: 'Blue Tigers',
    classTeacher: 'Mrs. Sunita Verma',
    guardian: {
      father: 'R. K. Jyoti',
      phone: '+91 98765 43210',
      email: 'rk.jyoti@gmail.com',
      relation: 'Father',
    },
    address: '42 Orchid Residency, Campus Road, Bengaluru - 560034',
    metrics: {
      attendance: '94.8%',
      attendanceDays: '110 / 116 days',
      rank: '3rd of 42',
      gpa: '89.4%',
      grade: 'A1',
    },
    achievements: [
      { id: 'a1', title: 'Maths Olympiad Silver Medalist', date: 'May 2026', icon: '🥈' },
      { id: 'a2', title: '100% Attendance Term 1', date: 'Mar 2026', icon: '🌟' },
      { id: 'a3', title: 'Junior Coding Challenge Finalist', date: 'Jan 2026', icon: '💻' },
      { id: 'a4', title: 'Exemplary Conduct Citation', date: 'Dec 2025', icon: '🏆' },
    ],
  };

  const handleCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Calling Guardian', `Dialing ${student.guardian.phone}...`);
  };

  const handleDownloadId = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('ID Card Downloaded', `Digital Student ID for ${student.name} saved to camera roll.`);
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
        <Text style={styles.navTitle}>Student Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTopRow}>
            <View style={styles.avatarBubble}>
              <Text style={styles.avatarEmoji}>👦🏻</Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.rollBadge}>
                <Text style={styles.rollBadgeText}>ROLL NO #{student.rollNo}</Text>
              </View>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.gradeText}>
                {student.grade} • {student.section}
              </Text>
              <Text style={styles.admissionText}>{student.admissionNo}</Text>
            </View>
          </View>

          {/* Quick Buttons */}
          <View style={styles.actionRow}>
            <Pressable
              onPress={handleCall}
              style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.75 }]}
            >
              <Phone size={14} color="#1b005a" />
              <Text style={styles.actionBtnText}>Call Parent</Text>
            </Pressable>

            <Pressable
              onPress={handleDownloadId}
              style={({ pressed }) => [styles.actionBtn, pressed && { opacity: 0.75 }]}
            >
              <Download size={14} color="#1b005a" />
              <Text style={styles.actionBtnText}>Student ID</Text>
            </Pressable>
          </View>
        </View>

        {/* Segmented Tabs */}
        <View style={styles.tabContainer}>
          {(['General', 'Performance', 'Badges'] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => {
                Haptics.selectionAsync();
                setActiveTab(tab);
              }}
              style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
            >
              <Text style={[styles.tabButtonText, activeTab === tab && styles.tabButtonTextActive]}>
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'General' && (
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Calendar size={15} color="#8b4a0dff" />
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoVal}>{student.dob}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <User size={15} color="#8b4a0dff" />
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Blood Group & House</Text>
                <Text style={styles.infoVal}>{student.bloodGroup} • {student.house}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Users size={15} color="#8b4a0dff" />
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Class Teacher</Text>
                <Text style={styles.infoVal}>{student.classTeacher}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Phone size={15} color="#8b4a0dff" />
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Guardian Contact</Text>
                <Text style={styles.infoVal}>{student.guardian.father} ({student.guardian.phone})</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <MapPin size={15} color="#8b4a0dff" />
              <View style={styles.infoCol}>
                <Text style={styles.infoLabel}>Residential Address</Text>
                <Text style={styles.infoVal}>{student.address}</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'Performance' && (
          <>
            <View style={styles.metricsRow}>
              <View style={[styles.metricCard, { backgroundColor: '#E8F5E9' }]}>
                <Text style={[styles.metricNumber, { color: '#15803D' }]}>{student.metrics.attendance}</Text>
                <Text style={styles.metricLabel}>Attendance</Text>
                <Text style={styles.metricSub}>{student.metrics.attendanceDays}</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: '#EDE9FE' }]}>
                <Text style={[styles.metricNumber, { color: '#6C4DFF' }]}>{student.metrics.rank}</Text>
                <Text style={styles.metricLabel}>Class Rank</Text>
                <Text style={styles.metricSub}>Academic Stand</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: '#FFF3E0' }]}>
                <Text style={[styles.metricNumber, { color: '#E65100' }]}>{student.metrics.gpa}</Text>
                <Text style={styles.metricLabel}>Overall Score</Text>
                <Text style={styles.metricSub}>Grade {student.metrics.grade}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Recent Assessment Highlights</Text>
              {[
                { subject: 'Mathematics Unit Test', score: '48 / 50', status: 'Distinction' },
                { subject: 'Science Practical', score: '28 / 30', status: 'Excellent' },
                { subject: 'English Essay Writing', score: '22 / 25', status: 'Good' },
                { subject: 'Social Studies Quiz', score: '24 / 25', status: 'Distinction' },
              ].map((item, idx) => (
                <View key={idx} style={styles.assessmentRow}>
                  <View>
                    <Text style={styles.assessmentSubject}>{item.subject}</Text>
                    <Text style={styles.assessmentStatus}>{item.status}</Text>
                  </View>
                  <Text style={styles.assessmentScore}>{item.score}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === 'Badges' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Awards & Recognition</Text>
            {student.achievements.map((ach) => (
              <View key={ach.id} style={styles.badgeItem}>
                <Text style={styles.badgeEmoji}>{ach.icon}</Text>
                <View style={styles.badgeContent}>
                  <Text style={styles.badgeTitle}>{ach.title}</Text>
                  <Text style={styles.badgeDate}>Conferred: {ach.date}</Text>
                </View>
                <ShieldCheck size={18} color="#15803D" />
              </View>
            ))}
          </View>
        )}
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

  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    padding: 16,
    marginBottom: 16,
  },
  profileTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  avatarBubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#feffe0ff',
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  rollBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  rollBadgeText: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 9,
    color: '#6C4DFF',
    fontWeight: '700',
  },
  studentName: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 18,
    color: '#100707ff',
    fontWeight: '700',
  },
  gradeText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 13,
    color: '#555',
  },
  admissionText: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#888',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0ece0',
    paddingTop: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#fafaf5',
    borderWidth: 1,
    borderColor: '#dcd8c8',
    paddingVertical: 9,
    borderRadius: 8,
  },
  actionBtnText: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 12,
    color: '#1b005a',
    fontWeight: '600',
  },

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

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dbbfa5ff',
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 14,
    color: '#100707ff',
    fontWeight: '700',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 6,
  },
  infoCol: { flex: 1 },
  infoLabel: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#888' },
  infoVal: { fontFamily: 'Roboto_600SemiBold', fontSize: 13, color: '#222', marginTop: 1 },
  divider: { height: 1, backgroundColor: '#f0ece0', marginVertical: 4 },

  metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  metricCard: {
    flex: 1,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e0d0',
  },
  metricNumber: { fontFamily: 'Roboto_700Bold', fontSize: 18, fontWeight: '700' },
  metricLabel: { fontFamily: 'Roboto_600SemiBold', fontSize: 11, color: '#444', marginTop: 2 },
  metricSub: { fontFamily: 'Roboto_400Regular', fontSize: 9, color: '#888', marginTop: 1 },

  assessmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0ece0',
  },
  assessmentSubject: { fontFamily: 'Roboto_600SemiBold', fontSize: 13, color: '#222' },
  assessmentStatus: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#15803D', marginTop: 1 },
  assessmentScore: { fontFamily: 'Roboto_700Bold', fontSize: 13, color: '#100707ff', fontWeight: '700' },

  badgeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0ece0',
  },
  badgeEmoji: { fontSize: 24 },
  badgeContent: { flex: 1 },
  badgeTitle: { fontFamily: 'Roboto_600SemiBold', fontSize: 13, color: '#222' },
  badgeDate: { fontFamily: 'Roboto_400Regular', fontSize: 11, color: '#888', marginTop: 2 },
});
