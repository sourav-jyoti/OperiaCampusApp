import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Bell } from 'lucide-react-native';
import { useScreenSize } from '../../../hooks/responsiveSize';

import { LinearGradient } from 'expo-linear-gradient';

import { DashboardStyles } from '../../../styles/styles';

import { Umbrella } from 'lucide-react-native';

import { Href } from 'expo-router';

const styles = DashboardStyles;

const profile: { name: string; uuid: string; role: string; permision: string[] } = {
  name: 'sourav',
  uuid: '123',
  role: 'teacher',
  permision: ['create', 'read', 'update', 'delete'],
};

const bannerNotice: { title: string; description: string; path: string; pathname: string; Color: { Border: string; Button: string } }[] = [
  {
    title: 'Fee due',
    description: 'Your fee payment is pending . Please complete it by 15 nov .',
    path: '',
    pathname: 'Pay now',
    Color: { Border: '#e96e10ff', Button: '#fa7d50ff' },
  },
  { title: 'Result ', description: 'Your exam result is published', path: '', pathname: 'view result', Color: { Border: '#9de910ff', Button: '#0e9527ff' } },
];

const timeTable: { day: String; date: string; schedule: Array<{ subject: string; startTime: string; endTime: string; Period: string }> }[] = [
  {
    day: 'Monday',
    date: '11 june, 26',
    schedule: [
      { subject: 'Math', startTime: '9:00 AM', endTime: '10:00 AM', Period: '1' },
      { subject: 'Science', startTime: '10:00 AM', endTime: '11:00 AM', Period: '2' },
      { subject: 'SST.', startTime: '11:00 AM', endTime: '11:30 AM', Period: '3' },
      { subject: 'Lang.', startTime: '11:30 AM', endTime: '12:00 PM', Period: '4' },
      { subject: 'Comp sci.', startTime: '12:00 PM', endTime: '12:30 PM', Period: '5' },
      { subject: 'Play ', startTime: '12:30 PM', endTime: '1:00 PM', Period: '6' },
    ],
  },
];

const tiles: { title: string; icon: string; badge: string; path: Href | '' }[] = [
  { title: 'salary', icon: 'fee', badge: '', path: '' },
  { title: 'Attendance', icon: 'attendance', badge: '77%', path: '' },
  { title: 'Assignment', icon: 'assignment', badge: '0', path: '' },
  { title: 'Results', icon: 'result', badge: '8.55', path: '' },
  { title: 'Events', icon: 'event', badge: '', path: '' },
  { title: 'View Marks', icon: 'place_holder', badge: 'X', path: '' },
  { title: 'Time Table', icon: 'place_holder', badge: 'X', path: '' },
];

// const tileImages: Record<string, any> = {
//     salary: require("../../../assets/myassets/fee.png"),
//     attendance: require("../../../assets/myassets/attendance.png"),
//     assignment: require("../../../assets/myassets/assignment.png"),
//     result: require("../../../assets/myassets/result.png"),
//     event: require("../../../assets/myassets/event.png"),
//     place_holder: require("../../../assets/myassets/place_holder.png"),
// };

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const { width, height } = useScreenSize();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={['#f4d65b', '#f5e193', '#ffffff']} locations={[0.22, 0.5, 1.0]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}>
          {/**Header */}
          <View style={[styles.header, { paddingTop: insets.top + 15, paddingLeft: insets.left + 17, paddingRight: insets.right + 17 }]}>
            <Pressable style={styles.profileSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>👨🏻</Text>
              </View>

              <View>
                <Text style={styles.name}>Hi , {profile.name}</Text>
                <Text style={styles.greeting}>VI B</Text>
              </View>
            </Pressable>

            <Pressable style={styles.helpButton}>
              <Bell size={16} color="#222" />
            </Pressable>
          </View>
        </LinearGradient>
        <View
          style={{
            paddingLeft: insets.left + 3,
            paddingRight: insets.right + 3,
            paddingBottom: insets.bottom,
          }}
        >
          {/**Alert */}
          <View style={styles.componentHeader}>
            <Text style={styles.componentText}>Alerts</Text>
            <View style={styles.headerLine}></View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.alertContainer}>
            {bannerNotice.map((item, index) => (
              <Pressable key={index} style={({ pressed }) => [styles.alertBox, { width: width * 0.85 }, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}>
                <View style={[styles.alertCard, { borderColor: item.Color.Border }]}>
                  <View style={styles.alertContent}>
                    <Text style={[styles.alertTitle, { color: item.Color.Border }]} numberOfLines={1}>
                      {item.title}
                    </Text>

                    <Text style={styles.alertDescription} numberOfLines={5}>
                      {item.description}
                    </Text>
                  </View>

                  <View style={[styles.alertButton, { backgroundColor: item.Color.Button }]}>
                    <Text style={styles.alertButtonText}>{item.pathname}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>

          {/**TimeTable */}
          <View style={styles.componentHeader}>
            <Text style={styles.componentText}>Time Table</Text>
            <View style={styles.headerLine}></View>
            <Text style={styles.timeTableDate}>{timeTable[0].date}</Text>
          </View>

          <View style={styles.periodGrid}>
            {timeTable[0].schedule.map((item) => (
              <View key={item.Period} style={styles.periodCard}>
                <Text style={styles.periodNumber}>{item.Period}</Text>

                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.subject}>
                  {item.subject}
                </Text>
              </View>
            ))}

            {/* Empty slots to maintain 3 × 3 */}
            {Array.from({
              length: 9 - timeTable[0].schedule.length,
            }).map((_, index) => (
              <View key={`empty-${index}`} style={[styles.periodCard, styles.emptyPeriod]} />
            ))}
          </View>

          {/**Quick Actions */}
          <View style={styles.componentHeader}>
            <Text style={styles.componentText}>Quick Actions</Text>
            <View style={styles.headerLine}></View>
          </View>
          <View style={styles.quickActionContainer}>
            {tiles.map((item, index) => (
              <Pressable key={index} style={({ pressed }) => [styles.category, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}>
                <View style={styles.categoryIcon}>
                  <Umbrella size={42} color="#f08a27" />
                </View>
                <Text style={styles.categoryText}>Term Life{'\n'}Insurance</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
