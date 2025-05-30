// app/(flow)/_layout.js
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { useTheme, Text, IconButton } from 'react-native-paper';

export default function FlowLayout() {
  const theme = useTheme();

  return (
    <Stack>
      <Stack.Screen name="invite" options={{ headerShown: false }} />
      <Stack.Screen name="date" options={{ headerShown: false }} />
      <Stack.Screen name="filters" options={{ headerShown: false }} />
      <Stack.Screen name="result" options={{ headerShown: false }} />
    </Stack>
  );
}