// app/(flow)/_layout.js
import { HangoutBuilderProvider } from '@/context/BuildHangoutContext';
import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function FlowLayout() {
  const theme = useTheme();

  return (
    <HangoutBuilderProvider>
      <Stack>
        <Stack.Screen name="invite" options={{ headerShown: false }} />
        <Stack.Screen name="date" options={{ headerShown: false }} />
        <Stack.Screen name="filters" options={{ headerShown: false }} />
        <Stack.Screen name="result" options={{ headerShown: false }} />
      </Stack>
    </HangoutBuilderProvider>
  );
}