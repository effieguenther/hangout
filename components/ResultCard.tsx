import { Place } from '@/types/place';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Icon, Surface, Text } from 'react-native-paper';

interface ResultCardProps {
  place: Place;
}

interface TravelTimeResult {
  publicTransit?: string;
  walking?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ place }) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoAttributions, setPhotoAttributions] = useState<string[]>([]);
  const [isDetailLoading, setIsDetailLoading] = useState(true);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [travelTimes, setTravelTimes] = useState<TravelTimeResult | null>(null);
  const [isTravelTimeLoading, setIsTravelTimeLoading] = useState(true);
  const [travelTimeError, setTravelTimeError] = useState<string | null>(null);

  const userLocation = {latitude: 40.726113, longitude: -73.952996};
  const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  const fetchDetails = async () => {
    try {
      const placeDetailsUrl = `https://places.googleapis.com/v1/places/${place.id}?fields=photos,location,formattedAddress&key=${GOOGLE_MAPS_API_KEY}`;
      const placeDetailsResponse = await fetch(placeDetailsUrl);
      const placeDetailsData = await placeDetailsResponse.json();

      if (!placeDetailsResponse.ok) {
        setDetailError(`Failed to fetch place details: ${placeDetailsData.error?.message || 'Unknown error'}`);
        setIsDetailLoading(false);
        return;
      }

      if (placeDetailsData.location) {
        place.location = {
          latitude: placeDetailsData.location.latitude,
          longitude: placeDetailsData.location.longitude,
        };
      }

      if (placeDetailsData.formattedAddress) {
        place.formattedAddress = placeDetailsData.formattedAddress;
      }

      if (placeDetailsData.photos && placeDetailsData.photos.length > 0) {
        const featuredPhoto = placeDetailsData.photos[0];
        const photoName = featuredPhoto.name;
        const photoContentUrl = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&maxWidthPx=400&key=${GOOGLE_MAPS_API_KEY}`;
        const photoContentResponse = await fetch(photoContentUrl);

        if (!photoContentResponse.ok) {
          setDetailError(`Failed to fetch photo content: ${photoContentResponse.statusText}`);
          setIsDetailLoading(false);
          return;
        }

        setPhotoUrl(photoContentResponse.url);
        
        if (featuredPhoto.authorAttributions && featuredPhoto.authorAttributions.length > 0) {
          const attributions = featuredPhoto.authorAttributions.map((attr: any) => attr.displayName);
          setPhotoAttributions(attributions);
        }

      } else {
        setDetailError('No photos found for this place.');
      }
    } catch (error: any) {
      setDetailError(`Error fetching photo: ${error.message}`);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const fetchTravelTime = async () => {
    if (!userLocation || !place?.location || !place?.id) {
      setTravelTimeError('User location or place location/ID is missing.');
      setIsTravelTimeLoading(false);
      return;
    }

    const origins = `${userLocation.latitude},${userLocation.longitude}`;
    const destinations = `place_id:${place.id}`; // Always use place_id for destinations when possible

    const fetchModeTravelTime = async (mode: 'driving' | 'walking' | 'transit'): Promise<string | null> => {
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

    try {
      const [walkingTime, publicTransitTime] = await Promise.all([
        fetchModeTravelTime('walking'),
        fetchModeTravelTime('transit'),
      ]);

      setTravelTimes({
        walking: walkingTime || undefined,
        publicTransit: publicTransitTime || undefined,
      });

      if (!walkingTime && !publicTransitTime) {
        setTravelTimeError('Could not retrieve travel times for walking or public transit.');
      }

    } catch (error: any) {
      setTravelTimeError(`An error occurred while fetching travel times: ${error.message}`);
    } finally {
      setIsTravelTimeLoading(false);
    }
  };

  useEffect(() => {
    if (place.id) {
      fetchDetails();
      fetchTravelTime();
    }
  }, []);


  return (
    <Surface style={styles.card}>
      <View style={styles.titleContainer}>
        <Text variant='headlineSmall'>
          {place.displayName.text}
        </Text>
        <Text style={styles.travelIndicator}>
          <Icon source="walk" size={20} />
          {travelTimes?.walking}
        </Text>
        <Text style={styles.travelIndicator}>
          <Icon source="train" size={20} />
          {travelTimes?.publicTransit}
        </Text>
      </View>
      {isDetailLoading ? (
          <ActivityIndicator animating={true} />
        ) : detailError ? (
          <Text>{detailError}</Text>
        ) : photoUrl ? (
          <>
            <Text>
              {place.formattedAddress}
            </Text>
            <Text>
              {place.editorialSummary?.text}
            </Text>
            <Image source={{ uri: photoUrl }} style={styles.placeImage} resizeMode="cover" />
            {photoAttributions.length > 0 && (
              <View>
                <Text variant='labelSmall'>
                  Photo by: {photoAttributions.join(', ')}
                </Text>
              </View>
            )}
          </>
        ) : (
          <Text>No featured photo available.</Text>
        )
      }
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    width: '100%',
    rowGap: 20
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  placeImage: {
    width: '100%', // Added width
    height: 300,    // Added height
    borderRadius: 8,
    marginBottom: 8,
  },
  travelIndicator: {
    fontSize: 14,
    marginTop: 5,
    marginLeft: 8
  }
});

export default ResultCard;