import { useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import GestureCollapsibleCalendar from '../../../components/component.Calender';

export default function CalendarExample() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView style={styles.scrollView} scrollEnabled={false}>
        {/* Content above calendar */}
        <View style={styles.topContent}>
          <Text style={styles.title}>Schedule</Text>
          <Text style={styles.subtitle}>Drag up to view full calendar</Text>
        </View>

        {/* Gesture Controlled Calendar */}
        <GestureCollapsibleCalendar currentDate={new Date()} onDateSelect={handleDateSelect} />
      </ScrollView>

      {/* Selected date info (below calendar if visible) */}
      {selectedDate && (
        <View style={styles.infoPanel}>
          <Text style={styles.infoTitle}>Selected Date</Text>
          <Text style={styles.infoDate}>
            {selectedDate.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  topContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoPanel: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ecfdf5',
    borderTopWidth: 1,
    borderTopColor: '#d1fae5',
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  infoDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065f46',
  },
});
