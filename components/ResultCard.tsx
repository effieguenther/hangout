import { Place } from '@/types/place';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Surface, Text } from 'react-native-paper';

interface ResultCardProps {
  place: Place;
}

const ResultCard: React.FC<ResultCardProps> = ({ place }) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoAttributions, setPhotoAttributions] = useState<string[]>([]);
  const [isPhotoLoading, setIsPhotoLoading] = useState(true);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const [travelTime, setTravelTime] = useState<string | null>(null);
  const [isTravelTimeLoading, setIsTravelTimeLoading] = useState(true);
  const [travelTimeError, setTravelTimeError] = useState<string | null>(null);

  const userLocation = {latitude: 40.726113, longitude: -73.952996};
  const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  const fetchPhoto = async () => {
    try {
      const placeDetailsUrl = `https://places.googleapis.com/v1/places/${place.id}?fields=photos&key=${GOOGLE_MAPS_API_KEY}`;
      const placeDetailsResponse = await fetch(placeDetailsUrl);
      const placeDetailsData = await placeDetailsResponse.json();

      if (!placeDetailsResponse.ok) {
        setPhotoError(`Failed to fetch place details: ${placeDetailsData.error?.message || 'Unknown error'}`);
        setIsPhotoLoading(false);
        return;
      }

      if (placeDetailsData.photos && placeDetailsData.photos.length > 0) {
        const featuredPhoto = placeDetailsData.photos[0];
        const photoName = featuredPhoto.name;
        const photoContentUrl = `https://places.googleapis.com/v1/${photoName}/media?maxHeightPx=400&maxWidthPx=400&key=${GOOGLE_MAPS_API_KEY}`;
        const photoContentResponse = await fetch(photoContentUrl);

        if (!photoContentResponse.ok) {
          setPhotoError(`Failed to fetch photo content: ${photoContentResponse.statusText}`);
          setIsPhotoLoading(false);
          return;
        }

        setPhotoUrl(photoContentResponse.url);
        
        if (featuredPhoto.authorAttributions && featuredPhoto.authorAttributions.length > 0) {
          const attributions = featuredPhoto.authorAttributions.map((attr: any) => attr.displayName);
          setPhotoAttributions(attributions);
        }

      } else {
        setPhotoError('No photos found for this place.');
      }
    } catch (error: any) {
      setPhotoError(`Error fetching photo: ${error.message}`);
    } finally {
      setIsPhotoLoading(false);
    }
  };

  const fetchTravelTime = async () => {
    try {
      if (!userLocation || !place.location) {
        setTravelTimeError('User location or place location is missing.');
        setIsTravelTimeLoading(false);
        return;
      }

      const origins = `${userLocation.latitude},${userLocation.longitude}`;
      const destinations = `place_id:${place.id}`; // Using place_id is recommended
      // Or using lat/lng: const destinations = `${place.location.latitude},${place.location.longitude}`;

      const distanceMatrixUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&mode=driving&departure_time=now&key=${GOOGLE_MAPS_API_KEY}`;
      const distanceMatrixResponse = await fetch(distanceMatrixUrl);
      const distanceMatrixData = await distanceMatrixResponse.json();

      if (!distanceMatrixResponse.ok || distanceMatrixData.status !== 'OK') {
        setTravelTimeError(`Failed to fetch travel time: ${distanceMatrixData.error_message || distanceMatrixData.status}`);
        setIsTravelTimeLoading(false);
        return;
      }

      if (distanceMatrixData.rows && distanceMatrixData.rows.length > 0 &&
          distanceMatrixData.rows[0].elements && distanceMatrixData.rows[0].elements.length > 0) {
        const element = distanceMatrixData.rows[0].elements[0];
        if (element.status === 'OK' && element.duration) {
          setTravelTime(element.duration.text);
        } else {
          setTravelTimeError(`Travel time not available: ${element.status}`);
        }
      } else {
        setTravelTimeError('No travel time data found.');
      }

    } catch (error: any) {
      setTravelTimeError(`Error fetching travel time: ${error.message}`);
    } finally {
      setIsTravelTimeLoading(false);
    }
  };

  useEffect(() => {
    if (place.id) {
      fetchPhoto();
      // fetchTravelTime();
    }
  }, []);


  return (
    <Surface style={styles.card}>
      <View style={styles.titleContainer}>
        <Text variant='headlineSmall'>
          {place.displayName.text}
        </Text>
      </View>
      <Text>
        {place.editorialSummary?.text}
      </Text>
      <View>
        {isPhotoLoading ? (
          <ActivityIndicator animating={true} />
        ) : photoError ? (
          <Text>{photoError}</Text>
        ) : photoUrl ? (
          <>
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
        )}
      </View>
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
    flexDirection: 'row'
  },
  placeImage: {
    width: '100%', // Added width
    height: 300,    // Added height
    borderRadius: 8,
    marginBottom: 8,
  },
});

export default ResultCard;