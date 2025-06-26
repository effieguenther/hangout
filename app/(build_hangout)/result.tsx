import BuildHangoutNavigator from '@/components/BuildHangoutNavigator';
import { useHangoutBuilder } from '@/context/BuildHangoutContext';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export default function ResultScreen() {
  const theme = useTheme();
  const { hangoutData } = useHangoutBuilder();
  const [results, setResults] = useState([]);

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
  }

  useEffect(() => {
    console.log("USE EFFECT")
    if (hangoutData) {
      getGoogleMapsData();
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