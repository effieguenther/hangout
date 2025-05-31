// app/(app)/preferences.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import BuildHangoutNavigator from '@/components/BuildHangoutNavigator';

export default function ResultScreen() {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <BuildHangoutNavigator currentScreen='/(build_hangout)/result' />
      <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>
        Result Screen
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});