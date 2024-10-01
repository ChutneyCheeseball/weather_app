import * as Location from 'expo-location'

export interface Coordinates {
  lat: number
  lon: number
}

// ---------------------------------------------------------------------------------------------------------------------
// Get current device location, provided the user has given us permission
// ---------------------------------------------------------------------------------------------------------------------

export const getDeviceLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync()
  if (status !== 'granted') {
    console.log('No location permission')
    return null
  }
  const location = await Location.getCurrentPositionAsync()
  const coords: Coordinates = { lat: location.coords.latitude, lon: location.coords.longitude }
  console.log('Got location as', coords)
  return coords
}
