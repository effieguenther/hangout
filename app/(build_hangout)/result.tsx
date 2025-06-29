import BuildHangoutNavigator from '@/components/BuildHangoutNavigator';
import ResultCard from '@/components/ResultCard';
import { useHangoutBuilder } from '@/context/BuildHangoutContext';
import { Place } from '@/types/place';
import { GoogleGenAI } from '@google/genai';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';

export default function ResultScreen() {
  const theme = useTheme();
  const { hangoutData } = useHangoutBuilder();
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const errorMessage = 'There was an error retrieving recommendations. Please try again later.';
  const userInfo = {
    age: 29,
    gender: 'female'
  }
  const hangoutInfo = {
    dates: hangoutData.date,
    activity: hangoutData.filters?.activity
  }
  const { width: screenWidth } = Dimensions.get('window');
  const CARD_WIDTH = screenWidth * 0.8;
  const SPACING = screenWidth * 0.05;

  const onPrev = () => {
    router.push('/(build_hangout)/review');
  }

  const getGoogleMapsData = async () => {
    const userLocation = {latitude: 40.726113, longitude: -73.952996};
    const URL = `https://places.googleapis.com/v1/places:searchNearby?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
    const body = {
      "includedTypes": ["bar"],
      "maxResultCount": 20,
      "locationRestriction": {
        "circle": {
          "center": userLocation,
          "radius": 500
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
      console.log(data.places);
      return data;

    } catch (error) {
      console.error("Error fetching Google Maps data:", error);
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  }

  const getGeminiRecs = async () => {
    const data = await getGoogleMapsData();
    if (data.places && data.places.length > 3) {
      try {
        const ai = new GoogleGenAI({apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY});
        const prompt = `
          Analyze the following three JSON objects:
            1.  **User Information**: ${JSON.stringify(userInfo)}
            2.  **Hangout Details**: ${JSON.stringify(hangoutInfo)}
            3.  **Available Places**: ${JSON.stringify(data.places)}
          
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
    } else if (data.places > 0) {
      setResults(data.places);
      setLoading(false);
    } else {
      setError('There are no places that match your filters and location. Please try a broader search.');
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log("USE EFFECT")
    if (hangoutData) {
      // getGeminiRecs();
      const places = [
        {
          "id": "ChIJfyLfzJxZwokRUj6cyb40ClY",
          "types": [
            "bar_and_grill",
            "bar",
            "restaurant",
            "food",
            "point_of_interest",
            "establishment"
          ],
          "rating": 4.4,
          "userRatingCount": 563,
          "displayName": {
            "text": "Bk Backyard Bar",
            "languageCode": "en"
          },
          "dineIn": true,
          "servesLunch": true,
          "servesDinner": true,
          "servesBeer": true,
          "servesWine": true,
          "primaryType": "bar_and_grill",
          "editorialSummary": {
            "text": "Buzzing alfresco hangout whipping up burgers & finger foods, plus cocktails & draft beer.",
            "languageCode": "en"
          },
          "outdoorSeating": true,
          "liveMusic": true,
          "servesCocktails": true,
          "servesDessert": true,
          "servesCoffee": true,
          "goodForChildren": true,
          "goodForGroups": true,
          "goodForWatchingSports": true,
          "generativeSummary": {
            "overview": {
              "text": "Spacious venue with picnic tables and a beach volleyball court, featuring DJs, sports on TV, and live music.",
              "languageCode": "en-US"
            },
            "overviewFlagContentUri": "https://www.google.com/local/review/rap/report?postId=CiUweDg5YzI1OTljY2NkZjIyN2Y6MHg1NjBhMzRiZWM5OWMzZTUyMAI&d=17924085&t=12",
            "disclosureText": {
              "text": "Summarized with Gemini",
              "languageCode": "en-US"
            }
          },
          "reviewSummary": {
            "text": {
              "text": "People say this bar and grill offers great drinks, games, and live music. They also highlight the fun, lively, and welcoming atmosphere, and the friendly and attentive bartenders.\n\nOther reviews mention the drinks can be expensive.",
              "languageCode": "en-US"
            },
            "flagContentUri": "https://www.google.com/local/review/rap/report?postId=5%401:CAIQACodChtyc19oOkRveHhBOFpWTDNBZEU3NGlncFRSZ1E%7CCAIQACoqChtyc19oOkRveHhBOFpWTDNBZEU3NGlncFRSZ1ESCwju3_XCBhDm9rkb&d=17924085&t=8",
            "disclosureText": {
              "text": "Summarized with Gemini",
              "languageCode": "en-US"
            },
            "reviewsUri": "https://www.google.com/maps/place//data=!4m4!3m3!1s0x89c2599cccdf227f:0x560a34bec99c3e52!9m1!1b1"
          }
        },
        {
          "id": "ChIJhZwYPkNZwokR5br0SgJqx2o",
          "types": [
            "bar",
            "point_of_interest",
            "establishment"
          ],
          "rating": 4.3,
          "priceLevel": "PRICE_LEVEL_MODERATE",
          "userRatingCount": 960,
          "displayName": {
            "text": "The Gutter",
            "languageCode": "en"
          },
          "dineIn": true,
          "servesBeer": true,
          "servesWine": true,
          "primaryType": "bar",
          "editorialSummary": {
            "text": "Old-school, low-tech bowling alley with an attached barroom that hosts live music.",
            "languageCode": "en"
          },
          "outdoorSeating": true,
          "liveMusic": true,
          "servesCocktails": true,
          "goodForGroups": true,
          "goodForWatchingSports": true,
          "reviewSummary": {
            "text": {
              "text": "People say this bar offers bowling and drinks. They also highlight the authentic experience, fun atmosphere, and friendly staff.\n\nSome reviews mention there can be a long wait.",
              "languageCode": "en-US"
            },
            "flagContentUri": "https://www.google.com/local/review/rap/report?postId=5%401:CAIQACodChtyc19oOkdBaGtGSmFXbWxzRmhOMUpFZkpocHc%7CCAIQACorChtyc19oOkdBaGtGSmFXbWxzRmhOMUpFZkpocHcSDAiW6vXCBhCq2KKgAw&d=17924085&t=8",
            "disclosureText": {
              "text": "Summarized with Gemini",
              "languageCode": "en-US"
            },
            "reviewsUri": "https://www.google.com/maps/place//data=!4m4!3m3!1s0x89c259433e189c85:0x6ac76a024af4bae5!9m1!1b1"
          }
        },
        {
          "id": "ChIJofE6JSBZwokRkOG-yB0pXns",
          "types": [
            "bar",
            "point_of_interest",
            "establishment"
          ],
          "rating": 4.3,
          "userRatingCount": 228,
          "displayName": {
            "text": "Twins Lounge",
            "languageCode": "en"
          },
          "dineIn": true,
          "servesBeer": true,
          "servesWine": true,
          "primaryType": "bar",
          "outdoorSeating": true,
          "liveMusic": false,
          "servesCocktails": true,
          "goodForChildren": false,
          "goodForGroups": true,
          "goodForWatchingSports": false,
          "generativeSummary": {
            "overview": {
              "text": "Mid-century modern-style bar offering beer, cocktails, pool tables, and a patio.",
              "languageCode": "en-US"
            },
            "overviewFlagContentUri": "https://www.google.com/local/review/rap/report?postId=CiUweDg5YzI1OTIwMjUzYWYxYTE6MHg3YjVlMjkxZGM4YmVlMTkwMAI&d=17924085&t=12",
            "disclosureText": {
              "text": "Summarized with Gemini",
              "languageCode": "en-US"
            }
          },
          "reviewSummary": {
            "text": {
              "text": "People say this bar offers cheap and tasty drinks, including a solid Old Fashioned and a spicy margarita. They also highlight the cozy atmosphere, cool decoration, and the presence of pool tables and a photo booth.\n\nOther reviews mention the bartenders can be unfriendly.",
              "languageCode": "en-US"
            },
            "flagContentUri": "https://www.google.com/local/review/rap/report?postId=5%401:CAIQACodChtyc19oOk1PcS1DLU56cTBwZmJLX2ZsMGJwUFE%7CCAIQACoqChtyc19oOk1PcS1DLU56cTBwZmJLX2ZsMGJwUFESCwjLjuvCBhDE0PIa&d=17924085&t=8",
            "disclosureText": {
              "text": "Summarized with Gemini",
              "languageCode": "en-US"
            },
            "reviewsUri": "https://www.google.com/maps/place//data=!4m4!3m3!1s0x89c25920253af1a1:0x7b5e291dc8bee190!9m1!1b1"
          }
        }
      ];
      setResults(places);
      setLoading(false);
    }
  }, [hangoutData])

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator animating={true} size='large' />
      </View>
    )
  } else if (!loading && error) {
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
  } else {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <BuildHangoutNavigator onPrev={onPrev} nextDisabled={true} />
        <View style={{ flex: 1 }}>
          {
            results.map((place, idx) => (
              <ResultCard key={`result_${idx}`} place={place} />
            ))
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
});