import { View, StyleSheet } from "react-native"
import { Text, IconButton } from "react-native-paper"
import { router } from "expo-router";

export default function BuildHangoutNavigator({ currentScreen }) {
  const routeMap = [
    '/(tabs)/home', 
    '/(build_hangout)/invite',
    '/(build_hangout)/date',
    '/(build_hangout)/filters',
    '/(build_hangout)/result',
  ]
  const currentScreenIdx = routeMap.indexOf(currentScreen);
  const nextDisabled = currentScreenIdx === routeMap.length - 1

  const navigatePrev = () => {
    router.push(routeMap[currentScreenIdx - 1])
  }
  const navigateNext = () => {
    router.push(routeMap[currentScreenIdx + 1])
  }

  return (
    <View style={styles.navContainer}>
      <IconButton 
        icon="arrow-left" 
        size={24} 
        onPress={navigatePrev}
      />
      <Text variant="bodyLarge">MAKE A PLAN</Text>
      { !nextDisabled && (
        <IconButton 
          icon="arrow-right" 
          size={24} 
          onPress={navigateNext}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 50,
  },
})