import { StyleSheet } from 'react-native';

export const MoreSTyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9eaff',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 4,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dcd8c8',
  },
  scrollContent: {
    paddingBottom: 20,
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

  ///
  quickActionContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
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
    width: 50,
    height: 45,
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
});
