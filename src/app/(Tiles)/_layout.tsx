
import { Stack } from 'expo-router';

export default function TilesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MarkAttendance" />
      <Stack.Screen name="LeaveRequest" />
      <Stack.Screen name="Assignments" />
      <Stack.Screen name="UploadMarks" />
      <Stack.Screen name="GenerateReport" />
      <Stack.Screen name="Library" />
      <Stack.Screen name="Events" />
      <Stack.Screen name="Meetings" />
      <Stack.Screen name="Subjects" />
      <Stack.Screen name="StudyMaterial" />
      <Stack.Screen name="StudentProfile" />
      <Stack.Screen name="Attendance" />
      <Stack.Screen name="StudentReview" />
      <Stack.Screen name="CreateExam" />
      <Stack.Screen name="Results" />
      <Stack.Screen name="MyTimetable" />
      <Stack.Screen name="Duties" />
      <Stack.Screen name="ViewTimetable" />
      <Stack.Screen name="ManageTimetable" />
      <Stack.Screen name="ClassRoutine" />
      <Stack.Screen name="RoomAllocation" />
      <Stack.Screen name="Notifications" />
      <Stack.Screen name="AIChatBot" />
    </Stack>
  );
}