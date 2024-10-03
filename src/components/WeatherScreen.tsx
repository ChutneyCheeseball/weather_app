import { View, Text, ActivityIndicator, Image, ImageBackground, ScrollView, RefreshControl } from 'react-native'
import { Coordinates } from '../APIs/Location'
import { useEffect, useState } from 'react'
import { getCurrentWeather, getForecastWeather } from '../APIs/OpenWeatherMap'
import { ForecastWeatherResponse } from '../types.ts/ForecastWeatherResponse'
import { determineWeatherType, groupReadingsByDate } from '../utils'
import { OneDayForecast } from './OneDayForecast'
import { images } from '../assets'
import { WeatherHeader } from './WeatherHeader'
import { CurrentWeather, WeatherStyle, WeatherType } from '../types.ts/weather'
import { WeekForecast } from './WeekForecast'
import MapView, { MapMarker, Region } from 'react-native-maps'

const getWeatherStyle = (type: WeatherType): WeatherStyle => {
  switch (type) {
    case 'sunny':
      return { img: images.sunny, color: '#47AB2F' }
    case 'cloudy':
      return { img: images.cloudy, color: '#54717A' }
    case 'rainy':
      return { img: images.rainy, color: '#57575D' }
  }
}

export const WeatherScreen = (props: { location: Coordinates | null }) => {
  const [busy, setBusy] = useState(false)
  const [weatherStyle, setWeatherStyle] = useState<WeatherStyle | null>(null)
  const [weather, setWeather] = useState<CurrentWeather | null>(null)
  const [forecastWeather, setForecastWeather] = useState<ForecastWeatherResponse | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await getWeather()
    setRefreshing(false)
  }

  const { location } = props

  const getWeather = async () => {
    if (!location) {
      return
    }
    setBusy(true)
    const MOCK_RESPONSE = true // For testing
    const currentWeather = await getCurrentWeather(location, MOCK_RESPONSE)
    // Only get forecast weather if current weather was fetched OK
    if (currentWeather) {
      const weatherType = determineWeatherType(currentWeather.weather[0].id)
      const weatherStyle = getWeatherStyle(weatherType)
      setWeatherStyle(weatherStyle)

      const current: CurrentWeather = {
        min: currentWeather.main.temp_min,
        max: currentWeather.main.temp_max,
        current: currentWeather.main.temp,
        type: weatherType,
        city: currentWeather.name,
        country: currentWeather.sys.country
      }
      setWeather(current)

      const forecastWeather = await getForecastWeather(location, MOCK_RESPONSE)
      setForecastWeather(forecastWeather)
    }
    setBusy(false)
  }

  useEffect(() => {
    getWeather()
  }, [location])

  const renderScreenContents = () => {
    const renderCell = (temp: number, desc: string) => {
      return (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>{Math.round(temp)}°C</Text>
          <Text style={{ color: 'white' }}>{desc}</Text>
        </View>
      )
    }

    return (
      <View style={{ backgroundColor: weatherStyle!.color, flex: 1 }}>
        <WeatherHeader weatherStyle={weatherStyle!} weather={weather!} />
        <View style={{ flex: 1, marginTop: -2, backgroundColor: weatherStyle!.color, paddingTop: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 }}>
            {renderCell(weather!.min, 'Min')}
            {renderCell(weather!.current, 'Current')}
            {renderCell(weather!.max, 'Max')}
          </View>
          {forecastWeather && <OneDayForecast forecast={forecastWeather} />}
          {forecastWeather && <WeekForecast forecast={forecastWeather} />}
          <View style={{ margin: 12, borderRadius: 12, backgroundColor: 'white', overflow: 'hidden' }}>
            <MapView
              style={{ width: '100%', height: 200 }}
              region={
                {
                  latitude: location?.lat,
                  longitude: location?.lon,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01
                } as Region
              }
            >
              <MapMarker coordinate={{ latitude: location!.lat, longitude: location!.lon }} />
            </MapView>
          </View>
        </View>
      </View>
    )
  }

  if (busy) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="royalblue" />
      </View>
    )
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F0F0F0' }}
      contentContainerStyle={{ alignItems: 'center' }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['royalblue']}
          tintColor="royalblue"
          progressBackgroundColor="white"
        />
      }
    >
      {location && weather && weatherStyle ? renderScreenContents() : <ActivityIndicator color="white" />}
    </ScrollView>
  )
}
