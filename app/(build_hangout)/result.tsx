import BuildHangoutNavigator from '@/components/BuildHangoutNavigator';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function ResultScreen() {
  const theme = useTheme();
  const onPrev = () => {
    router.push('/(build_hangout)/review');
  }
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <BuildHangoutNavigator onPrev={onPrev} nextDisabled={true} />
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