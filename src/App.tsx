import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import Swiper from 'react-native-swiper'
import { WeatherScreen } from './components/WeatherScreen'
import { NativeModules } from 'react-native'
import MapView, { MapMarker, Marker } from 'react-native-maps'
const { StatusBarManager } = NativeModules

export default function App() {
  // -------------------------------------------------------------------------------------------------------------------
  // Hooks
  // -------------------------------------------------------------------------------------------------------------------

  const screenData = [
    {
      location: { lat: -25.8029342, lon: 28.300706 },
      weather: null,
      forecast: null,
      lastUpdated: null
    },
    {
      location: { lat: 37.4219983, lon: -122.084 },
      weather: null,
      forecast: null,
      lastUpdated: null
    }
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
        <WeatherScreen location={screenData[0].location} />
        <WeatherScreen location={screenData[1].location} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ flex: 1, height: 'auto', width: '100%', padding: 16 }}>
            <MapView
              style={{ flex: 1, width: '100%', height: '100%' }}
              onPoiClick={(event) => {
                console.log(JSON.stringify(event.nativeEvent))
              }}
              onPress={(event) => {
                const { latitude, longitude } = event.nativeEvent.coordinate
                console.log(latitude.toFixed(4), longitude.toFixed(4))
              }}
            >
              {screenData.map((sd, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: sd.location.lat,
                    longitude: sd.location.lon
                  }}
                ></Marker>
              ))}
            </MapView>
          </View>

          <View style={{ flex: 1 }}></View>
        </View>
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
