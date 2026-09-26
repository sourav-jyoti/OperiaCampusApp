import { StyleSheet } from 'react-native';

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
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 5,
  },

  description: {
    fontSize: 12,
    lineHeight: 16,
    color: '#343434',
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
    fontWeight: '600',
  },

  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
});

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
    marginBottom: '4%',
    marginTop: '5%',
  },
  componentText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerLine: {
    borderWidth: 1.5,
    maxWidth: '8%',
    marginTop: 2,
    borderColor: '#000000ff',
    backgroundColor: '#000000ff',
  },

  //Alert container
  alertContainer: {
    gap: 10,
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
    width: '30%',
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
