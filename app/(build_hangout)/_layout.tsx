// app/(flow)/_layout.js
import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

export default function FlowLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="invite" options={{ title: 'Invite' }} />
      <Stack.Screen name="date" options={{ title: 'Date' }} />
      <Stack.Screen name="filters" options={{ title: 'Filters' }} />
      <Stack.Screen name="result" options={{ title: 'Result' }} />
    </Stack>
  );
}