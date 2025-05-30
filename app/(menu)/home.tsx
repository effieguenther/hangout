// app/(app)/home.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, useTheme, Surface, TouchableRipple } from 'react-native-paper';
import { router } from 'expo-router';

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={{ marginBottom: 20, color: theme.colors.onBackground }}>
        LET'S HANG
      </Text>

      <View style={styles.userInfoContainer}>
        <Text>
          URSHILA RANA
        </Text>
        <Text>
          urshilarana96@gmail.com
        </Text>
      </View>

      <View>
        <Text>
          Hanout meter (1/4)
        </Text>
        <View></View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableRipple 
          style={{width: '100%'}}
          onPress={() => console.log('available')} 
        >
          <Surface style={styles.surfaceButton}>
            <Text>
              AVAILABLE
            </Text>
          </Surface>
        </TouchableRipple>

        <View style={{ flexDirection: 'row', width: '100%'}}>
          <TouchableRipple
            onPress={() => router.push('/(menu)/preferences')} 
          >
            <Surface style={styles.surfaceButton}>
              <Text>
                PREFERENCES
              </Text>
            </Surface>
          </TouchableRipple>
          <TouchableRipple
            onPress={() => router.push('/(menu)/calendar')}      
          >
            <Surface style={styles.surfaceButton}>
              <Text>
                CALENDAR
              </Text>
            </Surface>
          </TouchableRipple>
        </View>

        <TouchableRipple         
          onPress={() => router.push('/(build_hangout)/invite')} 
        >
          <Surface style={styles.surfaceButton}>
            <Text>
              MAKE A PLAN
            </Text>
          </Surface>
        </TouchableRipple>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    flexDirection: 'column'
  },
  menuContainer: {
    width: '100%',
    padding: 20
  },
  userInfoContainer: {
    borderWidth: 1,
    padding: 15,
    width: '100%',
    borderRadius: 15
  },
  hangoutMeter: {
    padding: 10,
    borderRadius: 15,
    borderWidth: 1
  },
  surfaceButton: {
    padding: 30,
    borderRadius: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});