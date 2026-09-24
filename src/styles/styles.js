import { StyleSheet } from 'react-native';

export const DashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },

  scrollContent: {
    paddingBottom: 7,
  },

  // Header

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '4%',
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
    marginTop: '5%',
  },
  componentText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerLine: {
    borderWidth: 2,
    maxWidth: '10%',
    marginTop: 2,
    borderColor: '#000000ff',
  },

  // Alert Card

  alertContainer: {
    paddingHorizontal: '4%',
    paddingVertical: '2%',
    gap: 12,
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
    marginBottom: 5,
  },
  periodGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
    paddingHorizontal: '3%',
    marginBottom: '2%',
  },

  periodCard: {
    width: '32%',
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8b4a0dff',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '2%',
  },

  periodNumber: {
    width: '30%',
    fontSize: 27,
    fontWeight: '400',
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
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginTop: 15,
  },

  category: {
    flexDirection: 'column',
    width: '25%',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 3,
  },

  categoryIcon: {
    width: 65,
    height: 55,
    borderRadius: 13,
    backgroundColor: '#f3f8fc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#969387ff',
  },

  categoryText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#222',
    fontWeight: '400',
  },

  viewAllButton: {
    marginVertical: 10,
    flexDirection: 'row',
    gap: 10,
    borderWidth: 1,
    borderColor: '#a78104ff',
    width: '30%',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: 'center', // Centers the button horizontally in its parent
    alignItems: 'center', // Centers child elements (Text) horizontally
    justifyContent: 'center', // Centers child elements (Text) vertically
  },
  viewAllText: {
    textAlign: 'center',
    color: '#a78104', // adjust color as needed
  },
  section: {
    paddingVertical: 8,
  },
});
