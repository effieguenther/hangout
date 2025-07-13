// app/(app)/home.js
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Avatar,
  Surface,
  Switch,
  Text,
  TouchableRipple,
  useTheme
} from 'react-native-paper';

export default function HomeScreen() {
  const theme = useTheme();
  const [isAvailable, setIsAvailable] = useState(false);
  const onToggleAvailable = () => {
    setIsAvailable(!isAvailable);
  }

  return (
    <View style={{flex: 1}}>
      <View style={{ ...styles.topContainer, backgroundColor: theme.colors.background}}>
        <Text variant="headlineMedium" style={{ marginBottom: 20, fontWeight: 600 }}>
          LET'S HANG
        </Text>

        <View style={{
          ...styles.userInfoContainer, 
          flexDirection: 'row',
          gap: 15,
          alignItems: 'center',
          backgroundColor: theme.colors.surfaceVariant
        }}>
          <Avatar.Text 
            size={44} 
            label="UR" 
            style={{backgroundColor: theme.colors.tertiary}} 
            labelStyle={{color: theme.colors.onTertiary}}
          />
          <View>
            <Text>
              URSHILA RANA
            </Text>
            <Text>
              urshilarana96@gmail.com
            </Text>
          </View>
        </View>

        <View style={styles.hangoutMeterContainer}>
          <Text>
            Hangout meter (1/4)
          </Text>
          <View style={styles.hangoutMeter}>
            <View style={{...styles.hangoutBubble, backgroundColor: theme.colors.primary}}></View>
            <View style={{...styles.hangoutBubble, backgroundColor: theme.colors.tertiary}}></View>
            <View style={{...styles.hangoutBubble, backgroundColor: theme.colors.tertiary}}></View>
            <View style={{...styles.hangoutBubble, backgroundColor: theme.colors.tertiary}}></View>
          </View>
        </View>
      </View>

      <View style={{...styles.menuContainer, backgroundColor: theme.colors.surfaceVariant}}>
        <Surface style={{...styles.surfaceButton, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>
            AVAILABLE
          </Text>
          <Switch 
            value={isAvailable}
            onValueChange={onToggleAvailable}
          />
        </Surface>
        
        <TouchableRipple         
          onPress={() => router.push('/(build_hangout)/invite')} 
        >
          <Surface style={{...styles.surfaceButton, backgroundColor: theme.colors.secondary}}>
            <Text variant='headlineMedium' style={{fontWeight: 600, color: theme.colors.onSecondary}}>
              MAKE A PLAN
            </Text>
          </Surface>
        </TouchableRipple>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center', 
    padding: 20, 
    width: '100%',
    paddingTop: 140
  },
  menuContainer: {
    width: '100%',
    padding: 20,
    gap: 15,
    flex: 1,
    borderRadius: 20
  },
  userInfoContainer: {
    borderWidth: 1,
    padding: 15,
    width: '100%',
    borderRadius: 15
  },
  hangoutMeterContainer: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 5,
  },
  hangoutMeter: {
    padding: 5,
    borderRadius: 15,
    borderWidth: 1,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  hangoutBubble: {
    borderRadius: 20,
    height: 10,
    flex: 1,
    marginHorizontal: 1.5
  },
  surfaceButton: {
    padding: 30,
    borderRadius: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});