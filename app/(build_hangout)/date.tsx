// app/(app)/preferences.js
import BuildHangoutNavigator from '@/components/BuildHangoutNavigator';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';

export default function DateScreen() {
  const theme = useTheme();
  const [selected, setSelected] = useState('');
  const [options, setOptions] = useState([
    { value: 'MORNING', isSelected: false},
    { value: 'AFTERNOON', isSelected: false},
    { value: 'EVENING', isSelected: false},
  ])
  const calendarTheme = {
    backgroundColor: theme.colors.background,
    selectedDayBackgroundColor: theme.colors.primary,
    todayTextColor: theme.colors.primary,
    arrowColor: theme.colors.outline
  }
  const selectOption = (index) => {
    const copy = [...options];
    copy[index].isSelected = !copy[index].isSelected;
    setOptions(copy);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <BuildHangoutNavigator currentScreen='/(build_hangout)/date' />
      <Text variant="bodySmall" style={{paddingBottom: 20}}>
        SELECT ALL THAT APPLY
      </Text>
      <Surface style={{backgroundColor: theme.colors.background, padding: 10}}>
        <Calendar
          style={{width: 290}}
          theme={calendarTheme}
          onDayPress={day => {
            setSelected(day.dateString);
          }}
          markedDates={{
            [selected]: {selected: true, disableTouchEvent: true}
          }}
        />
      </Surface>
      <View style={{width: '100%', paddingHorizontal: 70, paddingVertical: 20, gap: 20}}>
        {options.map((option, index) => (
          <TouchableRipple 
            key={`option_${index}`}
            onPress={() => selectOption(index)}
          >
            <View style={{
              ...styles.optionButton,
              backgroundColor: option.isSelected ? theme.colors.primary: theme.colors.background
            }}>
              <Text 
                variant='bodyMedium' 
                style={{
                  ...styles.optionButtonLabel,
                  color: option.isSelected ? theme.colors.onPrimary : theme.colors.onBackground
                }}
              >
                {option.value}
              </Text>
            </View>
          </TouchableRipple>
        ))}
      </View>
    </View>
  );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      padding: 20,
    },
    optionButton: {
      borderRadius: 10,
      borderWidth: 1,
      width: '100%',
      padding: 10
    },
    optionButtonLabel: {
      textAlign: 'center'
    }
  });