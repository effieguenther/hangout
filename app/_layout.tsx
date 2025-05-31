import { Stack } from 'expo-router';
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <PaperProvider theme={DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(build_hangout)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </PaperProvider>
  );
}
