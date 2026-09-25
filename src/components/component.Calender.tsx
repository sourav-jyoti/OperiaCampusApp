import { addMonths, format } from 'date-fns';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Calendar } from 'react-native-calendars';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const HEADER_HEIGHT = 70;
const COLLAPSED_HEIGHT = HEADER_HEIGHT;
const EXPANDED_HEIGHT = screenHeight * 0.75;
const DRAG_THRESHOLD = 50;

interface GestureCollapsibleCalendarProps {
  currentDate: Date;
  onDateSelect?: (date: Date) => void;
}

export const GestureCollapsibleCalendar: React.FC<GestureCollapsibleCalendarProps> = ({
  currentDate,
  onDateSelect,
}) => {
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [displayDate, setDisplayDate] = useState(currentDate);
  const [isExpanded, setIsExpanded] = useState(false);

  const heightAnim = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const indicatorRotate = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, { dy }) => Math.abs(dy) > 5,

      onPanResponderMove: (evt, { dy }) => {
        if (!isExpanded && dy > 0) {
          // Expanding from collapsed
          const dragProgress = Math.min(dy / (EXPANDED_HEIGHT - COLLAPSED_HEIGHT), 1);
          heightAnim.setValue(COLLAPSED_HEIGHT + dy);
          opacityAnim.setValue(dragProgress);
          indicatorRotate.setValue(dragProgress);
        } else if (isExpanded && dy < 0) {
          // Collapsing from expanded
          const distance = EXPANDED_HEIGHT - COLLAPSED_HEIGHT;
          const dragProgress = Math.max(1 + dy / distance, 0);
          heightAnim.setValue(EXPANDED_HEIGHT + dy);
          opacityAnim.setValue(dragProgress);
          indicatorRotate.setValue(dragProgress);
        }
      },

      onPanResponderRelease: (evt, { dy, vy }) => {
        let targetHeight = COLLAPSED_HEIGHT;
        let targetOpacity = 0;
        let targetRotate = 0;
        let nextExpanded = false;

        if (!isExpanded) {
          // Currently collapsed - decide whether to expand
          const shouldExpand = dy > DRAG_THRESHOLD || vy > 1;
          if (shouldExpand) {
            targetHeight = EXPANDED_HEIGHT;
            targetOpacity = 1;
            targetRotate = 1;
            nextExpanded = true;
          }
        } else {
          // Currently expanded - decide whether to collapse
          const shouldCollapse = dy < -DRAG_THRESHOLD || vy < -1;
          if (shouldCollapse) {
            targetHeight = COLLAPSED_HEIGHT;
            targetOpacity = 0;
            targetRotate = 0;
            nextExpanded = false;
          } else {
            targetHeight = EXPANDED_HEIGHT;
            targetOpacity = 1;
            targetRotate = 1;
            nextExpanded = true;
          }
        }

        // Snap to final position
        Animated.parallel([
          Animated.timing(heightAnim, {
            toValue: targetHeight,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.timing(opacityAnim, {
            toValue: targetOpacity,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.timing(indicatorRotate, {
            toValue: targetRotate,
            duration: 400,
            useNativeDriver: false,
          }),
        ]).start();

        setIsExpanded(nextExpanded);
      },
    })
  ).current;

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const displayDateStr = format(displayDate, 'yyyy-MM-dd');

  const markedDates: Record<string, any> = {
    [selectedDateStr]: {
      selected: true,
      selectedColor: '#10b981',
      selectedTextColor: '#ffffff',
    },
  };

  const handleMonthPrev = () => setDisplayDate(addMonths(displayDate, -1));
  const handleMonthNext = () => setDisplayDate(addMonths(displayDate, 1));

  const handleDayPress = (day: string) => {
    const newDate = new Date(day);
    setSelectedDate(newDate);
    onDateSelect?.(newDate);
  };

  const rotateInterpolate = indicatorRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Animated.View
      style={[styles.container, { height: heightAnim }]}
      {...panResponder.panHandlers}
    >
      {/* Header - Gesture Zone */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.dateLabel}>
            {format(selectedDate, 'MMM dd, yyyy')}
          </Text>
          <Text style={styles.dayLabel}>
            {format(selectedDate, 'EEEE')}
          </Text>
        </View>

        <Animated.View
          style={[
            styles.indicator,
            { transform: [{ rotate: rotateInterpolate }] },
          ]}
        >
          <Text style={styles.chevron}>⌄</Text>
        </Animated.View>
      </View>

      {/* Drag Handle */}
      <View style={styles.dragHandleContainer}>
        <View style={styles.dragHandle} />
      </View>

      {/* Calendar Content */}
      <Animated.ScrollView
        style={[
          styles.contentContainer,
          {
            opacity: opacityAnim,
            pointerEvents: isExpanded ? 'auto' : 'none',
          },
        ]}
        scrollEnabled={false}
      >
        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <Pressable
            onPress={handleMonthPrev}
            style={({ pressed }) => [
              styles.navButton,
              pressed && styles.navButtonPressed,
            ]}
          >
            <Text style={styles.navButtonText}>‹</Text>
          </Pressable>

          <Text style={styles.monthTitle}>
            {format(displayDate, 'MMMM yyyy')}
          </Text>

          <Pressable
            onPress={handleMonthNext}
            style={({ pressed }) => [
              styles.navButton,
              pressed && styles.navButtonPressed,
            ]}
          >
            <Text style={styles.navButtonText}>›</Text>
          </Pressable>
        </View>

        {/* Calendar Component */}
        <Calendar
          current={displayDateStr}
          markedDates={markedDates}
          onDayPress={(day) => handleDayPress(day.dateString)}
          hideArrows={true}
          disableMonthChange={true}
          style={styles.calendarStyle}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#6b7280',
            selectedDayBackgroundColor: '#10b981',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#10b981',
            dayTextColor: '#1f2937',
            textDisabledColor: '#e5e7eb',
            dotColor: '#10b981',
            selectedDotColor: '#ffffff',
            arrowColor: '#10b981',
            monthTextColor: '#1f2937',
            textDayFontSize: 15,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 13,
          }}
        />
      </Animated.ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f3f4f6',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  dayLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
  indicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    fontSize: 18,
    fontWeight: '600',
    color: '#10b981',
  },
  dragHandleContainer: {
    height: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 4,
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 16,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 12,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonPressed: {
    backgroundColor: '#e5e7eb',
  },
  navButtonText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#10b981',
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  calendarStyle: {
    borderRadius: 12,
  },
});

export default GestureCollapsibleCalendar;