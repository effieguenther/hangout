// app/(app)/home.js
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { 
  Text, 
  useTheme, 
  Surface, 
  TouchableRipple,
  Switch,
  Avatar
} from 'react-native-paper';
import { router } from 'expo-router';

export default function HomeScreen() {
  const theme = useTheme();
  const [isAvailable, setIsAvailable] = useState(false);
  const onToggleAvailable = () => {
    setIsAvailable(!isAvailable);
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={{ marginBottom: 20, color: theme.colors.onBackground }}>
        LET'S HANG
      </Text>

      <View style={{
        ...styles.userInfoContainer, 
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center'
      }}>
        <Avatar.Text size={44} label="UR" />
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
        <View style={styles.hangoutMeter}></View>
      </View>

      <View style={styles.menuContainer}>
        <Surface style={{...styles.surfaceButton, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>
            AVAILABLE
          </Text>
          <Switch 
            value={isAvailable}
            onValueChange={onToggleAvailable}
          />
        </Surface>

        <View style={{ flexDirection: 'row', width: '100%', gap: 15}}>
          <TouchableRipple
            onPress={() => router.push('/(menu)/preferences')} 
            style={{flex: 1}}
          >
            <Surface style={styles.surfaceButton}>
              <Text>
                PREFERENCES
              </Text>
            </Surface>
          </TouchableRipple>
          <TouchableRipple
            onPress={() => router.push('/(menu)/calendar')}   
            style={{flex: 1}}   
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
    padding: 10,
    gap: 15,
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
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    marginTop: 10
  },
  surfaceButton: {
    padding: 30,
    borderRadius: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});