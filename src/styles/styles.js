import { StyleSheet } from 'react-native';

export const DashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF9E6',
    borderWidth: 1,
    borderColor: '#F2A51A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 22,
  },
  greeting: {
    fontSize: 13,
    color: '#687080',
    marginBottom: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#172033',
    marginBottom: 2,
  },
  classSection: {
    fontSize: 12,
    color: '#687080',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e53935',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  paginationDotActive: {
    width: 12,
    backgroundColor: '#F2A51A',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#172033',
  },
  sectionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#687080',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F2A51A',
  },
  timetableContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 10,
  },
  timetableCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  periodNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  timetableTimeContainer: {
    width: 90,
    paddingHorizontal: 12,
  },
  timetableTime: {
    fontSize: 12,
    color: '#687080',
    fontWeight: '500',
  },
  timetableIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  timetableInfo: {
    flex: 1,
  },
  timetableSubject: {
    fontSize: 15,
    fontWeight: '600',
    color: '#172033',
    marginBottom: 2,
  },
  timetableTeacher: {
    fontSize: 12,
    color: '#687080',
  },
  quickActionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  quickActionItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#172033',
    textAlign: 'center',
    fontWeight: '500',
  },
  upcomingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  upcomingCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  upcomingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  upcomingInfo: {
    flex: 1,
    marginBottom: 8,
  },
  upcomingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#172033',
    marginBottom: 4,
  },
  upcomingSubtitle: {
    fontSize: 12,
    color: '#687080',
    marginBottom: 6,
  },
  upcomingTime: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2196f3',
  },
  pressedCard: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});


export const AlertCardStyle = StyleSheet.create({
  card: {
    height: 120,
    borderWidth: 2,
    borderRadius: 18,
    overflow: 'hidden',

    flexDirection: 'row',
    alignItems: 'center',

    paddingLeft: 14,
    paddingRight: 12,

    borderBottomWidth: 5,

    position: 'relative',
  },

  decorativeWave: {
    position: 'absolute',
    right: -5,
    top: -5,
  },
  decorativeCircle: {
    position: 'absolute',

    width: 115,
    height: 115,

    borderRadius: 60,

    left: -10,
    top: -35,

    opacity: 0.12,
  },

  content: {
    flex: 1,
    paddingRight: 8,
    zIndex: 2,
  },

  title: {
    fontFamily: 'Roboto_600SemiBold',
    fontSize: 16,
    marginBottom: 5,
  },

  description: {
    fontFamily: 'Roboto_300Light',
    fontSize: 14,
    lineHeight: 16,
    color: '#000000ff',
  },

  actionButton: {
    minWidth: 68,
    height: 34,

    paddingHorizontal: 10,

    borderRadius: 18,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 2,

    zIndex: 3,
  },

  actionText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Roboto_600SemiBold',
  },

  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});
