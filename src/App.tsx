import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text } from 'react-native'
import Swiper from 'react-native-swiper'
import { WeatherScreen, WeatherScreenProps } from './components/WeatherScreen'
import { NativeModules } from 'react-native'
import { useState, useRef, useEffect } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
const { StatusBarManager } = NativeModules

import uuid from 'react-native-uuid'

import mockCurrent from './mocked/CurrentWeatherResponse.json'
import mockForecast from './mocked/ForecastWeatherResponse.json'
import { CurrentWeatherResponse } from './types.ts/CurrentWeatherResponse'
import { ForecastWeatherResponse } from './types.ts/ForecastWeatherResponse'

import { AddPlaceMap } from './components/AddPlaceMap'
import { Coordinates } from './APIs/Location'
import { getCurrentWeather, getForecastWeather } from './APIs/OpenWeatherMap'

// ---------------------------------------------------------------------------------------------------------------------
// Our main application
// ---------------------------------------------------------------------------------------------------------------------
export default function App() {
  const [placesData, setPlacesData] = useState<WeatherScreenProps[]>([
    {
      id: '1',
      location: { lat: -25.8029342, lon: 28.300706 },
      currentWeather: mockCurrent as CurrentWeatherResponse,
      forecastWeather: mockForecast as ForecastWeatherResponse,
      lastUpdated: new Date().getTime()
    }
  ])

  // -------------------------------------------------------------------------------------------------------------------
  // Places dialog
  // -------------------------------------------------------------------------------------------------------------------

  const [placesDialogOpen, setPlacesDialogOpen] = useState(false)
  const openPlacesDialog = () => setPlacesDialogOpen(true)
  const closePlacesDialog = () => setPlacesDialogOpen(false)
  const [swiperIdx, setSwiperIdx] = useState(0)

  const addNewPlace = async (location: Coordinates) => {
    const currentWeather = await getCurrentWeather(location)
    if (currentWeather) {
      const forecastWeather = await getForecastWeather(location)
      if (forecastWeather) {
        setPlacesData([
          ...placesData,
          {
            id: String(uuid.v4()),
            location,
            currentWeather,
            forecastWeather,
            lastUpdated: new Date().getTime()
          }
        ])
        setSwiperIdx(placesData.length)
        return true
      }
    }
    return false
  }

  const removePlace = (index: number) => {
    // We are preventing this in UI, but check we don't try delete place at our current location
    if (index === 0) {
      return
    }
    const newPlacesData = [...placesData]
    newPlacesData.splice(index, 1)
    setPlacesData(newPlacesData)
    setSwiperIdx(swiperIdx - 1)
  }

  // -------------------------------------------------------------------------------------------------------------------
  // Main render
  // -------------------------------------------------------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="black" style="light" />
      <View style={styles.topPadding} />
      <Swiper
        index={swiperIdx}
        key={placesData.length}
        removeClippedSubviews={false}
        paginationStyle={{
          position: 'absolute',
          top: 36,
          left: 10,
          right: undefined,
          bottom: undefined
        }}
        loop={false}
      >
        {placesData.map((data, index) => (
          <WeatherScreen
            key={JSON.stringify(data.id)}
            {...data}
            onDelete={index > 0 ? () => removePlace(index) : undefined}
          />
        ))}
      </Swiper>

      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 32,
          bottom: 32,
          backgroundColor: 'royalblue',
          borderRadius: 28,
          width: 56,
          height: 56,
          elevation: 1,
          zIndex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onPress={openPlacesDialog}
      >
        <Ionicons name="add" color="white" size={48} />
      </TouchableOpacity>

      <AddPlaceMap
        visible={placesDialogOpen}
        onClose={closePlacesDialog}
        markers={placesData.map((pd) => ({ title: pd.currentWeather.name, location: pd.location }))}
        onAdd={addNewPlace}
      />
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
