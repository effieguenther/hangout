import BuildHangoutNavigator from '@/components/BuildHangoutNavigator';
import { useHangoutBuilder } from '@/context/BuildHangoutContext';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Button, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';


interface MarkedDay {
  dateString: string;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
  dotColor?: string;
  selectedDotColor?: string;
}

export default function DateScreen() {
  const theme = useTheme();
  const { hangoutData, updateHangoutData } = useHangoutBuilder();

  const getTodayDateString = () => {
    const todayDate = new Date();
    const year = todayDate.getFullYear();
    const month = (todayDate.getMonth() + 1).toString().padStart(2, '0');
    const day = todayDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDay, setSelectedDay] = useState<string>(getTodayDateString());

  const [markedDays, setMarkedDays] = useState<MarkedDay[]>(hangoutData.date || []);
  const [options, setOptions] = useState([
    { value: 'MORNING', isSelected: false },
    { value: 'AFTERNOON', isSelected: false },
    { value: 'EVENING', isSelected: false },
  ]);

  const calendarTheme = {
    backgroundColor: theme.colors.background,
    selectedDayBackgroundColor: theme.colors.primary,
    todayTextColor: theme.colors.primary,
    arrowColor: theme.colors.outline,
    dotColor: theme.colors.primary,
    selectedDotColor: 'white',
    indicatorColor: theme.colors.primary,
  };

  const findMarkedDay = (date: string) =>
    markedDays.find((day) => day.dateString === date);

  const updateMarkedDay = (updatedDay: MarkedDay) => {
    setMarkedDays((prevMarkedDays) =>
      prevMarkedDays.map((day) =>
        day.dateString === updatedDay.dateString ? updatedDay : day
      )
    );
  };

  const removeMarkedDay = (date: string) => {
    setMarkedDays((prevMarkedDays) =>
      prevMarkedDays.filter((day) => day.dateString !== date)
    );
  };

  // Effect to update `options` state when `selectedDay` changes
  useEffect(() => {
    const currentDayEntry = findMarkedDay(selectedDay);
    if (currentDayEntry) {
      setOptions([
        { value: 'MORNING', isSelected: currentDayEntry.morning },
        { value: 'AFTERNOON', isSelected: currentDayEntry.afternoon },
        { value: 'EVENING', isSelected: currentDayEntry.evening },
      ]);
    } else {
      setOptions([
        { value: 'MORNING', isSelected: false },
        { value: 'AFTERNOON', isSelected: false },
        { value: 'EVENING', isSelected: false },
      ]);
    }
  }, [selectedDay, markedDays]);

  // Function to handle option selection (Morning/Afternoon/Evening)
  const selectOption = (index: number) => {
    const copyOptions = [...options];
    copyOptions[index].isSelected = !copyOptions[index].isSelected;
    setOptions(copyOptions);

    const newMorning = copyOptions[0].isSelected;
    const newAfternoon = copyOptions[1].isSelected;
    const newEvening = copyOptions[2].isSelected;

    const anyOptionSelected = newMorning || newAfternoon || newEvening;

    const existingDayEntry = findMarkedDay(selectedDay);

    if (anyOptionSelected) {
      const updatedDay: MarkedDay = {
        dateString: selectedDay,
        morning: newMorning,
        afternoon: newAfternoon,
        evening: newEvening
      };

      if (existingDayEntry) {
        updateMarkedDay(updatedDay);
      } else {
        setMarkedDays((prevMarkedDays) => [...prevMarkedDays, updatedDay]);
      }
    } else {
      if (existingDayEntry) {
        removeMarkedDay(selectedDay);
      }
    }
  };

  // Function to prepare marked dates for the Calendar component
  const getMarkedDates = () => {
    const marked: { [date: string]: any } = {};

    markedDays.forEach((day) => {
      marked[day.dateString] = {
        selected: false,
        marked: true
      };
    });

    if (selectedDay) {
      if (marked[selectedDay]) {
        marked[selectedDay] = { selected: true, marked: true };
      } else {
        marked[selectedDay] = { selected: true, disableTouchEvent: false };
      }
    }

    return marked;
  };

  const advance = () => {
    updateHangoutData({ date: markedDays });
    router.push('/(build_hangout)/filters');
  }

  const goBack = () => {
    updateHangoutData({ date: markedDays });
    router.push('/(build_hangout)/invite');
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={{...styles.container, padding: 20}}>
        <BuildHangoutNavigator onNext={advance} onPrev={goBack} />
        <Text variant="bodySmall" style={{ paddingBottom: 20 }}>
          SELECT ALL THAT APPLY
        </Text>
        <Surface style={{ backgroundColor: theme.colors.background, padding: 10 }}>
          <Calendar
            style={{ width: 290 }}
            theme={calendarTheme}
            onDayPress={(day) => {
              setSelectedDay(day.dateString);
            }}
            markedDates={getMarkedDates()}
            enableSwipeMonths={true}
          />
        </Surface>
        <View style={{ width: '100%', paddingHorizontal: 70, paddingVertical: 20, gap: 20 }}>
          {options.map((option, index) => (
            <TouchableRipple
              key={`option_${index}`}
              onPress={() => selectOption(index)}
            >
              <View style={{
                ...styles.optionButton,
                backgroundColor: option.isSelected ? theme.colors.primary : theme.colors.background
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
      {
        markedDays.length > 0 && (
          <Surface
            style={styles.bottomBanner}
          >
            <Text>
              {markedDays.length} Selected
            </Text>
            <Button
              onPress={advance}
              mode='contained'
            >
              CONTINUE
            </Button>
          </Surface>
        )
      }
    </View>
  );
}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      width: '100%'
    },
    optionButton: {
      borderRadius: 10,
      borderWidth: 1,
      width: '100%',
      padding: 10
    },
    optionButtonLabel: {
      textAlign: 'center'
    },
    bottomBanner: {
      width: '100%', 
      flexDirection: 'row', 
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 40,
      paddingTop: 15,
      paddingBottom: 50,
    }
  });