import { useState } from 'react';
import { Text, View } from 'react-native';
import CollapsibleCalendar from '../../../components/component.Calender';
import { CalendarStyles } from '../../../styles/calenderStyle';
const styles = CalendarStyles;

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    console.log('Selected date:', date);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Calendar App</Text>

        <CollapsibleCalendar currentDate={new Date()} onDateSelect={handleDateSelect} />

        {/* Display selected date info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Selected Date:</Text>
          <Text style={styles.infoValue}>{selectedDate.toDateString()}</Text>
        </View>
      </View>
    </View>
  );
}
