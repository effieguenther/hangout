// app/(app)/preferences.js
import BuildHangoutNavigator from '@/components/BuildHangoutNavigator';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';

export default function FiltersScreen() {
  const theme = useTheme();
  const activityFilters = ['DINNER', 'LUNCH', 'BRUNCH', 'COFFEE', 'PARK', 'DRINKS', 'MY PLACE'];
  const distanceFilters = ['UP TO 15 MINS AWAY', 'UP TO 30 MINS AWAY', 'UP TO 60 MINS AWAY', 'FIND A MIDPOINT'];
  const budgetFilters = ["$", "$$", "$$$"]

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <BuildHangoutNavigator currentScreen='/(build_hangout)/filters' />
      <Text variant="bodyMedium" style={{ color: theme.colors.onBackground, marginBottom: 20 }}>
        OPTIONAL FILTERS
      </Text>
      <View style={{width: '90%'}}>
        <List.AccordionGroup>
          <List.Accordion title="ACTIVITY" id="1" style={styles.accordion}>
            <View style={styles.listItemContainer}>
              {
                activityFilters.map((activity, idx) => (
                  <List.Item 
                    key={`activity_item_${idx}`} 
                    title={activity} 
                    style={{...styles.listItem, width: '48%'}}
                  />
                ))
              }
            </View>
          </List.Accordion>
          <List.Accordion title="DISTANCE" id="2" style={styles.accordion}>
            <View style={styles.listItemContainer}>
              {
                distanceFilters.map((activity, idx) => (
                  <List.Item 
                    key={`distance_item_${idx}`} 
                    title={activity} 
                    style={{...styles.listItem, width: '100%'}}
                  />
                ))
              }
            </View>
          </List.Accordion>
          <List.Accordion title="BUDGET" id="3" style={styles.accordion}>
            <View style={styles.listItemContainer}>
              {
                budgetFilters.map((activity, idx) => (
                  <List.Item 
                    key={`budget_item_${idx}`} 
                    title={activity} 
                    style={{...styles.listItem, width: '100%'}}
                  />
                ))
              }
            </View>
          </List.Accordion>
        </List.AccordionGroup>
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
  accordion: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20
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
    borderRadius: 10
  }
});