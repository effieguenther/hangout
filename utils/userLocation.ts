import * as Location from 'expo-location';

export async function getUserLocation() {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return { location: null, errorMsg: 'Permission to access location was denied' }
  }
  const location = await Location.getCurrentPositionAsync({});
  if (location.coords.longitude && location.coords.latitude) {
    return {
      location: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      },
      errorMsg: null
    }
  }
  return { location: null, errorMsg: 'Could not get location' }
}