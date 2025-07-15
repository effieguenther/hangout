import { router } from 'expo-router';
import {
  StyleSheet,
  View
} from 'react-native';
import { Surface, Text, TouchableRipple } from 'react-native-paper'; // Import Button from react-native-paper

export default function IndexScreen() {
  return (
    <View style={styles.container}>
      <Text variant="displayLarge" style={{textAlign: 'center'}}>
        LET'S HANG
      </Text>
      <TouchableRipple 
        onPress={() => router.replace('/(tabs)/home')}
        rippleColor='#555555'
      >
        <Surface elevation={2} style={styles.enterSurfaceStyle}>
          <Text variant="headlineSmall" style={styles.enterTextStyle}>
            ENTER
          </Text>
        </Surface>
      </TouchableRipple>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',     
    padding: 40,
    gap: 10,
  },
  enterSurfaceStyle: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#000'
  },
  enterTextStyle: {
    color: '#fff'
  }
});