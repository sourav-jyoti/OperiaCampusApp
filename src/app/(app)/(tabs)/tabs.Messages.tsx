import { useTabBarVisibility } from '@/context/TabBarVisibilityContext';
import { mockTeacherConversations, mockTeachers } from '@/utilities/mockdata';
import type { ChatAttachment, ChatMessage, Teacher, TeacherConversation } from '@/utilities/types';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCheck,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Image as ImageIcon,
  Info,
  Mail,
  MapPin,
  Mic,
  Paperclip,
  Phone,
  PhoneCall,
  PhoneOff,
  Pin,
  Plus,
  Search,
  Send,
  Sparkles,
  UserCheck,
  Video,
  X,
} from 'lucide-react-native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ─── Filter Categories ────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Class Teacher', 'Science', 'Mathematics', 'Languages', 'Unread'];

// ─── Suggested Quick Replies by Subject ──────────────────────────────────────
const QUICK_SUGGESTIONS: Record<string, string[]> = {
  default: [
    'Thank you, teacher! 🙏',
    'I will submit the assignment shortly.',
    'Can I meet you during lunch break?',
    'Could you please clarify Question 4?',
  ],
  'Physics & Science': [
    'Submitted the ray diagram workbook! 📄',
    'Are we having the lab practical tomorrow?',
    'Thank you for the reference PDF, ma\'am!',
    'Can I re-verify my lab reading at 2 PM?',
  ],
  Mathematics: [
    'Solved questions 4 to 9, thank you Sir! 👍',
    'Could you review question 7 step-by-step?',
    'Will bring my formula handbook tomorrow.',
    'Understood the linear equation method.',
  ],
  'Computer Science': [
    'Fixed the recursion base condition! 💻',
    'Submitted the BST Python code on portal.',
    'Can I test my code on Lab PC 4?',
    'Thank you Sir, the logic works now!',
  ],
};

// ─── Simulated Teacher Responses ─────────────────────────────────────────────
const AUTO_RESPONSES: Record<string, string[]> = {
  'tch-1': [
    'Good work, Sourav! Keep your practical journal updated.',
    'Noted. Bring your notebook to Staff Room 2 during lunch break.',
    'Remember to maintain the correct focal length scale in the diagram.',
  ],
  'tch-2': [
    'Well done! Practice the word problems in chapter 4 as well.',
    'I will solve that doubt on the board at the beginning of tomorrow\'s class.',
    'Correct approach! Keep practicing with positive and negative integers.',
  ],
  'tch-3': [
    'Received! Keep up the good work in practical chemistry.',
    'Please verify the chemical equation balancing once more before submission.',
  ],
  'tch-4': [
    'I will review your paragraph structure and share remarks by this evening.',
    'Good expression! Make sure your word count stays within the 250-word limit.',
  ],
  'tch-5': [
    'Great job fixing the base condition! Test it with edge cases like an empty tree.',
    'Code looks clean. Be ready to explain the time complexity tomorrow.',
  ],
  'tch-6': [
    'Approved. Make sure all key historical dates are highlighted on the timeline.',
  ],
  'tch-7': [
    'Good enthusiasm! Don\'t forget proper warm-up before entering the court.',
  ],
};

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showTabBar, hideTabBar } = useTabBarVisibility();

  // ─── State ─────────────────────────────────────────────────────────────────
  const [conversations, setConversations] = useState<Record<string, TeacherConversation>>(mockTeacherConversations);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [activeCallTeacher, setActiveCallTeacher] = useState<Teacher | null>(null);

  // Pulse animation for online indicator
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const messagesScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Tab bar visibility control: Hide when in chat, show when in teacher list
  useEffect(() => {
    if (selectedTeacherId) {
      hideTabBar();
    } else {
      showTabBar();
    }
    return () => {
      showTabBar();
    };
  }, [selectedTeacherId, hideTabBar, showTabBar]);

  // Auto scroll to bottom when entering conversation or receiving messages
  useEffect(() => {
    if (selectedTeacherId) {
      const timer = setTimeout(() => {
        messagesScrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedTeacherId, conversations, isTyping]);

  // ─── Active Conversation & Teacher ──────────────────────────────────────────
  const activeConversation = useMemo(() => {
    if (!selectedTeacherId) return null;
    return conversations[selectedTeacherId] || null;
  }, [selectedTeacherId, conversations]);

  const activeTeacher = activeConversation?.teacher;

  // ─── Filtered Teachers ──────────────────────────────────────────────────────
  const filteredTeacherList = useMemo(() => {
    return mockTeachers.filter((teacher) => {
      const conv = conversations[teacher.id];
      const matchesSearch =
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.role.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedCategory === 'All') return true;
      if (selectedCategory === 'Class Teacher') return teacher.role.includes('Class Teacher');
      if (selectedCategory === 'Science') return teacher.department === 'Science';
      if (selectedCategory === 'Mathematics') return teacher.department === 'Mathematics';
      if (selectedCategory === 'Languages') return teacher.department === 'Languages';
      if (selectedCategory === 'Unread') return (conv?.unreadCount || 0) > 0;

      return true;
    });
  }, [searchQuery, selectedCategory, conversations]);

  // ─── Select Teacher & Mark as Read ──────────────────────────────────────────
  const handleSelectTeacher = (teacher: Teacher) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTeacherId(teacher.id);

    // Mark unread messages as read
    if (conversations[teacher.id]?.unreadCount > 0) {
      setConversations((prev) => ({
        ...prev,
        [teacher.id]: {
          ...prev[teacher.id],
          unreadCount: 0,
        },
      }));
    }
  };

  const handleBackToTeachers = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedTeacherId(null);
    setShowTeacherModal(false);
  };

  // ─── Send Message ───────────────────────────────────────────────────────────
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || !selectedTeacherId) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: timeString,
      status: 'delivered',
    };

    setConversations((prev) => {
      const currentConv = prev[selectedTeacherId];
      if (!currentConv) return prev;

      return {
        ...prev,
        [selectedTeacherId]: {
          ...currentConv,
          lastMessage: text,
          lastMessageTime: timeString,
          messages: [...currentConv.messages, newMsg],
        },
      };
    });

    setInputMessage('');

    // Trigger simulated teacher typing & auto-response
    setIsTyping(true);
    const teacherId = selectedTeacherId;

    setTimeout(() => {
      setIsTyping(false);
      const responses = AUTO_RESPONSES[teacherId] || [
        'Thank you for your update, Sourav! Noted.',
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const responseTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: 'teacher',
        text: randomResponse,
        timestamp: responseTime,
        status: 'delivered',
      };

      setConversations((prev) => {
        const currentConv = prev[teacherId];
        if (!currentConv) return prev;

        return {
          ...prev,
          [teacherId]: {
            ...currentConv,
            lastMessage: randomResponse,
            lastMessageTime: responseTime,
            messages: [...currentConv.messages, replyMsg],
          },
        };
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1400);
  };

  // ─── Send Attachment ────────────────────────────────────────────────────────
  const handleSendAttachment = (type: 'pdf' | 'doc' | 'image', name: string, size: string) => {
    if (!selectedTeacherId) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowAttachModal(false);

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const attachment: ChatAttachment = { name, type, size };
    const newMsg: ChatMessage = {
      id: `msg-att-${Date.now()}`,
      sender: 'user',
      text: `Sent file: ${name}`,
      timestamp: timeString,
      status: 'delivered',
      attachment,
    };

    setConversations((prev) => {
      const currentConv = prev[selectedTeacherId];
      if (!currentConv) return prev;

      return {
        ...prev,
        [selectedTeacherId]: {
          ...currentConv,
          lastMessage: `📎 ${name}`,
          lastMessageTime: timeString,
          messages: [...currentConv.messages, newMsg],
        },
      };
    });

    // Simulated acknowledgement from teacher
    setIsTyping(true);
    const teacherId = selectedTeacherId;
    setTimeout(() => {
      setIsTyping(false);
      const replyMsg: ChatMessage = {
        id: `msg-reply-att-${Date.now()}`,
        sender: 'teacher',
        text: 'Received your attachment! I will inspect it and revert shortly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered',
      };

      setConversations((prev) => {
        const currentConv = prev[teacherId];
        if (!currentConv) return prev;

        return {
          ...prev,
          [teacherId]: {
            ...currentConv,
            lastMessage: replyMsg.text,
            lastMessageTime: replyMsg.timestamp,
            messages: [...currentConv.messages, replyMsg],
          },
        };
      });
    }, 1500);
  };

  // ─── Voice / Video Call Simulation ──────────────────────────────────────────
  const startCall = (teacher: Teacher) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActiveCallTeacher(teacher);
  };

  const endCall = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveCallTeacher(null);
  };

  // Quick suggestions based on subject
  const currentSuggestions = useMemo(() => {
    if (!activeTeacher) return QUICK_SUGGESTIONS.default;
    return QUICK_SUGGESTIONS[activeTeacher.subject] || QUICK_SUGGESTIONS.default;
  }, [activeTeacher]);

  return (
    <View style={[styles.rootContainer, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* ────────────────────────────────────────────────────────────────────────
          VIEW 1: TEACHER DIRECTORY & CONVERSATION LIST (INBOX)
      ──────────────────────────────────────────────────────────────────────── */}
      {!selectedTeacherId && (
        <View style={styles.inboxContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <View style={styles.headerTitleRow}>
                <Text style={styles.headerTitle}>Faculty Chat</Text>
                <View style={styles.activeFacultyBadge}>
                  <Sparkles size={13} color="#2563EB" />
                  <Text style={styles.activeFacultyBadgeText}>Campus Live</Text>
                </View>
              </View>
              <Text style={styles.headerSubtitle}>Direct messages with your course teachers</Text>
            </View>

            <Pressable
              style={styles.headerActionBtn}
              onPress={() => router.push('/(Tiles)/Meetings')}
            >
              <Calendar size={18} color="#1E293B" />
            </Pressable>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Search size={18} color="#94A3B8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search faculty by name, subject, or role..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
                <X size={16} color="#64748B" />
              </Pressable>
            )}
          </View>

          {/* Category Filter Pills */}
          <View style={styles.categoriesWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}
            >
              {CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <Pressable
                    key={category}
                    style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedCategory(category);
                    }}
                  >
                    <Text
                      style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}
                    >
                      {category}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Main Teachers List Scroll */}
          <ScrollView
            style={styles.teachersScroll}
            contentContainerStyle={[
              styles.teachersScrollContent,
              { paddingBottom: 110 + insets.bottom },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Active Faculty Story / Quick-Access Strip */}
            {searchQuery === '' && (
              <View style={styles.onlineSection}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Available Teachers</Text>
                  <Text style={styles.sectionSubCount}>
                    {mockTeachers.filter((t) => t.isOnline).length} Online now
                  </Text>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.onlineScroll}
                >
                  {mockTeachers.map((teacher) => (
                    <Pressable
                      key={`strip-${teacher.id}`}
                      style={styles.onlineTeacherCard}
                      onPress={() => handleSelectTeacher(teacher)}
                    >
                      <View style={styles.onlineAvatarWrapper}>
                        <View
                          style={[
                            styles.onlineAvatarCircle,
                            { backgroundColor: teacher.avatarBg, borderColor: teacher.avatarColor },
                          ]}
                        >
                          <Text style={[styles.onlineAvatarText, { color: teacher.avatarColor }]}>
                            {teacher.avatarText}
                          </Text>
                        </View>
                        {teacher.isOnline ? (
                          <Animated.View
                            style={[
                              styles.onlineStatusPulse,
                              { transform: [{ scale: pulseAnim }] },
                            ]}
                          />
                        ) : (
                          <View style={styles.offlineStatusDot} />
                        )}
                      </View>
                      <Text style={styles.onlineTeacherName} numberOfLines={1}>
                        {teacher.name.split(' ')[1] || teacher.name}
                      </Text>
                      <Text style={styles.onlineTeacherSubject} numberOfLines={1}>
                        {teacher.subject.split(' ')[0]}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Conversation List Header */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Conversations</Text>
              <Text style={styles.sectionSubCount}>{filteredTeacherList.length} faculty</Text>
            </View>

            {/* List of Teachers */}
            {filteredTeacherList.length === 0 ? (
              <View style={styles.emptyState}>
                <Search size={40} color="#CBD5E1" />
                <Text style={styles.emptyStateTitle}>No teachers found</Text>
                <Text style={styles.emptyStateSubtitle}>
                  Try searching with a different name, subject or reset filter.
                </Text>
                <Pressable
                  style={styles.emptyResetBtn}
                  onPress={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                >
                  <Text style={styles.emptyResetBtnText}>Reset Search</Text>
                </Pressable>
              </View>
            ) : (
              filteredTeacherList.map((teacher) => {
                const conv = conversations[teacher.id];
                const unread = conv?.unreadCount || 0;
                const isPinned = conv?.isPinned;

                return (
                  <Pressable
                    key={teacher.id}
                    style={({ pressed }) => [
                      styles.teacherCard,
                      pressed && styles.teacherCardPressed,
                      unread > 0 && styles.teacherCardUnread,
                    ]}
                    onPress={() => handleSelectTeacher(teacher)}
                  >
                    {/* Avatar with indicator */}
                    <View style={styles.teacherAvatarContainer}>
                      <View
                        style={[
                          styles.teacherAvatar,
                          { backgroundColor: teacher.avatarBg, borderColor: teacher.avatarColor },
                        ]}
                      >
                        <Text style={[styles.teacherAvatarText, { color: teacher.avatarColor }]}>
                          {teacher.avatarText}
                        </Text>
                      </View>
                      {teacher.isOnline ? (
                        <View style={styles.onlineBadgeDot} />
                      ) : (
                        <View style={styles.offlineBadgeDot} />
                      )}
                    </View>

                    {/* Middle Info */}
                    <View style={styles.teacherCardInfo}>
                      <View style={styles.teacherCardTopRow}>
                        <View style={styles.teacherNameGroup}>
                          <Text style={styles.teacherName} numberOfLines={1}>
                            {teacher.name}
                          </Text>
                          {isPinned && <Pin size={13} color="#2563EB" fill="#2563EB" />}
                        </View>
                        <Text
                          style={[
                            styles.teacherTimeText,
                            unread > 0 && styles.teacherTimeTextUnread,
                          ]}
                        >
                          {conv?.lastMessageTime || 'Recently'}
                        </Text>
                      </View>

                      {/* Role & Subject Pill */}
                      <View style={styles.roleRow}>
                        <View style={styles.subjectPill}>
                          <Text style={styles.subjectPillText}>{teacher.subject}</Text>
                        </View>
                        <Text style={styles.teacherRoleText} numberOfLines={1}>
                          {teacher.role}
                        </Text>
                      </View>

                      {/* Last Message Snippet */}
                      <View style={styles.lastMessageRow}>
                        <Text
                          style={[
                            styles.lastMessageText,
                            unread > 0 && styles.lastMessageTextUnread,
                          ]}
                          numberOfLines={1}
                        >
                          {conv?.lastMessage || 'No recent messages'}
                        </Text>
                        {unread > 0 ? (
                          <View style={styles.unreadBadge}>
                            <Text style={styles.unreadBadgeText}>{unread}</Text>
                          </View>
                        ) : (
                          <CheckCheck size={14} color="#94A3B8" />
                        )}
                      </View>
                    </View>
                  </Pressable>
                );
              })
            )}
          </ScrollView>
        </View>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          VIEW 2: TEACHER DIRECT CHAT SCREEN (CONVERSATION VIEW)
      ──────────────────────────────────────────────────────────────────────── */}
      {selectedTeacherId && activeTeacher && activeConversation && (
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          {/* Chat Top Bar */}
          <View style={styles.chatHeader}>
            <Pressable
              style={styles.chatBackBtn}
              onPress={handleBackToTeachers}
              hitSlop={12}
            >
              <ArrowLeft size={22} color="#0F172A" />
            </Pressable>

            {/* Teacher Details Pill Button */}
            <Pressable
              style={styles.chatHeaderTeacherInfo}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowTeacherModal(true);
              }}
            >
              <View
                style={[
                  styles.chatHeaderAvatar,
                  { backgroundColor: activeTeacher.avatarBg, borderColor: activeTeacher.avatarColor },
                ]}
              >
                <Text style={[styles.chatHeaderAvatarText, { color: activeTeacher.avatarColor }]}>
                  {activeTeacher.avatarText}
                </Text>
              </View>

              <View style={styles.chatHeaderNameContainer}>
                <View style={styles.chatHeaderTitleRow}>
                  <Text style={styles.chatHeaderName} numberOfLines={1}>
                    {activeTeacher.name}
                  </Text>
                  <UserCheck size={14} color="#2563EB" />
                </View>
                <Text style={styles.chatHeaderStatus} numberOfLines={1}>
                  {activeTeacher.isOnline ? 'Active now' : activeTeacher.statusText} • {activeTeacher.subject}
                </Text>
              </View>
            </Pressable>

            {/* Header Action Buttons */}
            <View style={styles.chatHeaderActions}>
              <Pressable
                style={styles.chatHeaderActionBtn}
                onPress={() => startCall(activeTeacher)}
                hitSlop={8}
              >
                <Phone size={18} color="#2563EB" />
              </Pressable>

              <Pressable
                style={styles.chatHeaderActionBtn}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowTeacherModal(true);
                }}
                hitSlop={8}
              >
                <Info size={18} color="#64748B" />
              </Pressable>
            </View>
          </View>

          {/* Teacher Consultation Banner */}
          <View style={styles.consultationBanner}>
            <View style={styles.consultationIconWrap}>
              <Clock size={13} color="#2563EB" />
            </View>
            <Text style={styles.consultationText} numberOfLines={1}>
              Office Hours: <Text style={styles.consultationTextBold}>{activeTeacher.officeHours}</Text> ({activeTeacher.room})
            </Text>
          </View>

          {/* Messages Scroll Feed */}
          <ScrollView
            ref={messagesScrollRef}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesListContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Security & Academic Privacy Disclaimer */}
            <View style={styles.securityBanner}>
              <Text style={styles.securityBannerText}>
                🔒 Official Operia Campus Portal. Messages are logged for academic compliance and safety.
              </Text>
            </View>

            {/* Date Separator */}
            <View style={styles.dateSeparator}>
              <View style={styles.dateSeparatorLine} />
              <Text style={styles.dateSeparatorText}>Conversation History</Text>
              <View style={styles.dateSeparatorLine} />
            </View>

            {/* Messages */}
            {activeConversation.messages.map((message) => {
              const isUser = message.sender === 'user';
              return (
                <View
                  key={message.id}
                  style={[
                    styles.messageRow,
                    isUser ? styles.messageRowUser : styles.messageRowTeacher,
                  ]}
                >
                  {!isUser && (
                    <View
                      style={[
                        styles.msgTeacherAvatar,
                        { backgroundColor: activeTeacher.avatarBg, borderColor: activeTeacher.avatarColor },
                      ]}
                    >
                      <Text
                        style={[styles.msgTeacherAvatarText, { color: activeTeacher.avatarColor }]}
                      >
                        {activeTeacher.avatarText}
                      </Text>
                    </View>
                  )}

                  <View
                    style={[
                      styles.messageBubble,
                      isUser ? styles.messageBubbleUser : styles.messageBubbleTeacher,
                    ]}
                  >
                    {/* Attachment preview if any */}
                    {message.attachment && (
                      <View
                        style={[
                          styles.attachmentCard,
                          isUser ? styles.attachmentCardUser : styles.attachmentCardTeacher,
                        ]}
                      >
                        <View style={styles.attachmentIconBox}>
                          <FileText size={20} color="#2563EB" />
                        </View>
                        <View style={styles.attachmentInfo}>
                          <Text
                            style={[
                              styles.attachmentName,
                              isUser ? styles.attachmentNameUser : styles.attachmentNameTeacher,
                            ]}
                            numberOfLines={1}
                          >
                            {message.attachment.name}
                          </Text>
                          <Text
                            style={[
                              styles.attachmentSize,
                              isUser ? styles.attachmentSizeUser : styles.attachmentSizeTeacher,
                            ]}
                          >
                            {message.attachment.size} • {message.attachment.type.toUpperCase()}
                          </Text>
                        </View>
                        <Pressable
                          style={styles.attachmentDownloadBtn}
                          onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            Alert.alert('Download File', `Downloading ${message.attachment?.name}`);
                          }}
                        >
                          <Download size={14} color="#2563EB" />
                        </Pressable>
                      </View>
                    )}

                    <Text
                      style={[
                        styles.messageText,
                        isUser ? styles.messageTextUser : styles.messageTextTeacher,
                      ]}
                    >
                      {message.text}
                    </Text>

                    <View style={styles.messageFooterRow}>
                      <Text
                        style={[
                          styles.messageTimestamp,
                          isUser ? styles.messageTimestampUser : styles.messageTimestampTeacher,
                        ]}
                      >
                        {message.timestamp}
                      </Text>
                      {isUser && (
                        <View style={styles.readReceipt}>
                          {message.status === 'read' ? (
                            <CheckCheck size={13} color="#93C5FD" />
                          ) : (
                            <Check size={13} color="#93C5FD" />
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}

            {/* Teacher Typing Indicator */}
            {isTyping && (
              <View style={[styles.messageRow, styles.messageRowTeacher]}>
                <View
                  style={[
                    styles.msgTeacherAvatar,
                    { backgroundColor: activeTeacher.avatarBg, borderColor: activeTeacher.avatarColor },
                  ]}
                >
                  <Text style={[styles.msgTeacherAvatarText, { color: activeTeacher.avatarColor }]}>
                    {activeTeacher.avatarText}
                  </Text>
                </View>
                <View style={[styles.messageBubble, styles.messageBubbleTeacher, styles.typingBubble]}>
                  <Text style={styles.typingIndicatorText}>
                    {activeTeacher.title} {activeTeacher.name.split(' ').slice(-1)[0]} is typing...
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Quick Suggested Replies Strip */}
          <View style={styles.quickRepliesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickRepliesScroll}
            >
              {currentSuggestions.map((suggestion, index) => (
                <Pressable
                  key={`sug-${index}`}
                  style={styles.quickReplyChip}
                  onPress={() => handleSendMessage(suggestion)}
                >
                  <Text style={styles.quickReplyChipText}>{suggestion}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Input Bar */}
          <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <Pressable
              style={styles.attachBtn}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowAttachModal(true);
              }}
              hitSlop={6}
            >
              <Plus size={20} color="#475569" />
            </Pressable>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder={`Message ${activeTeacher.name}...`}
                placeholderTextColor="#94A3B8"
                value={inputMessage}
                onChangeText={setInputMessage}
                multiline
                maxLength={500}
              />
            </View>

            <Pressable
              style={[
                styles.sendBtn,
                inputMessage.trim().length > 0 ? styles.sendBtnActive : styles.sendBtnDisabled,
              ]}
              disabled={inputMessage.trim().length === 0}
              onPress={() => handleSendMessage()}
            >
              <Send
                size={18}
                color={inputMessage.trim().length > 0 ? '#FFFFFF' : '#94A3B8'}
              />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* ────────────────────────────────────────────────────────────────────────
          MODAL 1: TEACHER PROFILE & CABIN DETAILS
      ──────────────────────────────────────────────────────────────────────── */}
      <Modal
        visible={showTeacherModal && activeTeacher !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setShowTeacherModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowTeacherModal(false)} />
          <View style={[styles.modalSheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <View style={styles.modalHandle} />

            {activeTeacher && (
              <>
                <View style={styles.modalHeader}>
                  <View
                    style={[
                      styles.modalAvatar,
                      { backgroundColor: activeTeacher.avatarBg, borderColor: activeTeacher.avatarColor },
                    ]}
                  >
                    <Text style={[styles.modalAvatarText, { color: activeTeacher.avatarColor }]}>
                      {activeTeacher.avatarText}
                    </Text>
                  </View>
                  <Text style={styles.modalTeacherName}>{activeTeacher.name}</Text>
                  <Text style={styles.modalTeacherRole}>{activeTeacher.role}</Text>
                  <View style={styles.modalSubjectBadge}>
                    <Text style={styles.modalSubjectBadgeText}>{activeTeacher.subject}</Text>
                  </View>
                </View>

                {/* Details List */}
                <View style={styles.modalInfoList}>
                  <View style={styles.modalInfoItem}>
                    <View style={styles.modalInfoIconWrap}>
                      <MapPin size={18} color="#2563EB" />
                    </View>
                    <View style={styles.modalInfoTextWrap}>
                      <Text style={styles.modalInfoLabel}>Cabin / Room Location</Text>
                      <Text style={styles.modalInfoValue}>{activeTeacher.room}</Text>
                    </View>
                  </View>

                  <View style={styles.modalInfoItem}>
                    <View style={styles.modalInfoIconWrap}>
                      <Clock size={18} color="#D97706" />
                    </View>
                    <View style={styles.modalInfoTextWrap}>
                      <Text style={styles.modalInfoLabel}>Consultation Hours</Text>
                      <Text style={styles.modalInfoValue}>{activeTeacher.officeHours}</Text>
                    </View>
                  </View>

                  <View style={styles.modalInfoItem}>
                    <View style={styles.modalInfoIconWrap}>
                      <Mail size={18} color="#0D9488" />
                    </View>
                    <View style={styles.modalInfoTextWrap}>
                      <Text style={styles.modalInfoLabel}>Campus Email</Text>
                      <Text style={styles.modalInfoValue}>{activeTeacher.email}</Text>
                    </View>
                  </View>

                  <View style={styles.modalInfoItem}>
                    <View style={styles.modalInfoIconWrap}>
                      <Phone size={18} color="#7C3AED" />
                    </View>
                    <View style={styles.modalInfoTextWrap}>
                      <Text style={styles.modalInfoLabel}>Desk Extension / Contact</Text>
                      <Text style={styles.modalInfoValue}>{activeTeacher.phone || 'Campus PBX Ext: 204'}</Text>
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.modalActionsRow}>
                  <Pressable
                    style={styles.modalCallActionBtn}
                    onPress={() => {
                      setShowTeacherModal(false);
                      startCall(activeTeacher);
                    }}
                  >
                    <Phone size={18} color="#FFFFFF" />
                    <Text style={styles.modalCallActionBtnText}>Call Faculty</Text>
                  </Pressable>

                  <Pressable
                    style={styles.modalCloseActionBtn}
                    onPress={() => setShowTeacherModal(false)}
                  >
                    <Text style={styles.modalCloseActionBtnText}>Close</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ────────────────────────────────────────────────────────────────────────
          MODAL 2: ATTACHMENT PICKER SHEET
      ──────────────────────────────────────────────────────────────────────── */}
      <Modal
        visible={showAttachModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowAttachModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowAttachModal(false)} />
          <View style={[styles.attachSheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            <View style={styles.modalHandle} />
            <Text style={styles.attachSheetTitle}>Share with Teacher</Text>
            <Text style={styles.attachSheetSubtitle}>
              Select academic file or practical diagram to share
            </Text>

            <View style={styles.attachGrid}>
              <Pressable
                style={styles.attachOption}
                onPress={() =>
                  handleSendAttachment(
                    'pdf',
                    `${activeTeacher?.subject.split(' ')[0]}_Assignment_Draft.pdf`,
                    '1.2 MB'
                  )
                }
              >
                <View style={[styles.attachOptionIcon, { backgroundColor: '#EFF6FF' }]}>
                  <FileText size={24} color="#2563EB" />
                </View>
                <Text style={styles.attachOptionTitle}>Assignment PDF</Text>
                <Text style={styles.attachOptionSub}>Homework & Report</Text>
              </Pressable>

              <Pressable
                style={styles.attachOption}
                onPress={() =>
                  handleSendAttachment(
                    'image',
                    'Observation_Diagram_Lab.jpg',
                    '3.8 MB'
                  )
                }
              >
                <View style={[styles.attachOptionIcon, { backgroundColor: '#FDF2F8' }]}>
                  <ImageIcon size={24} color="#DB2777" />
                </View>
                <Text style={styles.attachOptionTitle}>Lab Diagram</Text>
                <Text style={styles.attachOptionSub}>Photo from Gallery</Text>
              </Pressable>

              <Pressable
                style={styles.attachOption}
                onPress={() =>
                  handleSendAttachment(
                    'doc',
                    'Term_Project_Synopsis.docx',
                    '840 KB'
                  )
                }
              >
                <View style={[styles.attachOptionIcon, { backgroundColor: '#F0FDF4' }]}>
                  <Download size={24} color="#16A34A" />
                </View>
                <Text style={styles.attachOptionTitle}>Word Document</Text>
                <Text style={styles.attachOptionSub}>Project Synopsis</Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.attachCancelBtn}
              onPress={() => setShowAttachModal(false)}
            >
              <Text style={styles.attachCancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ────────────────────────────────────────────────────────────────────────
          MODAL 3: CAMPUS FACULTY AUDIO CALL SIMULATOR
      ──────────────────────────────────────────────────────────────────────── */}
      <Modal
        visible={activeCallTeacher !== null}
        animationType="slide"
        transparent
        onRequestClose={endCall}
      >
        <View style={styles.callModalContainer}>
          <View style={styles.callModalCard}>
            <View
              style={[
                styles.callAvatar,
                { backgroundColor: activeCallTeacher?.avatarBg, borderColor: activeCallTeacher?.avatarColor },
              ]}
            >
              <Text style={[styles.callAvatarText, { color: activeCallTeacher?.avatarColor }]}>
                {activeCallTeacher?.avatarText}
              </Text>
            </View>

            <Text style={styles.callTeacherName}>{activeCallTeacher?.name}</Text>
            <Text style={styles.callSubjectText}>{activeCallTeacher?.subject}</Text>
            <Text style={styles.callStatusText}>Campus Voice Link • Ringing...</Text>

            <View style={styles.callTimerBadge}>
              <Clock size={14} color="#2563EB" />
              <Text style={styles.callTimerText}>Desk Ext: {activeCallTeacher?.room}</Text>
            </View>

            {/* Call Controls */}
            <View style={styles.callControlsRow}>
              <Pressable style={styles.callControlCircle} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                <Mic size={20} color="#475569" />
              </Pressable>

              <Pressable style={styles.callEndBtn} onPress={endCall}>
                <PhoneOff size={24} color="#FFFFFF" />
              </Pressable>

              <Pressable style={styles.callControlCircle} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
                <PhoneCall size={20} color="#475569" />
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Stylesheet ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // ── Inbox Header ──
  inboxContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 14,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  activeFacultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  activeFacultyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  headerActionBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  // ── Search Bar ──
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  searchIcon: {
    marginRight: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },

  // ── Categories ──
  categoriesWrapper: {
    marginTop: 14,
    marginBottom: 4,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
  },

  // ── Section Header ──
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionSubCount: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },

  // ── Online Faculty Strip ──
  onlineSection: {
    marginBottom: 4,
  },
  onlineScroll: {
    paddingHorizontal: 20,
    gap: 14,
  },
  onlineTeacherCard: {
    alignItems: 'center',
    width: 68,
  },
  onlineAvatarWrapper: {
    position: 'relative',
    marginBottom: 6,
  },
  onlineAvatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  onlineAvatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  onlineStatusPulse: {
    position: 'absolute',
    bottom: 0,
    right: 2,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  offlineStatusDot: {
    position: 'absolute',
    bottom: 0,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#94A3B8',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineTeacherName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
  },
  onlineTeacherSubject: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
  },

  // ── Teachers List Scroll ──
  teachersScroll: {
    flex: 1,
  },
  teachersScrollContent: {
    paddingTop: 4,
  },

  // ── Teacher Item Card ──
  teacherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  teacherCardPressed: {
    backgroundColor: '#F8FAFC',
    transform: [{ scale: 0.99 }],
  },
  teacherCardUnread: {
    borderColor: '#BFDBFE',
    backgroundColor: '#FAFCFF',
  },
  teacherAvatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  teacherAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  teacherAvatarText: {
    fontSize: 18,
    fontWeight: '700',
  },
  onlineBadgeDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  offlineBadgeDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#CBD5E1',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  teacherCardInfo: {
    flex: 1,
  },
  teacherCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  teacherNameGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  teacherName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  teacherTimeText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  teacherTimeTextUnread: {
    color: '#2563EB',
    fontWeight: '700',
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  subjectPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  subjectPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  teacherRoleText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  lastMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessageText: {
    fontSize: 13,
    color: '#64748B',
    flex: 1,
    marginRight: 8,
  },
  lastMessageTextUnread: {
    color: '#0F172A',
    fontWeight: '600',
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── Empty State ──
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 14,
    marginBottom: 6,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyResetBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#2563EB',
    borderRadius: 10,
  },
  emptyResetBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // CHAT SCREEN STYLES
  // ──────────────────────────────────────────────────────────────────────────
  chatContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  chatBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHeaderTeacherInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chatHeaderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  chatHeaderAvatarText: {
    fontSize: 14,
    fontWeight: '700',
  },
  chatHeaderNameContainer: {
    flex: 1,
  },
  chatHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  chatHeaderName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  chatHeaderStatus: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  chatHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chatHeaderActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },

  // ── Consultation Banner ──
  consultationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    gap: 6,
  },
  consultationIconWrap: {
    justifyContent: 'center',
  },
  consultationText: {
    fontSize: 11,
    color: '#1E40AF',
    flex: 1,
  },
  consultationTextBold: {
    fontWeight: '700',
  },

  // ── Messages Feed ──
  messagesList: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  messagesListContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  securityBanner: {
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  securityBannerText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    gap: 10,
  },
  dateSeparatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dateSeparatorText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── Message Bubbles ──
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  messageRowTeacher: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  msgTeacherAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 2,
    borderWidth: 1,
  },
  msgTeacherAvatarText: {
    fontSize: 10,
    fontWeight: '700',
  },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  messageBubbleTeacher: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  messageBubbleUser: {
    backgroundColor: '#2563EB',
    borderBottomRightRadius: 4,
    shadowColor: '#2563EB',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextTeacher: {
    color: '#0F172A',
  },
  messageTextUser: {
    color: '#FFFFFF',
  },
  messageFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  messageTimestamp: {
    fontSize: 10,
  },
  messageTimestampTeacher: {
    color: '#94A3B8',
  },
  messageTimestampUser: {
    color: '#BFDBFE',
  },
  readReceipt: {
    marginLeft: 2,
  },

  // ── Attachment Inside Bubble ──
  attachmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    gap: 8,
  },
  attachmentCardTeacher: {
    backgroundColor: '#F1F5F9',
  },
  attachmentCardUser: {
    backgroundColor: '#1D4ED8',
  },
  attachmentIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 13,
    fontWeight: '600',
  },
  attachmentNameTeacher: {
    color: '#0F172A',
  },
  attachmentNameUser: {
    color: '#FFFFFF',
  },
  attachmentSize: {
    fontSize: 11,
    marginTop: 1,
  },
  attachmentSizeTeacher: {
    color: '#64748B',
  },
  attachmentSizeUser: {
    color: '#BFDBFE',
  },
  attachmentDownloadBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Typing Bubble ──
  typingBubble: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F1F5F9',
  },
  typingIndicatorText: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  },

  // ── Quick Replies ──
  quickRepliesContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingVertical: 8,
  },
  quickRepliesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickReplyChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  quickReplyChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
  },

  // ── Input Bar ──
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  attachBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 14,
    color: '#0F172A',
    paddingTop: Platform.OS === 'ios' ? 8 : 6,
    paddingBottom: Platform.OS === 'ios' ? 8 : 6,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnActive: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  sendBtnDisabled: {
    backgroundColor: '#E2E8F0',
  },

  // ──────────────────────────────────────────────────────────────────────────
  // MODAL STYLES
  // ──────────────────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 10,
    elevation: 10,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 10,
  },
  modalAvatarText: {
    fontSize: 24,
    fontWeight: '800',
  },
  modalTeacherName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },
  modalTeacherRole: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
  },
  modalSubjectBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  modalSubjectBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  modalInfoList: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    gap: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalInfoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalInfoTextWrap: {
    flex: 1,
  },
  modalInfoLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  modalInfoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCallActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  modalCallActionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalCloseActionBtn: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseActionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },

  // ── Attachment Modal Sheet ──
  attachSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  attachSheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  attachSheetSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 18,
  },
  attachGrid: {
    gap: 10,
    marginBottom: 18,
  },
  attachOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  attachOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  attachOptionSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  attachCancelBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  attachCancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },

  // ── Call Simulator Modal ──
  callModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  callModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 8,
  },
  callAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    marginBottom: 14,
  },
  callAvatarText: {
    fontSize: 28,
    fontWeight: '800',
  },
  callTeacherName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  callSubjectText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  callStatusText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 16,
  },
  callTimerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 24,
  },
  callTimerText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '600',
  },
  callControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  callControlCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callEndBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
});
