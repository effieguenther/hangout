import BuildHangoutNavigator from '@/components/BuildHangoutNavigator';
import ResultCard from '@/components/ResultCard';
import SendTextModal from '@/components/SendTextModal';
import { useHangoutBuilder } from '@/context/BuildHangoutContext';
import { Place } from '@/types/place';
import { GoogleGenAI } from '@google/genai';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Portal,
  Surface,
  Text,
  TouchableRipple,
  useTheme
} from 'react-native-paper';
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";

const CONTAINER_PADDING = 20;

export default function ResultScreen() {
  const theme = useTheme();
  const { hangoutData} = useHangoutBuilder();
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedResults, setSelectedResults] = useState<Place[]>([]);
  const [ModalVisible, setModalVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const selectResult = (place: Place) => {
    const selectedResult = selectedResults.find(result => result.id === place.id);
    let copy = []
    if (selectedResult) {
      copy = selectedResults.filter(result => result.id !== place.id);
    } else {
      copy = [...selectedResults]
      copy.push(place);
    }
    console.log(copy);
    setSelectedResults(copy);
  }
  const errorMessage = 'There was an error retrieving recommendations. Please try again later.';
  const userInfo = {
    age: 29,
    gender: 'female'
  }
  const hangoutDataForAI = {
    dates: hangoutData.date,
    activity: hangoutData.filters?.activity,
  }

  const getBudgetData = (): String[] | null => {
    if (hangoutData && hangoutData.filters?.budget?.length) {
      const budgetData: String[] = []
      hangoutData.filters.budget.forEach((budget: String) => {
        if (budget === '$') {
          budgetData.push('PRICE_LEVEL_INEXPENSIVE');
          budgetData.push('PRICE_LEVEL_FREE');
        } else if (budget === '$$') {
          budgetData.push('PRICE_LEVEL_MODERATE');
        } else if (budget === '$$$') {
          budgetData.push('PRICE_LEVEL_EXPENSIVE');
          budgetData.push('PRICE_LEVEL_VERY_EXPENSIVE');
        }
      })
      return budgetData;
    } else {
      return null;
    }
  }

  const getIncludedTypes = () => {
    const types: string[] = [];
    const activities = hangoutData.filters?.activity
    if (activities && activities.length > 0) {
      activities.forEach(activity => {
        if (activity === 'DINNER' || activity === 'LUNCH' || activity === 'BRUNCH') {
          if (!types.includes('restaurant')) {
            types.push('restaurant');
          }
        }
        if (activity === 'DRINKS') {
          types.push('bar');
        }
        if (activity === 'COFFEE') {
          types.push('cafe');
          types.push('coffee_shop')
        }
        if (activity === 'PARK') {
          types.push('park');
        }
      })
    }
    return types;
  }
  
  const getRadius = () => {
    const distance = hangoutData.filters?.distance;
    if (hangoutData && distance) {
      if (distance === 'UP TO 15 MINS AWAY') {
        return 1500
      } else if (distance === 'UP TO 30 MINS AWAY') {
        return 3000
      } else if (distance === 'UP TO 60 MINS AWAY') {
        return 6000
      } else if (distance === 'FIND A MIDPOINT') {
        // TO DO: switch google API clal to 'search along route' when multiple user locations are available
        return 3000 
      }
    } else {
      return 3000
    }
  }

  const buildText = () => {
    const message = ['Hey'];
    if (hangoutData.invitedContacts) {
      message.push(' ' + hangoutData?.invitedContacts[0]?.firstName)
      const contactsLen = hangoutData?.invitedContacts?.length;
      if (contactsLen === 2) {
        message.push(` and ${hangoutData.invitedContacts[1].firstName}`)
      } else if (contactsLen > 1) {
        message.push(', ');
          for (let i = 1; i < contactsLen; i++) {
          if (i + 1 === contactsLen) {
            message.push(`and ${hangoutData?.invitedContacts[i]?.firstName}`)
          } else if (i + 1 < contactsLen) {
            message.push(`${hangoutData?.invitedContacts[i]?.firstName}, `)
          }
        }
      }
    }
    message.push(", let's go to one of these places?\n\n")
    for (let i = 0; i < selectedResults.length; i++) {
      message.push(selectedResults[i]?.displayName?.text + '\n')
    }
    console.log(message);
    console.log(message.join(''));
    return message.join('');
  }

  const screenWidth = Dimensions.get('window').width;
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const onPrev = () => {
    router.push('/(build_hangout)/review');
  }

  const getGoogleMapsData = async () => {
    const userLocation = {latitude: 40.726113, longitude: -73.952996};
    const types = getIncludedTypes();
    const URL = `https://places.googleapis.com/v1/places:searchNearby?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
    const body = {
      "includedTypes": types,
      "maxResultCount": 20,
      "locationRestriction": {
        "circle": {
          "center": userLocation,
          "radius": getRadius()
        }
      }
    }
    const headers = {
      "Content-Type": "application/json",
      "X-Goog-FieldMask": "places.id,places.types,places.rating,places.priceLevel,places.userRatingCount,places.displayName,places.dineIn,places.servesBreakfast,places.servesLunch,places.servesDinner,places.servesBeer,places.servesWine,places.servesBrunch,places.primaryType,places.editorialSummary,places.outdoorSeating,places.liveMusic,places.menuForChildren,places.servesCocktails,places.servesDessert,places.servesCoffee,places.goodForChildren,places.goodForGroups,places.goodForWatchingSports,places.generativeSummary,places.reviewSummary"
    }

    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`HTTP error! Status: ${response.status}`, errorData);
        setError(errorMessage)
        setLoading(false);
        return null;
      }

      const data = await response.json();
      if (data.places?.length) {
        const budgetData = getBudgetData();
        if (budgetData) {
          return data.places.filter((place: Place) => 
            !place.priceLevel || budgetData.includes(place.priceLevel) 
          );
        }
      }

      return data.places;

    } catch (error) {
      console.error("Error fetching Google Maps data:", error);
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  }

  const getGeminiRecs = async () => {
    const places = await getGoogleMapsData();
    if (places && places.length > 3) {
      try {
        const ai = new GoogleGenAI({apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY});
        const prompt = `
          Analyze the following three JSON objects:
            1.  **User Information**: ${JSON.stringify(userInfo)}
            2.  **Hangout Details**: ${JSON.stringify(hangoutDataForAI)}
            3.  **Available Places**: ${JSON.stringify(places)}
          
          Based on all the provided data, act as a recommendation engine. Your task is to select the top 3 places from the "Available Places" list that best match the "User Information" and "Hangout Details".

          Consider the following criteria for your selection:
          - The places must be open at the specified date and time.
          - The type of place must be appropriate for the specified activity.
          - The choice should align with the user's preferences.

          Your response MUST be a valid JSON array containing the 3 selected place objects.
        `
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash-001',
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            responseMimeType: "application/json",
          }
        })
        const aiResponseText = response.candidates[0].content?.parts[0].text;
        const parsedResults = JSON.parse(aiResponseText);
        setResults(parsedResults);
        setLoading(false);

      } catch (error) {
        console.error(error);
        setError(errorMessage);
        setLoading(false);
      }
    } else if (places.length > 0) {
      setResults(places);
      setLoading(false);
    } else {
      setError('There are no places that match your filters and location. Please try a broader search.');
      setLoading(false);
    }
  }

  useEffect(() => {
    if (hangoutData) {
      getGeminiRecs();
    }
  }, [hangoutData])

  useEffect(() => {
    setMessage(buildText());
  }, [selectedResults.length])

  if (!loading && error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <BuildHangoutNavigator onPrev={onPrev} nextDisabled={true} />
        <View style={{flex: 1, justifyContent: 'center', padding: 10}}>
          <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
            {error}
          </Text>
        </View>
      </View>
    )
  } else if (!loading && !error && screenWidth) {
    return (
      <View style={styles.container}>
        <Portal>
          <SendTextModal 
            visible={ModalVisible}
            setVisible={setModalVisible}
            message={message}
          />
        </Portal>
        <View style={{...styles.container, padding: CONTAINER_PADDING, backgroundColor: theme.colors.background}}>
          <BuildHangoutNavigator onPrev={onPrev} nextDisabled={true} />
          <View style={styles.carouselWrapper}>
            <Carousel
              ref={ref}
              width={screenWidth - (CONTAINER_PADDING * 2)}
              height={undefined}
              data={results}
              onProgressChange={progress}
              loop={false}
              renderItem={({item, index}) => (
                <TouchableRipple 
                  style={{
                    marginHorizontal: 10,
                    borderRadius: 30,
                    borderWidth: 2,
                    borderColor: selectedResults.find(result => result.id === item.id)
                      ? theme.colors.primary
                      : theme.colors.onBackground
                  }} 
                  onPress={() => selectResult(item)}
                >
                  <ResultCard key={`result_${index}`} place={item} />
                </TouchableRipple>
              )}
            />
      
            <Pagination.Basic
              progress={progress}
              data={results}
              dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
              containerStyle={{ gap: 5, marginTop: 20 }}
              onPress={onPressPagination}
            />
          </View>
        </View>
          {
            selectedResults.length > 0 && (
              <Surface
                style={styles.bottomBanner}
              >
                <Text style={{flex: 1, marginRight: 18}}>
                  {selectedResults.length} Selected
                </Text>
                <Button
                  onPress={() => setModalVisible(true)}
                  mode='contained'
                  buttonColor={theme.colors.secondary}
                  textColor={theme.colors.onSecondary}
                  style={{borderRadius: 10}}
                >
                  CONTINUE
                </Button>
              </Surface>
            )
          }
      </View>
    )
  } else {
    return (
      <View style={{
        ...styles.container, 
        backgroundColor: theme.colors.background, 
        justifyContent: 'center', 
        alignItems: 'center',
        paddingHorizontal: 70
      }}>
        <ActivityIndicator animating={true} size='large' />
        <Text style={{
          textAlign: 'center',
          marginTop: 40
        }}>
          Just a moment while we find the best options for you…
        </Text>
      </View>
    )
  } 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselWrapper: {
    flex: 1, 
    width: '100%', 
    marginBottom: 100 
  },
  bottomBanner: {
    width: '100%', 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 15,
    paddingBottom: 50
  }
});