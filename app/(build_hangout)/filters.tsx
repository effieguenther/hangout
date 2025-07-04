import BuildHangoutNavigator from '@/components/BuildHangoutNavigator';
import { useHangoutBuilder } from '@/context/BuildHangoutContext';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Badge, List, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';

export default function FiltersScreen() {
  const theme = useTheme();
  const backgroundColor = theme.colors.background;
  const onBackgroundColor = theme.colors.onBackground;
  const primaryColor = theme.colors.primary;
  const onPrimaryColor = theme.colors.onPrimary;
  const { hangoutData, updateHangoutData } = useHangoutBuilder();

  const activityIsSelected = (activity: string) => hangoutData?.filters?.activity.find((filter) => filter === activity);
  const distanceIsSelected = (distance: string) => hangoutData?.filters?.distance.find((filter) => filter === distance);
  const budgetIsSelected = (budget: string) => hangoutData?.filters?.budget.find((filter) => filter === budget);

  const [activityFilters, setActivityFilters] = useState([
    { value: 'DINNER', isSelected: activityIsSelected('DINNER')}, 
    { value: 'LUNCH', isSelected: activityIsSelected('LUNCH')}, 
    { value: 'BRUNCH', isSelected: activityIsSelected('BRUNCH')}, 
    { value: 'COFFEE', isSelected: activityIsSelected('COFFEE')}, 
    { value: 'PARK', isSelected: activityIsSelected('PARK')}, 
    { value: 'DRINKS', isSelected: activityIsSelected('DRINKS')}, 
  ]);
  const [distanceFilters, setDistanceFilters] = useState([
    { value: 'UP TO 15 MINS AWAY', isSelected: distanceIsSelected('UP TO 15 MINS AWAY')}, 
    { value: 'UP TO 30 MINS AWAY', isSelected: distanceIsSelected('UP TO 30 MINS AWAY')},
    { value: 'UP TO 60 MINS AWAY', isSelected: distanceIsSelected('UP TO 60 MINS AWAY')},
    { value: 'FIND A MIDPOINT', isSelected: distanceIsSelected('FIND A MIDPOINT')}
  ]);
  const [budgetFilters, setBudgetFilters] = useState([
    { value: "$", isSelected: budgetIsSelected("$") },
    { value: "$$", isSelected: budgetIsSelected("$$") },
    { value: "$$$", isSelected: budgetIsSelected("$$$") },
  ]);

  const selectedActivityCount = activityFilters.filter(a => a.isSelected).length;
  const selectedDistanceCount = distanceFilters.filter(d => d.isSelected).length;
  const selectedBudgetCount = budgetFilters.filter(b => b.isSelected).length;

  const selectActivity = (idx: number) => {
    const copy = [...activityFilters];
    copy[idx].isSelected = !copy[idx].isSelected;
    setActivityFilters(copy);
  }
  const selectDistance = (idx: number) => {
    const copy = [...distanceFilters];
    copy[idx].isSelected = !copy[idx].isSelected;
    setDistanceFilters(copy);
  }
  const selectBudget = (idx: number) => {
    const copy = [...budgetFilters];
    copy[idx].isSelected = !copy[idx].isSelected;
    setBudgetFilters(copy);
  }
  const prepareFilterData = () => {
    const activityArr = activityFilters.filter(activity => activity.isSelected).map(activity => activity.value);
    const distanceArr = distanceFilters.filter(distance => distance.isSelected).map(distance => distance.value);
    const budgetArr = budgetFilters.filter(budget => budget.isSelected).map(budget => budget.value);
    return {
      activity: activityArr.length > 0 ? activityArr : [],
      distance: distanceArr.length > 0 ? distanceArr : [],
      budget: budgetArr.length > 0 ? budgetArr : []
    }
  }
  const onNext = () => {
    const filters = prepareFilterData();
    updateHangoutData({ filters });
    router.push('/(build_hangout)/review');
  }

  const goBack = () => {
    const filters = prepareFilterData();
    updateHangoutData({ filters });
    router.push('/(build_hangout)/date');
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <BuildHangoutNavigator onNext={onNext} onPrev={goBack} />
      <ScrollView style={{width: '100%', padding: 20}} contentContainerStyle={{alignItems: 'center'}}>
        <Text variant="bodyMedium">
          ALL SET?
        </Text>
        <TouchableRipple onPress={onNext}>
          <Surface style={{ ...styles.continue, backgroundColor: theme.colors.primary }}>
            <Text variant="headlineLarge" style={{ color: theme.colors.onPrimary, textAlign: 'center' }}>
              CONTINUE
            </Text>
          </Surface>
        </TouchableRipple>
        <Text variant="bodyMedium" style={{ color: theme.colors.onBackground, marginBottom: 20 }}>
          OPTIONAL FILTERS
        </Text>
        <View style={{width: '90%'}}>
          <List.AccordionGroup>
            <List.Accordion 
              title="ACTIVITY" 
              id="1" 
              style={styles.accordion}
              right={props => (
                <View>
                  {selectedActivityCount > 0 && (
                    <Badge size={24} style={{ backgroundColor: primaryColor, color: onPrimaryColor }}>
                      {selectedActivityCount}
                    </Badge>
                  )}
                </View>
              )}
            >
              <View style={styles.listItemContainer}>
                {
                  activityFilters.map((activity, idx) => (
                    <TouchableRipple 
                      style={{width: '48%', borderRadius: 30, overflow: 'hidden'}} 
                      onPress={() => selectActivity(idx)}
                      key={`activity_${idx}`}
                    >
                      <List.Item 
                        key={`activity_item_${idx}`} 
                        title={activity.value} 
                        style={{
                          ...styles.listItem, 
                          backgroundColor: activity.isSelected ? primaryColor : backgroundColor
                        }}
                        titleStyle={{
                          textAlign: 'center',
                          color: activity.isSelected ? onPrimaryColor : onBackgroundColor
                        }}
                      />
                    </TouchableRipple>
                  ))
                }
              </View>
            </List.Accordion>
            <List.Accordion 
              title="DISTANCE" 
              id="2" 
              style={styles.accordion}
              right={props => (
                <View>
                  {selectedDistanceCount > 0 && (
                    <Badge size={24} style={{ backgroundColor: primaryColor, color: onPrimaryColor }}>
                      {selectedDistanceCount}
                    </Badge>
                  )}
                </View>
              )}
            >
              <View style={styles.listItemContainer}>
                {
                  distanceFilters.map((distance, idx) => (
                    <TouchableRipple 
                      style={{width: '100%', borderRadius: 30, overflow: 'hidden'}} 
                      onPress={() => selectDistance(idx)}
                      key={`distance_${idx}`}
                    >
                      <List.Item 
                        key={`distance_item_${idx}`} 
                        title={distance.value} 
                        style={{
                          ...styles.listItem, 
                          backgroundColor: distance.isSelected ? primaryColor : backgroundColor
                        }}
                        titleStyle={{
                          textAlign: 'center',
                          color: distance.isSelected ? onPrimaryColor : onBackgroundColor
                        }}
                      />
                    </TouchableRipple>
                  ))
                }
              </View>
            </List.Accordion>
            <List.Accordion 
              title="BUDGET" 
              id="3" 
              style={styles.accordion}
              right={props => (
                <View>
                  {selectedBudgetCount > 0 && (
                    <Badge size={24} style={{ backgroundColor: primaryColor, color: onPrimaryColor }}>
                      {selectedBudgetCount}
                    </Badge>
                  )}
                </View>
              )}
            >
              <View style={styles.listItemContainer}>
                {
                  budgetFilters.map((budget, idx) => (
                    <TouchableRipple 
                      style={{width: '100%', borderRadius: 30, overflow: 'hidden'}} 
                      onPress={() => selectBudget(idx)}
                      key={`budget_${idx}`}
                    >
                      <List.Item 
                        key={`budget_item_${idx}`} 
                        title={budget.value} 
                        style={{
                          ...styles.listItem, 
                          backgroundColor: budget.isSelected ? primaryColor : backgroundColor
                        }}
                        titleStyle={{
                          textAlign: 'center',
                          color: budget.isSelected ? onPrimaryColor : onBackgroundColor
                        }}
                      />
                    </TouchableRipple>
                  ))
                }
              </View>
            </List.Accordion>
          </List.AccordionGroup>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  continue: {
    padding: 20,
    marginTop: 20,
    marginBottom: 40,
    borderRadius: 10
  },
  accordion: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  },
  listItemContainer: {
    gap: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  listItem: {
    borderWidth: 1,
    borderRadius: 30,
    textAlign: 'center',
    width: '100%'
  }
});