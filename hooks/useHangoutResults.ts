import HangoutData from '@/types/hangoutData/HangoutData';
import { getUserLocation } from '@/utils/userLocation';
import { GoogleGenAI } from '@google/genai';
import { useEffect, useState } from 'react';

export const useHangoutResults = (hangoutData: HangoutData) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hangoutDataForAI = {
    dates: hangoutData.date,
    activity: hangoutData.filters?.activity,
  }
  // TO DO: replace with actual user data
  const userInfo = {
    age: 29,
    gender: 'female'
  }

  const errorMessage = 'There was an error retrieving hangout suggestions. Please try again.';

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

  const getGoogleMapsData = async () => {
    const { location: userLocation, errorMsg } = await getUserLocation();
    if (errorMsg) {
      setError('Location permission is required to get hangout suggestions. Please enable location services and try again.');
      setLoading(false);
      return null;
    }
    console.log(userLocation);
    const types = getIncludedTypes();
    const URL = `https://places.googleapis.com/v1/places:searchNearby?key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    const body = {
      includedTypes: types,
      maxResultCount: 20,
      locationRestriction: {
        circle: { center: userLocation, radius: getRadius() }
      }
    };
    const headers = {
      "Content-Type": "application/json",
      "X-Goog-FieldMask": "places.id,places.types,places.rating,places.priceLevel,places.userRatingCount,places.displayName,places.dineIn,places.servesBreakfast,places.servesLunch,places.servesDinner,places.servesBeer,places.servesWine,places.servesBrunch,places.primaryType,places.editorialSummary,places.outdoorSeating,places.liveMusic,places.menuForChildren,places.servesCocktails,places.servesDessert,places.servesCoffee,places.goodForChildren,places.goodForGroups,places.goodForWatchingSports,places.generativeSummary,places.reviewSummary"
    };

    try {
      const response = await fetch(URL, { method: 'POST', headers, body: JSON.stringify(body) });
      if (!response.ok) {
        setError(errorMessage);
        setLoading(false);
        return null;
      }
      const data = await response.json();
      const budgetData = getBudgetData();
      if (budgetData) {
        return data.places?.filter(place => !place.priceLevel || budgetData.includes(place.priceLevel));
      }
      return data.places;
    } catch (error) {
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  const getGeminiRecs = async () => {
    const places = await getGoogleMapsData();
    if (places?.length > 3) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY });
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
        `;
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash-001',
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: { responseMimeType: "application/json" }
        });
        const aiResponseText = response?.candidates[0]?.content?.parts[0]?.text;
        if (aiResponseText) {
          setResults(JSON.parse(aiResponseText));
        } else {
          setError(errorMessage);
        }
        setLoading(false);
      } catch (error) {
        setError(errorMessage);
        setLoading(false);
      }
    } else if (places?.length > 0) {
      setResults(places);
      setLoading(false);
    } else {
      setError('There are no places that match your filters and location. Please try a broader search.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hangoutData) getGeminiRecs();
  }, [hangoutData]);

  return { results, loading, error };
};