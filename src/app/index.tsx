import { Redirect } from 'expo-router';

export default function Index() {
  const isAuthenticated = true; // replace with your auth state

  if (isAuthenticated) {
    return <Redirect href="/(app)/(tabs)/tabs.Dashboard" />;
  }

  //return <Redirect href="(auth)" />;
}
