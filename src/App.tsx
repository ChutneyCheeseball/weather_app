import { StatusBar } from 'expo-status-bar'
import { SafeAreaView, StyleSheet, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native'
import Swiper from 'react-native-swiper'
import { WeatherScreen, WeatherScreenProps } from './components/WeatherScreen'
import { NativeModules } from 'react-native'
import { useState, useRef, useEffect } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons'
const { StatusBarManager } = NativeModules

import uuid from 'react-native-uuid'

import { AddPlaceMap } from './components/AddPlaceMap'
import { Coordinates, getDeviceLocation } from './APIs/Location'
import { getCurrentWeather, getForecastWeather } from './APIs/OpenWeatherMap'
import AsyncStorage from '@react-native-async-storage/async-storage'

// ---------------------------------------------------------------------------------------------------------------------
// Our main application
// ---------------------------------------------------------------------------------------------------------------------
export default function App() {
  const [placesData, setPlacesData] = useState<Omit<WeatherScreenProps, 'onRefresh'>[]>([])

  // -------------------------------------------------------------------------------------------------------------------
  // Loading, saving, adding, updating and deleting places
  // -------------------------------------------------------------------------------------------------------------------

  const [placesDialogOpen, setPlacesDialogOpen] = useState(false)
  const openPlacesDialog = () => setPlacesDialogOpen(true)
  const closePlacesDialog = () => setPlacesDialogOpen(false)
  const [swiperIdx, setSwiperIdx] = useState(0) // useRef to control Swiper didn't work well, so we control the index
  const [showManual, setShowManual] = useState(false) // Show button to manually create first place

  useEffect(() => {
    loadPlaces()
  }, [])

  const loadPlaces = async () => {
    try {
      console.log('Loading saved...')
      // Get our saved places data
      const loaded = await AsyncStorage.getItem('placesData')
      if (loaded) {
        setPlacesData(JSON.parse(loaded))
        console.log('OK')
      } else {
        console.log('Nothing in storage')
        // Try to create first place from device location
        const success = await refreshPlace(0)
        if (!success) {
          setShowManual(true) // Show button to manually create first place
        }
      }
    } catch (error) {
      console.error(error)
      setShowManual(true)
    }
  }

  const savePlaces = async (newPlacesData: Omit<WeatherScreenProps, 'onRefresh'>[]) => {
    try {
      console.log('Saving...')
      await AsyncStorage.setItem('placesData', JSON.stringify(newPlacesData))
      console.log('OK')
    } catch (error) {
      console.error(error)
    }
  }

  const addNewPlace = async (location: Coordinates) => {
    const currentWeather = await getCurrentWeather(location)
    if (currentWeather) {
      const forecastWeather = await getForecastWeather(location)
      if (forecastWeather) {
        const newPlacesData = [
          ...placesData,
          {
            id: String(uuid.v4()),
            location,
            currentWeather,
            forecastWeather,
            lastUpdated: new Date().getTime()
          }
        ]
        setPlacesData(newPlacesData)
        savePlaces(newPlacesData)
        setSwiperIdx(placesData.length)
        return true
      }
    }
    return false
  }

  const refreshPlace = async (index: number) => {
    const currentPlace = placesData[index]
    // The first screen shows our device location, so refreshing it requires a location update
    let location = (index === 0 ? await getDeviceLocation() : null) || currentPlace.location
    const currentWeather = await getCurrentWeather(location)
    if (currentWeather) {
      const forecastWeather = await getForecastWeather(location)
      if (forecastWeather) {
        const newPlacesData = [...placesData]
        newPlacesData[index] = {
          id: currentPlace ? currentPlace.id : String(uuid.v4()),
          currentWeather,
          forecastWeather,
          lastUpdated: new Date().getTime(),
          location
        }
        setPlacesData(newPlacesData)
        savePlaces(newPlacesData)
        return true
      }
    }
    return false
  }

  const removePlace = (index: number) => {
    // We are preventing this in UI, but check we don't try delete place at our device location
    if (index === 0) {
      return
    }
    const newPlacesData = [...placesData]
    newPlacesData.splice(index, 1)
    setPlacesData(newPlacesData)
    savePlaces(newPlacesData)
    setSwiperIdx(index - 1)
  }

  // -------------------------------------------------------------------------------------------------------------------
  // Rendering when we have no places to show
  // -------------------------------------------------------------------------------------------------------------------

  // Error occurred during loading from storage, or problem automatically creating first location
  if (showManual) {
    return (
      <View style={{ ...styles.container, padding: 12 }}>
        <Text style={{ fontSize: 16, marginBottom: 12 }}>Could not create home location.</Text>
        <Text style={{ marginBottom: 24 }}>Verify that you have granted the app location permissions.</Text>
        <TouchableOpacity
          style={{ padding: 24, backgroundColor: 'royalblue', borderRadius: 12 }}
          onPress={() => {
            setShowManual(false)
            refreshPlace(0).then((success) => {
              if (!success) {
                setShowManual(true)
              }
            })
          }}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // First run (or storage wipe)
  // useEffect will automatically try to create a first place from device location
  if (placesData.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="royalblue" size={64} />
      </View>
    )
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
            onRefresh={() => refreshPlace(index)}
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

      <TouchableOpacity
        style={{
          position: 'absolute',
          left: 32,
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
        onPress={() => {
          AsyncStorage.removeItem('placesData').then(() => {
            console.log('Cleared storage')
          })
        }}
      >
        <Ionicons name="trash" color="white" size={48} />
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
