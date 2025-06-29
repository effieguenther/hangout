import BuildHangoutNavigator from '@/components/BuildHangoutNavigator';
import { useHangoutBuilder } from '@/context/BuildHangoutContext';
import { GoogleGenAI } from '@google/genai';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function ResultScreen() {
  const theme = useTheme();
  const { hangoutData } = useHangoutBuilder();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const userInfo = {
    age: 29,
    gender: 'female'
  }
  const hangoutInfo = {
    dates: hangoutData.date,
    activity: hangoutData.filters?.activity
  }

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
        throw new Error(`Failed to fetch Google Maps data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data.places);
      return data;

    } catch (error) {
      console.error("Error fetching Google Maps data:", error);
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

      } catch (error) {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    console.log("USE EFFECT")
    if (hangoutData) {
      getGeminiRecs();
    }
  }, [hangoutData])

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <BuildHangoutNavigator onPrev={onPrev} nextDisabled={true} />
      <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>
        Result Screen
      </Text>
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
});