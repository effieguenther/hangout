import usePlaceDetails from '@/hooks/usePlaceDetails';
import Place from '@/types/Place';
import { Image, Linking, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Icon, Surface, Text, useTheme } from 'react-native-paper';

interface ResultCardProps {
  place: Place;
}

const ResultCard: React.FC<ResultCardProps> = ({ place }) => {
  const theme = useTheme();
  const {detailedPlace, isDetailLoading, detailError} = usePlaceDetails(place);

  const priceLevelMap: Record<string, string | null> = {
    'PRICE_LEVEL_FREE': 'FREE',
    'PRICE_LEVEL_INEXPENSIVE': '$',
    'PRICE_LEVEL_MODERATE': '$$',
    'PRICE_LEVEL_EXPENSIVE': '$$$',
    'PRICE_LEVEL_VERY_EXPENSIVE': '$$$$',
  };

  const priceLevel = place.priceLevel ? priceLevelMap[place.priceLevel] : null;

  const openPlaceInGoogleMaps = () => {
    if (place.id && place.displayName?.text) {
      const encodedPlaceName = encodeURIComponent(place.displayName.text);
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedPlaceName}&query_place_id=${place.id}`;

      Linking.canOpenURL(googleMapsUrl).then(supported => {
        if (supported) {
          Linking.openURL(googleMapsUrl);
        } else {
          console.error("Don't know how to open Google Maps URL: " + googleMapsUrl);
        }
      }).catch(err => console.error('An error occurred', err));
    } else {
      console.warn('Cannot open in Google Maps: Place ID or display name missing');
    }
  };

  if (isDetailLoading) {
    return (
      <Surface style={styles.card}>
        <View style={{height: '100%', justifyContent: 'center'}}>
          <ActivityIndicator animating={true} size='large' />
        </View>
      </Surface>
    )
  } else if (detailError) {
    return (
      <Surface style={styles.card}>
        <Text>{detailError}</Text>
      </Surface>
    )
  } else if (detailedPlace) {
    return (
      <Surface style={styles.card}>
        <View style={styles.titleContainer}>
          <View style={{flex: 1}}>
            <Text 
              variant='titleLarge' 
              style={{flexWrap: 'wrap', fontWeight: 600}}>
              {detailedPlace.displayName.text}
            </Text>
          </View>
          {
            detailedPlace.travelTimes?.walking && (
              <Text style={styles.travelIndicator}>
                <Icon source="walk" size={20} color={theme.colors.primary} />
                {detailedPlace.travelTimes?.walking}
              </Text>
            )
          }
          {
            detailedPlace.travelTimes?.publicTransit && (
              <Text style={styles.travelIndicator}>
                <Icon source="train" size={20} color={theme.colors.primary} />
                {detailedPlace.travelTimes?.publicTransit}
              </Text>
            )
          }
        </View>
        {
          detailedPlace.photoUrl ? (
            <>
              <Text>
                {detailedPlace.formattedAddress}
              </Text>
              <Text>
                {detailedPlace.editorialSummary?.text}
              </Text>
              {
                priceLevel && (
                  <Text>
                    {priceLevel}
                  </Text>
                )
              }
              <View style={{flex: 1}}>
                <Image source={{ uri: detailedPlace.photoUrl }} style={styles.placeImage} resizeMode="cover" />
                {detailedPlace.photoAttributions && detailedPlace.photoAttributions.length > 0 && (
                  <View>
                    <Text variant='labelSmall'>
                      Photo by: {detailedPlace.photoAttributions.join(', ')}
                    </Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <Text>No featured photo available.</Text>
          )
        }
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          {
            detailedPlace.websiteUri && (
              <Button 
                mode='outlined' 
                style={{marginRight: 20, minWidth: 150 }} 
                onPress={() => {
                  Linking.openURL(detailedPlace.websiteUri!)
              }}>
                WEBSITE
              </Button>
            )
          }
          <Button 
            mode='outlined' 
            onPress={openPlaceInGoogleMaps}
            style={{minWidth: 150}}
          >
            MAP
          </Button>
        </View>
      </Surface>
    );
  }
};

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    padding: 20,
    width: '100%',
    rowGap: 20,
    height: '100%',
    borderRadius: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  placeImage: {
    width: '100%',
    flex: 1,
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