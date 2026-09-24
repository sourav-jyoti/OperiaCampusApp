import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} initialRouteName="Dashboard">
      <Tabs.Screen name="Dashboard" />
      <Tabs.Screen name="Calender" />
      <Tabs.Screen name="Messages" />
      <Tabs.Screen name="More" />
    </Tabs>
  );
}
