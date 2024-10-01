import { View, Text, ActivityIndicator, Image, ImageBackground, ScrollView, RefreshControl } from 'react-native'
import { Coordinates } from '../APIs/Location'
import { useEffect, useState } from 'react'
import { getCurrentWeather, getForecastWeather } from '../APIs/OpenWeatherMap'
import { ForecastWeatherResponse } from '../types.ts/ForecastWeatherResponse'
import { determineWeatherType } from '../utils'

const sunnyImg = require('../../assets/images/forest_sunny.png')
const cloudyImg = require('../../assets/images/forest_cloudy.png')
const rainyImg = require('../../assets/images/forest_rainy.png')

interface WeatherStyle {
  img: any
  color: string
}

type WeatherType = 'sunny' | 'cloudy' | 'rainy'

interface Weather {
  type: WeatherType
  min: number
  max: number
  current: number
  city: string
}

const getWeatherStyle = (type: WeatherType): WeatherStyle | null => {
  switch (type) {
    case 'sunny':
      return { img: sunnyImg, color: '#47AB2F' }
    case 'cloudy':
      return { img: cloudyImg, color: '#54717A' }
    case 'rainy':
      return { img: rainyImg, color: '#57575D' }
  }
  return null
}

export const WeatherScreen = (props: { location: Coordinates | null }) => {
  const [busy, setBusy] = useState(false)
  const [weatherStyle, setWeatherStyle] = useState<WeatherStyle | null>(null)
  const [weather, setWeather] = useState<Weather | null>(null)
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
    const currentWeather = await getCurrentWeather(location)
    // Only get forecast weather if current weather was fetched OK
    if (currentWeather) {
      const weatherType = determineWeatherType(currentWeather.weather[0].id)
      const weather: Weather = {
        min: currentWeather.main.temp_min,
        max: currentWeather.main.temp_max,
        current: currentWeather.main.temp,
        type: weatherType,
        city: currentWeather.name
      }
      setWeather(weather)
      const weatherStyle = getWeatherStyle(weatherType)
      setWeatherStyle(weatherStyle)
      const forecastWeather = await getForecastWeather(location, true)
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
      <View style={{ backgroundColor: weatherStyle?.color, flex: 1 }}>
        <ImageBackground
          source={weatherStyle?.img}
          style={{
            width: '100%',
            height: 'auto',
            aspectRatio: 360 / 320,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              position: 'absolute',
              left: 12,
              top: 6,
              textShadowColor: 'rgba(0,0,0,0.5)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 1,
              fontWeight: '500'
            }}
          >
            {weather!.city.toUpperCase()}
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: 48,
              fontWeight: '500',
              textShadowColor: 'rgba(0,0,0,0.5)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 1
            }}
          >
            {Math.round(weather!.current)}°C
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: 36,
              marginTop: -16,
              textShadowColor: 'rgba(0,0,0,0.5)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 1
            }}
          >
            {weather!.type.toUpperCase()}
          </Text>
        </ImageBackground>
        <View style={{ flex: 1, marginTop: -2, backgroundColor: weatherStyle?.color, paddingTop: 2 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 }}>
            {renderCell(weather!.min, 'Min')}
            {renderCell(weather!.current, 'Current')}
            {renderCell(weather!.max, 'Max')}
          </View>
          <View style={{ marginTop: 6, height: 1, width: '100%', backgroundColor: 'rgba(255,255,255,0.8)' }}></View>
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
      {location && weather ? renderScreenContents() : <ActivityIndicator color="white" />}
    </ScrollView>
  )
}
