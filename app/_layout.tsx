import { Stack } from 'expo-router';
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';
import 'react-native-reanimated';

export default function RootLayout() {
  const theme = {
    ...DefaultTheme,
    colors: {
      "primary": "rgb(240, 77,35)",
      "onPrimary": "rgb(255, 255, 255)",
      "primaryContainer": "rgb(255, 219, 209)",
      "onPrimaryContainer": "rgb(59, 9, 0)",
      "secondary": "rgb(29, 29, 29)",
      "onSecondary": "rgb(255, 255, 255)",
      "secondaryContainer": "rgb(255, 255, 255)",
      "onSecondaryContainer": "rgb(29, 29, 29)",
      "tertiary": "rgb(157, 157, 157)",
      "onTertiary": "rgb(255, 255, 255)",
      "tertiaryContainer": "rgb(206, 206, 206)",
      "onTertiaryContainer": "rgb(29, 29, 29)",
      "error": "rgb(186, 26, 26)",
      "onError": "rgb(255, 255, 255)",
      "errorContainer": "rgb(255, 218, 214)",
      "onErrorContainer": "rgb(65, 0, 2)",
      "background": "rgb(253, 251, 247)",
      "onBackground": "rgb(29, 29, 29)",
      "surface": "rgb(253, 251, 247)",
      "onSurface": "rgb(29, 29, 29)",
      "surfaceVariant": "rgb(255, 255, 255)",
      "onSurfaceVariant": "rgb(29, 29, 29)",
      "outline": "rgb(133, 115, 110)",
      "outlineVariant": "rgb(216, 194, 188)",
      "shadow": "rgb(0, 0, 0)",
      "scrim": "rgb(0, 0, 0)",
      "inverseSurface": "rgb(54, 47, 45)",
      "inverseOnSurface": "rgb(251, 238, 235)",
      "inversePrimary": "rgb(255, 181, 160)",
      "elevation": {
        "level0": "transparent",
        "level1": "rgb(255, 255, 255)",
        "level2": "rgb(255, 255, 255)",
        "level3": "rgb(255, 255, 255)",
        "level4": "rgb(255, 255, 255)",
        "level5": "rgb(255, 255, 255)"
      },
      "surfaceDisabled": "rgba(32, 26, 24, 0.12)",
      "onSurfaceDisabled": "rgba(32, 26, 24, 0.38)",
      "backdrop": "rgba(59, 45, 41, 0.4)"
    }
  }
  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(build_hangout)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </PaperProvider>
  );
}
