import { addMonths, format } from 'date-fns';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

const { width } = Dimensions.get('window');

interface CollapsibleCalendarProps {
  currentDate: Date;
  onDateSelect?: (date: Date) => void;
}

const CollapsibleCalendar: React.FC<CollapsibleCalendarProps> = ({ currentDate, onDateSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayDate, setDisplayDate] = useState(currentDate);
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const heightAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        const { dx } = gestureState;
        const threshold = 50;

        if (dx > threshold) {
          // Swipe right - go to previous month
          handlePrevMonth();
        } else if (dx < -threshold) {
          // Swipe left - go to next month
          handleNextMonth();
        }
      },
    }),
  ).current;

  const dateStr = format(displayDate, 'yyyy-MM-dd');
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

  const markedDates: Record<string, any> = {
    [dateStr]: {
      selected: true,
      selectedColor: '#4CAF50',
      selectedTextColor: '#fff',
    },
  };

  if (selectedDateStr !== dateStr) {
    markedDates[selectedDateStr] = {
      marked: true,
      dotColor: '#4CAF50',
    };
  }

  const handlePrevMonth = () => {
    setDisplayDate(addMonths(displayDate, -1));
  };

  const handleNextMonth = () => {
    setDisplayDate(addMonths(displayDate, 1));
  };

  const toggleExpand = () => {
    const targetHeight = isExpanded ? 0 : 420;
    const targetRotate = isExpanded ? 0 : 1;

    Animated.parallel([
      Animated.timing(heightAnim, {
        toValue: targetHeight,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: targetRotate,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();

    setIsExpanded(!isExpanded);
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const handleDateSelect = (day: string) => {
    const selected = new Date(day);
    setSelectedDate(selected);
    onDateSelect?.(selected);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.header} onPress={toggleExpand}>
        <View style={styles.headerContent}>
          <Text style={styles.dateText}>{format(selectedDate, 'MMM dd, yyyy')}</Text>
          <Text style={styles.dayText}>{format(selectedDate, 'EEEE')}</Text>
        </View>
        <Animated.View style={[styles.chevron, { transform: [{ rotate: rotateInterpolate }] }]}>
          <Text style={styles.chevronText}>▼</Text>
        </Animated.View>
      </TouchableOpacity>

      {/* Collapsible Calendar */}
      <Animated.View style={[styles.expandedContainer, { height: heightAnim }, { overflow: 'hidden' }]}>
        <View style={styles.calendarWrapper} {...panResponder.panHandlers}>
          {/* Month Navigation */}
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
              <Text style={styles.navButtonText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.monthText}>{format(displayDate, 'MMMM yyyy')}</Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
              <Text style={styles.navButtonText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Calendar */}
          <Calendar
            current={dateStr}
            markedDates={markedDates}
            onDayPress={(day) => handleDateSelect(day.dateString)}
            monthFormat="MMMM yyyy"
            hideArrows={true}
            disableMonthChange={true}
            style={styles.calendar}
            theme={{
              backgroundColor: '#fff',
              calendarBackground: '#fff',
              textSectionTitleColor: '#999',
              textSectionTitleDisabledColor: '#d9e1e8',
              selectedDayBackgroundColor: '#4CAF50',
              selectedDayTextColor: '#fff',
              todayTextColor: '#4CAF50',
              dayTextColor: '#2d3436',
              textDisabledColor: '#d9e1e8',
              dotColor: '#4CAF50',
              selectedDotColor: '#fff',
              arrowColor: '#4CAF50',
              disabledArrowColor: '#d9e1e8',
              monthTextColor: '#2d3436',
              indicatorColor: '#4CAF50',
              textDayFontFamily: 'System',
              textMonthFontFamily: 'System',
              textDayHeaderFontFamily: 'System',
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13,
            }}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f5f5f5',
  },
  headerContent: {
    flex: 1,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 4,
  },
  dayText: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  chevron: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronText: {
    fontSize: 16,
    color: '#4CAF50',
  },
  expandedContainer: {
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  calendarWrapper: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  navButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  navButtonText: {
    fontSize: 20,
    color: '#2d3436',
    fontWeight: '600',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
  },
  calendar: {
    borderRadius: 8,
  },
});

export default CollapsibleCalendar;
