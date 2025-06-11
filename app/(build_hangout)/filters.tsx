import BuildHangoutNavigator from '@/components/BuildHangoutNavigator';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Badge, List, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';

export default function FiltersScreen() {
  const theme = useTheme();
  const backgroundColor = theme.colors.background;
  const onBackgroundColor = theme.colors.onBackground;
  const primaryColor = theme.colors.primary;
  const onPrimaryColor = theme.colors.onPrimary;

  const [activityFilters, setActivityFilters] = useState([
    { value: 'DINNER', isSelected: false}, 
    { value: 'LUNCH', isSelected: false}, 
    { value: 'BRUNCH', isSelected: false}, 
    { value: 'COFFEE', isSelected: false}, 
    { value: 'PARK', isSelected: false}, 
    { value: 'DRINKS', isSelected: false}, 
    { value: 'MY PLACE', isSelected: false}
  ]);
  const [distanceFilters, setDistanceFilters] = useState([
    { value: 'UP TO 15 MINS AWAY', isSelected: false}, 
    { value: 'UP TO 30 MINS AWAY', isSelected: false},
    { value: 'UP TO 60 MINS AWAY', isSelected: false},
    { value: 'FIND A MIDPOINT', isSelected: false}
  ]);
  const [budgetFilters, setBudgetFilters] = useState([
    { value: "$", isSelected: false },
    { value: "$$", isSelected: false },
    { value: "$$$", isSelected: false },
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
  const generatePlan = () => {
    const activityArr = activityFilters.filter(activity => activity.isSelected).map(activity => activity.value);
    const distanceArr = distanceFilters.filter(distance => distance.isSelected).map(distance => distance.value);
    const budgetArr = budgetFilters.filter(budget => budget.isSelected).map(budget => budget.value);
    const filters = {
      activity: activityArr.length > 0 ? activityArr : null,
      distance: distanceArr.length > 0 ? distanceArr : null,
      budget: budgetArr.length > 0 ? budgetArr : null
    }
    console.log(filters);
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <BuildHangoutNavigator currentScreen='/(build_hangout)/filters' />
      <ScrollView style={{width: '100%', padding: 20}} contentContainerStyle={{alignItems: 'center'}}>
        <Text variant="bodyMedium">
          ALL SET?
        </Text>
        <TouchableRipple onPress={generatePlan}>
          <Surface style={{ ...styles.generatePlan, backgroundColor: theme.colors.primary }}>
            <Text variant="headlineLarge" style={{ color: theme.colors.onPrimary, textAlign: 'center' }}>
              GENERATE{"\n"}PLAN
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
                    <TouchableRipple style={{width: '48%', borderRadius: 30, overflow: 'hidden'}} onPress={() => selectActivity(idx)}>
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
                    <TouchableRipple style={{width: '100%', borderRadius: 30, overflow: 'hidden'}} onPress={() => selectDistance(idx)}>
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
                    <TouchableRipple style={{width: '100%', borderRadius: 30, overflow: 'hidden'}} onPress={() => selectBudget(idx)}>
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
  generatePlan: {
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