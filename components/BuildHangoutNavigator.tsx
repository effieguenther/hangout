import { StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";

export default function BuildHangoutNavigator({ onNext = () => {}, onPrev = () => {}, nextDisabled = false }) {
  return (
    <View style={styles.navContainer}>
      <IconButton 
        icon="arrow-left" 
        size={24} 
        onPress={onPrev}
        mode='outlined'
      />
      <Text variant="headlineSmall" style={{fontWeight: 600}}>MAKE A PLAN</Text>
      { !nextDisabled && (
        <IconButton 
          icon="arrow-right" 
          size={24} 
          onPress={onNext}
          mode='outlined'
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingTop: 50,
    paddingBottom: 10,
    width: '100%'
  },
})