import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Bell, Box } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTabBarScroll } from '@/hooks/useTabBarScroll';
import UpcomingEventsCard from '@/components/component.UpcomingEventCard';

import { useScreenSize } from '../../../hooks/responsiveSize';
import { DashboardStyles } from '../../../styles/styles';

import BannerCard from '@/components/component.AlertCard';
import { bannerNotice, tilesData, timetableData } from '../../../utilities/mockdata';

const styles = DashboardStyles;

const profile: { name: string; uuid: string; role: string; permision: string[] } = {
  name: 'sourav',
  uuid: '123',
  role: 'teacher',
  permision: ['create', 'read', 'update', 'delete'],
};

export default function Dashboard() {
  const insets = useSafeAreaInsets();
  const { width, height } = useScreenSize();
  const { onScroll, scrollEventThrottle } = useTabBarScroll();

  const CARD_WIDTH = Math.round(width * 0.88);
  const CARD_GAP = 10;
  const CARD_SPACING = (width - CARD_WIDTH) / 2;
  const snapOffsets = bannerNotice.map((_, index) => index * (CARD_WIDTH + CARD_GAP));

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
      >
        <LinearGradient colors={['#f4d65b', '#f5e193', '#ffffffff']} locations={[0.22, 0.5, 1.0]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}>
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

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
            decelerationRate="fast"
            snapToInterval={CARD_WIDTH + CARD_GAP}
            snapToOffsets={snapOffsets}
            disableIntervalMomentum={true}
            style={{
              marginLeft: -(insets.left + 7),
              marginRight: -(insets.right + 3),
            }}
            contentContainerStyle={[
              styles.alertContainer,
              {
                paddingHorizontal: CARD_SPACING,
                gap: CARD_GAP,
              },
            ]}
          >
            {bannerNotice.map((item, index) => (
              <BannerCard
                key={`${item.title}-${index}`}
                item={item}
                cardWidth={CARD_WIDTH}
                onPress={(item) => {
                  console.log('Pressed:', item.pathname);

                  // navigation.navigate(item.path)
                }}
              />
            ))}
          </ScrollView>

          {/**TimeTable */}
          <View style={styles.componentHeader}>
            <Text style={styles.componentText}>Time Table</Text>
            <View style={styles.headerLine}></View>
            <Text style={styles.timeTableDate}>{timetableData[0].date}</Text>
          </View>

          <View style={styles.periodGrid}>
            {timetableData[0].schedule.map((item) => (
              <View key={item.Period} style={styles.periodCard}>
                <Text style={styles.periodNumber}>{item.Period}</Text>

                <View style={{ flex: 1, flexDirection: 'column', paddingVertical: 4, paddingLeft: 4 }}>
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.subject}>
                    {item.subject}
                  </Text>
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.subject}>
                    {item.class}
                  </Text>
                </View>
              </View>
            ))}

            {/*  Empty slots to maintain 3 × 2  */}
            {Array.from({
              length: 6 - timetableData[0].schedule.length,
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
            {tilesData.slice(0, 8).map((item, index) => (
              <Pressable key={index} style={({ pressed }) => [styles.category, pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] }]}>
                <View style={styles.categoryIcon}>
                  <Box color="#f08a27" size={24} />
                </View>
                <Text style={styles.categoryText}>{item.title}</Text>
              </Pressable>
            ))}
          </View>

          <Pressable style={({ pressed }) => [styles.viewAllButton, pressed && { opacity: 0.8 }]}>
            <Text style={styles.viewAllText}>View All</Text>
            <ArrowRight color="#a78104ff" size={20} />
          </Pressable>

          {/**Upcoming Events */}
          <View style={styles.componentHeader}>
            <Text style={styles.componentText}>Upcoming Events</Text>
            <View style={styles.headerLine}></View>
          </View>
          <View style={styles.section}>
            {/* Assignment Card - shows Pending/Submitted */}
            <UpcomingEventsCard title="Assignments" pending={5} submitted={2} onViewAll={() => console.log('View all assignments')} />

            {/* Exam Card - shows Total/Due */}
            <UpcomingEventsCard title="Exams" total={8} due={5} onViewAll={() => console.log('View all exams')} />

            {/* Holiday Card - minimal */}

            {/* Events Card */}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
