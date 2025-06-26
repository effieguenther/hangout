import BuildHangoutNavigator from '@/components/BuildHangoutNavigator';
import { useHangoutBuilder } from '@/context/BuildHangoutContext';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, Surface, Text, TouchableRipple, useTheme } from 'react-native-paper';

export default function ResultScreen() {
  const theme = useTheme();
  const { hangoutData } = useHangoutBuilder();

  const onPrev = () => {
    router.push('/(build_hangout)/filters');
  }
  const onNext = () => {
    router.push('/(build_hangout)/result');
  }
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <BuildHangoutNavigator onPrev={onPrev} onNext={onNext} />
      <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>
        Review
      </Text>
      <ScrollView style={{ width: '100%', padding: 20 }}>
        <View style={styles.infoContainer}>
          <View style={styles.sectionContainer}>
            <View style={{ flex: 1 }}>
              <Text variant='bodyLarge' style={styles.sectionTitle}>
                Invite
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {
                  hangoutData.invitedContacts?.map((contact, idx) => 
                    <Text key={`invitedContact_${idx}`}>
                      {contact.firstName} {contact.lastName}
                      {idx < hangoutData.invitedContacts?.length - 1 ? ', ' : ''}
                    </Text>
                  )
                }
              </View>
            </View>
            <View>
              <IconButton
                icon="pencil-outline"
                mode="outlined"
                size={20}
                onPress={() => router.push('/(build_hangout)/invite')}
              />
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <View style={{ flex: 1 }}>
              <Text variant='bodyLarge' style={styles.sectionTitle}>
                Days/Times
              </Text>
              <View>
                {
                  hangoutData.date?.map((date, idx) => 
                    <View key={`date_${idx}`}>
                      <Text>
                        <Text style={{ color: theme.colors.primary }}>
                          {date.dateString + " "}
                        </Text>
                        <Text>
                          (
                            {date.morning && "Morning"}
                            {date.morning && (date.afternoon || date.evening) && ", "}
                            {date.afternoon && "Afternoon"}
                            {date.afternoon && date.evening && ", "}
                            {date.evening && "Evening"}
                          )
                        </Text>
                      </Text>
                    </View>
                  )
                }
              </View>
            </View>
            <View>
              <IconButton
                icon="pencil-outline"
                mode="outlined"
                size={20}
                onPress={() => router.push('/(build_hangout)/date')}
              />
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <View style={{ flex: 1 }}>
              <Text variant='bodyLarge' style={styles.sectionTitle}>
                Filters
              </Text>
              <View>
                <Text style={{ color: theme.colors.primary }}>
                  Activity{" "}
                  {
                    hangoutData.filters?.activity?.map((activity, idx) => 
                      <Text key={`filter_${idx}`}>
                        {activity.toLowerCase()}
                        {idx < hangoutData.filters?.activity?.length - 1 ? ', ' : ''}
                      </Text>
                    )
                  }
                </Text>
                <Text style={{ color: theme.colors.primary }}>
                  Distance{" "}
                  {
                    hangoutData.filters?.distance?.map((distance, idx) => 
                      <Text key={`filter_${idx}`}>
                        {distance.toLowerCase()}
                        {idx < hangoutData.filters?.distance?.length - 1 ? ', ' : ''}
                      </Text>
                    )
                  }
                </Text>
                <Text style={{ color: theme.colors.primary }}>
                  Budget{" "}
                  {
                    hangoutData.filters?.budget?.map((budget, idx) => 
                      <Text key={`filter_${idx}`}>
                        {budget.toLowerCase()}
                        {idx < hangoutData.filters?.budget?.length - 1 ? ', ' : ''}
                      </Text>
                    )
                  }
                </Text>
              </View>
            </View>
            <View>
              <IconButton
                icon="pencil-outline"
                mode="outlined"
                size={20}
                onPress={() => router.push('/(build_hangout)/filters')}
              />
            </View>
          </View>
        </View>
        <TouchableRipple onPress={onNext}>
          <Surface style={{ ...styles.continue, backgroundColor: theme.colors.primary }}>
            <Text variant="headlineLarge" style={{ color: theme.colors.onPrimary, textAlign: 'center' }}>
              CONTINUE
            </Text>
          </Surface>
        </TouchableRipple>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoContainer: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    width: '100%'
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 35
  },
  sectionTitle: {
    marginBottom: 10, 
    fontWeight: 600 
  },
  continue: {
    padding: 20,
    marginTop: 20,
    marginBottom: 40,
    borderRadius: 10
  },
});