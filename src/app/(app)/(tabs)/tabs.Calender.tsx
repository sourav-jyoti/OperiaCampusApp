import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CalendarAgenda, getAgendaColors } from '@/components/calendar';
import type { CampusEvent } from '@/components/calendar';

// Change this to `true` to preview dark mode
const IS_DARK = false;

export default function CalenderScreen() {
  const insets = useSafeAreaInsets();
  const colors = getAgendaColors(IS_DARK);

  const handleEventPress = (event: CampusEvent) => {
    // TODO: Navigate to event detail screen
    console.log('Event pressed:', event.title);
  };

  const handleDateChange = (date: string) => {
    console.log('Date changed:', date);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.calendarHeader },
      ]}
    >
      <StatusBar style={IS_DARK ? 'light' : 'dark'} />

      {/* Safe area top – matches calendar header background */}
      <View
        style={[
          styles.safeAreaTop,
          { height: insets.top, backgroundColor: colors.calendarHeader },
        ]}
      />

      <CalendarAgenda
        isDarkMode={IS_DARK}
        onEventPress={handleEventPress}
        onDateChange={handleDateChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeAreaTop: {
    width: '100%',
  },
});
