import { Stack } from 'expo-router';
import { Text } from 'react-native-paper';

export default function MenuLayout() {
  return (
      <Stack>
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="calendar" options={{ headerShown: false }} />
        <Stack.Screen name="preferences" options={{ headerShown: false }} />
      </Stack>
  );
}
