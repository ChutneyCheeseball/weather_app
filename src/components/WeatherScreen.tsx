import { View, Text, ActivityIndicator } from 'react-native'
import { Coordinates } from '../APIs/Location'
import { useEffect, useState } from 'react'
import { getCurrentWeather, getForecastWeather } from '../APIs/OpenWeatherMap'
import { ForecastWeatherResponse } from '../types.ts/ForecastWeatherResponse'
import { determineWeatherType } from '../utils'

export const WeatherScreen = (props: { location: Coordinates | null }) => {
  const [busy, setBusy] = useState(false)
  const [weatherType, setWeatherType] = useState<'sunny' | 'cloudy' | 'rainy' | null>(null)
  const [forecastWeather, setForecastWeather] = useState<ForecastWeatherResponse | null>(null)

  const { location } = props

  const getWeather = async () => {
    if (!location) {
      return
    }
    setBusy(true)
    const currentWeather = await getCurrentWeather(location, true)
    // Only get forecast weather if current weather was fetched OK
    if (currentWeather) {
      setWeatherType(determineWeatherType(currentWeather.weather[0].id))
      const forecastWeather = await getForecastWeather(location, true)
      setForecastWeather(forecastWeather)
    }
    setBusy(false)
  }

  useEffect(() => {
    getWeather()
  }, [location])

  const renderScreenContents = () => {
    return <Text>{weatherType}</Text>
  }

  if (busy) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="royalblue" />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' }}>
      {location ? renderScreenContents() : <ActivityIndicator color="white" />}
    </View>
  )
}
