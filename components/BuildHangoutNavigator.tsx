import { StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";

export default function BuildHangoutNavigator({ onNext = () => {}, onPrev = () => {}, nextDisabled = false }) {
  return (
    <View style={styles.navContainer}>
      <IconButton 
        icon="arrow-left" 
        size={24} 
        onPress={onPrev}
      />
      <Text variant="bodyLarge">MAKE A PLAN</Text>
      { !nextDisabled && (
        <IconButton 
          icon="arrow-right" 
          size={24} 
          onPress={onNext}
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
    paddingTop: 50,
    paddingBottom: 10
  },
})