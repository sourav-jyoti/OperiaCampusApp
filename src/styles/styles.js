import { StyleSheet } from 'react-native';

export const DashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },

  scrollContent: {
    paddingBottom: 110,
  },

  // Header

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '7%',
  },

  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 31,
    backgroundColor: '#feffe0ff',
    borderWidth: 1,
    borderColor: '#895f05de',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 18,
  },

  name: {
    fontSize: 18,
    fontWeight: '500',
    color: '#100707ff',
  },

  greeting: {
    fontSize: 13,
    color: '#141313ff',
    marginTop: 1,
  },

  helpButton: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#feffe0ff',
    borderWidth: 1,
    borderColor: '#121210de',
    justifyContent: 'center',
    alignItems: 'center',
  },

  //Component header
  componentHeader: {
    paddingLeft: '4%',
    marginBottom: '2%',
  },
  componentText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerLine: {
    borderWidth: 2,
    maxWidth: '10%',
    marginTop: 4,
    borderColor: '#000000ff',
  },

  // Alert Card

  alertContainer: {
    paddingHorizontal: '4%',
    paddingVertical: '2%',
    gap: 12,
  },

  alertBox: {
    marginBottom: '3%',
  },

  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',

    width: '100%',

    borderRadius: 20,
    paddingHorizontal: '4%',
    paddingver: '0.5%',
    borderWidth: 3,

    minHeight: 110,

    borderBottomWidth: 7,
  },

  alertContent: {
    flex: 1,
  },

  alertTitle: {
    fontSize: 17,
    fontWeight: '700',
  },

  alertDescription: {
    color: '#222',
    fontSize: 14,
    fontWeight: '300',
    marginTop: 4,
  },

  alertButton: {
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  alertButtonText: {
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 6,
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },

  //Timetable

  timeTableDate: {
    fontWeight: '300',
    color: '#222',
    fontSize: 14,
    marginTop: 10,
  },
  periodGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
    paddingHorizontal: '4%',
  },

  periodCard: {
    width: '28%',
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8b4a0dff',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '3%',
  },

  periodNumber: {
    width: '27%',
    fontSize: 18,
    fontWeight: '700',
    color: '#8b4a0dff',
    textAlign: 'center',
  },

  subject: {
    flex: 1,
    marginLeft: '4%',
    fontSize: 10,
    fontWeight: '500',
    color: '#555555',
  },

  emptyPeriod: {
    opacity: 0,
  },

  // Quick Actions

  quickActionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    marginTop: 38,
  },

  category: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 32,
  },

  categoryIcon: {
    width: 84,
    height: 84,
    borderRadius: 13,
    backgroundColor: '#f3f8fc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  categoryText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 23,
    color: '#222',
    fontWeight: '500',
  },

  // Bottom Navigation

  bottomNav: {
    position: 'absolute',
    left: 25,
    right: 25,
    bottom: 16,
    height: 78,
    borderRadius: 28,
    backgroundColor: '#111111',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  navText: {
    fontSize: 14,
    color: '#858585',
  },

  activeNavText: {
    color: '#fff',
  },
});
