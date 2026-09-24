import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} initialRouteName="tabs.Dashboard">
      <Tabs.Screen name="tabs.Dashboard" />
      <Tabs.Screen name="tabs.Calender" />
      <Tabs.Screen name="tabs.Messages" />
      <Tabs.Screen name="tabs.More" />
    </Tabs>
  );
}
