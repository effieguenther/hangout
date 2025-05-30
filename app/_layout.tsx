import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';import 'react-native-reanimated';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <PaperProvider theme={DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(menu)" options={{ headerShown: false }} />
        <Stack.Screen name="(build_hangout)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    {/* <StatusBar style="auto" /> */}
    </PaperProvider>
  );
}
