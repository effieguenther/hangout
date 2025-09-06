import DetailedPlace from '@/types/DetailedPlace';
import Place from '@/types/Place';
import { getObjData, storeObjData } from '@/utils/cacheData';
import { useCallback, useEffect, useState } from 'react';

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const userLocation = {latitude: 40.726113, longitude: -73.952996};

interface UsePlaceDetailsResult {
  detailedPlace: DetailedPlace | null;
  isDetailLoading: boolean;
  detailError: string | null;
}

const usePlaceDetails = (place: Place): UsePlaceDetailsResult => {
  const [detailedPlace, setDetailedPlace] = useState<DetailedPlace | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  const [detailError, setDetailError] = useState<string | null>(null);

  const fetchTravelTime = async (mode: 'driving' | 'walking' | 'transit', origins: string, destinations: string): Promise<string | null> => {
    try {
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&mode=${mode}&departure_time=now&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || data.status !== 'OK') {
        console.error(`Error fetching ${mode} travel time:`, data.error_message || data.status);
        return null;
      }

      if (data.rows && data.rows.length > 0 && data.rows[0].elements && data.rows[0].elements.length > 0) {
        const element = data.rows[0].elements[0];
        if (element.status === 'OK' && element.duration) {
          return element.duration.text;
        } else {
          console.warn(`Travel time not available for ${mode}: ${element.status}`);
          return null;
        }
      } else {
        console.warn(`No travel time data found for ${mode}.`);
        return null;
      }
    } catch (error: any) {
      console.error(`Network error fetching ${mode} travel time:`, error.message);
      return null;
    }
  };
  
  const fetchDetails = useCallback(async (currentPlace: Place) => {
    setIsDetailLoading(true);
    setDetailError(null);

    // check cache for existing data
    const cacheData = await getObjData(place.id);
    if (cacheData) setDetailedPlace(cacheData);

    try {
      // fetch additional details about the place
      const placeDetailsUrl = `https://places.googleapis.com/v1/places/${currentPlace.id}?fields=photos,location,formattedAddress,websiteUri&key=${GOOGLE_MAPS_API_KEY}`;
      const placeDetailsResponse = await fetch(placeDetailsUrl);
      const placeDetailsData = await placeDetailsResponse.json();

      if (!placeDetailsResponse.ok) {
        setDetailError(`Failed to fetch place details: ${placeDetailsData.error?.message || 'Unknown error'}`);
        return;
      }

      let updatedPlace: DetailedPlace = { ...currentPlace };

      // fetch travel times
      if (placeDetailsData.location) {
        updatedPlace.location = {
          latitude: placeDetailsData.location.latitude,
          longitude: placeDetailsData.location.longitude,
        };
        if (!userLocation || !updatedPlace?.id) {
          updatedPlace.travelTimes = {
            walking: null,
            publicTransit: null
          }
        } else {
          const origins = `${userLocation.latitude},${userLocation.longitude}`;
          const destinations = `place_id:${updatedPlace.id}`;
          const [walkingTime, publicTransitTime] = await Promise.all([
            fetchTravelTime('walking', origins, destinations),
            fetchTravelTime('transit', origins, destinations),
          ]);

          updatedPlace.travelTimes = {
            walking: walkingTime?.includes('hour') ? null : (walkingTime || null),
            publicTransit: publicTransitTime === walkingTime ? null : (publicTransitTime || null),
          };
        }
      }

      if (placeDetailsData.formattedAddress) {
        updatedPlace.formattedAddress = placeDetailsData.formattedAddress;
      }

      if (placeDetailsData.websiteUri) {
        updatedPlace.websiteUri = placeDetailsData.websiteUri;
      }

      // Fetch photo details if available
      if (placeDetailsData.photos && placeDetailsData.photos.length > 0) {
        const featuredPhoto = placeDetailsData.photos[0];
        const photoName = featuredPhoto.name;
        const photoContentUrl = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&maxWidthPx=400&key=${GOOGLE_MAPS_API_KEY}`;
        const photoContentResponse = await fetch(photoContentUrl);

        if (!photoContentResponse.ok) {
          console.warn(`Failed to fetch photo content for ${currentPlace.displayName?.text}: ${photoContentResponse.statusText}`);
          updatedPlace.photoUrl = null;
        } else {
          updatedPlace.photoUrl = photoContentResponse.url;

          if (featuredPhoto.authorAttributions && featuredPhoto.authorAttributions.length > 0) {
            updatedPlace.photoAttributions = featuredPhoto.authorAttributions.map((attr: any) => attr.displayName);
          } else {
            updatedPlace.photoAttributions = [];
          }
        }
      } else {
        updatedPlace.photoUrl = null;
        updatedPlace.photoAttributions = [];
      }

      setDetailedPlace(updatedPlace);
      storeObjData(updatedPlace.id, updatedPlace);

    } catch (error: any) {
      setDetailError(`Error fetching place details: ${error.message}`);
      setDetailedPlace(null);
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    if (place?.id) { 
      fetchDetails(place);
    } else {
      setIsDetailLoading(false); // If no place or ID, stop loading and clear states
      setDetailError('No place ID provided.');
      setDetailedPlace(null);
    }
  }, [place?.id, fetchDetails]);

  return { detailedPlace, isDetailLoading, detailError };
};

export default usePlaceDetails;