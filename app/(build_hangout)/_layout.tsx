// app/(flow)/_layout.js
import { HangoutBuilderProvider } from '@/context/BuildHangoutContext';
import { Stack, router } from 'expo-router';
import { Button, useTheme } from 'react-native-paper';

export default function FlowLayout() {
  const theme = useTheme();

  const HeaderButton = ({ onPress }) => {
    return <Button 
      icon="arrow-left" 
      onPress={onPress} 
      textColor={theme.colors.onPrimary}>
        Back
    </Button>;
  }

  return (
    <HangoutBuilderProvider>
      <Stack>
        <Stack.Screen name="invite" options={{ 
          headerShown: true,
          headerTitle: 'MAKE A PLAN',
          headerTitleStyle: { color: theme.colors.onPrimary },
          headerStyle: { backgroundColor: theme.colors.primary },
          headerLeft: () => <HeaderButton onPress={() => router.dismissAll()} />  
        }} />
        <Stack.Screen name="date" options={{ 
          headerShown: true,
          headerTitle: 'MAKE A PLAN',
          headerTitleStyle: { color: theme.colors.onPrimary },
          headerStyle: { backgroundColor: theme.colors.primary },
          headerLeft: () => <HeaderButton onPress={() => router.dismiss()} />  
        }} />
        <Stack.Screen name="filters" options={{ 
          headerShown: true,
          headerTitle: 'MAKE A PLAN',
          headerTitleStyle: { color: theme.colors.onPrimary },
          headerStyle: { backgroundColor: theme.colors.primary },
          headerLeft: () => <HeaderButton onPress={() => router.dismiss()} />    
        }} />
        <Stack.Screen name="review" options={{ 
          headerShown: true,
          headerTitle: 'MAKE A PLAN',
          headerTitleStyle: { color: theme.colors.onPrimary },
          headerStyle: { backgroundColor: theme.colors.primary },
          headerLeft: () => <HeaderButton onPress={() => router.dismiss()} />   
        }} />
        <Stack.Screen name="result" options={{ 
          headerShown: true,
          headerTitle: 'MAKE A PLAN',
          headerTitleStyle: { color: theme.colors.onPrimary },
          headerStyle: { backgroundColor: theme.colors.primary },
          headerLeft: () => <HeaderButton onPress={() => router.dismiss()} /> 
        }} />
      </Stack>
    </HangoutBuilderProvider>
  );
}