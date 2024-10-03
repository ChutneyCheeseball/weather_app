import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import Swiper from 'react-native-swiper'
import { WeatherScreen } from './components/WeatherScreen'
import { NativeModules } from 'react-native'
const { StatusBarManager } = NativeModules

export default function App() {
  const screenData = [
    {
      location: { lat: -25.8029342, lon: 28.300706 }
    },
    {
      location: { lat: 37.4219983, lon: -122.084 }
    },
    { location: { lat: -44.017, lon: -176.5105 } }
  ]

  // -------------------------------------------------------------------------------------------------------------------
  // Main render
  // -------------------------------------------------------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="black" style="light" />
      <View style={styles.topPadding} />
      <Swiper
        removeClippedSubviews={false}
        paginationStyle={{
          position: 'absolute',
          top: 30,
          left: 10,
          right: undefined,
          bottom: undefined
        }}
        loop={false}
      >
        {screenData.map((sd, idx) => (
          <WeatherScreen key={idx} location={sd.location} />
        ))}
      </Swiper>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  topPadding: {
    height: StatusBarManager.HEIGHT
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
  }
})
