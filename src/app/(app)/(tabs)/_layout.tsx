import CustomTabBar from '@/components/component.CustomTab';
import { TabBarVisibilityProvider } from '@/context/TabBarVisibilityContext';
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <TabBarVisibilityProvider>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="tabs.Dashboard"
      >
        <Tabs.Screen
          name="tabs.Dashboard"
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name="tabs.Calender"
          options={{
            title: 'Calendar',
          }}
        />
        <Tabs.Screen
          name="tabs.Messages"
          options={{
            title: 'Messages',
          }}
        />
        <Tabs.Screen
          name="tabs.More"
          options={{
            title: 'More',
          }}
        />
      </Tabs>
    </TabBarVisibilityProvider>
  );
}
