import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { Coordinates, getDeviceLocation } from './APIs/Location'
import Swiper from 'react-native-swiper'
import { WeatherScreen } from './components/WeatherScreen'

export default function App() {
  // -------------------------------------------------------------------------------------------------------------------
  // Hooks
  // -------------------------------------------------------------------------------------------------------------------

  const [location, setLocation] = useState<Coordinates | null>(null)

  const awaitLocation = async () => {
    const location = await getDeviceLocation()
    if (location === null) {
      // We should probably show an error here
    }
    setLocation(location)
  }

  useEffect(() => {
    awaitLocation()
  }, [])

  // -------------------------------------------------------------------------------------------------------------------
  // Main render
  // -------------------------------------------------------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="black" style="light" />
      <View style={styles.topPadding} />
      <Swiper
        removeClippedSubviews={false}
        paginationStyle={{ position: 'absolute', top: 20, bottom: undefined }}
        loop={false}
      >
        <WeatherScreen location={location} />
        <Text>End of the line</Text>
      </Swiper>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  topPadding: {
    height: 20
  },
  flex: {
    flex: 1
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  slide1: {
    flex: 1,
    backgroundColor: '#9DD6EB'
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5'
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9'
  },
  wrapper: {}
})
