import { View, Text, ScrollView, RefreshControl } from 'react-native'
import { Coordinates } from '../APIs/Location'
import { memo, useState } from 'react'
import { ForecastWeatherResponse } from '../types.ts/ForecastWeatherResponse'
import { determineWeatherType, groupReadingsByDate } from '../utils'
import { OneDayForecast } from './OneDayForecast'
import { images } from '../assets'
import { WeatherHeader } from './WeatherHeader'
import { DisplayWeather, WeatherStyle, WeatherType } from '../types.ts/weather'
import { WeekForecast } from './WeekForecast'
import MapView, { MapMarker, Region } from 'react-native-maps'
import { CurrentWeatherResponse } from '../types.ts/CurrentWeatherResponse'
import { format } from 'date-fns'

export interface WeatherScreenProps {
  id: string
  location: Coordinates
  currentWeather: CurrentWeatherResponse
  forecastWeather: ForecastWeatherResponse
  lastUpdated: number
  onDelete?: () => void
  onRefresh: () => Promise<boolean>
}

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

export const WeatherScreen = memo(
  ({ location, currentWeather, forecastWeather, onDelete, onRefresh, lastUpdated }: WeatherScreenProps) => {
    // -------------------------------------------------------------------------------------------------------------------
    // Refresh control
    // -------------------------------------------------------------------------------------------------------------------

    const [refreshing, setRefreshing] = useState(false)

    const doRefresh = async () => {
      setRefreshing(true)
      await onRefresh()
      setRefreshing(false)
    }

    const weatherType = determineWeatherType(currentWeather.weather[0].id)
    const weatherStyle = getWeatherStyle(weatherType)
    const timezone = currentWeather.timezone / 60 / 60
    const displayWeather: DisplayWeather = {
      min: currentWeather.main.temp_min,
      max: currentWeather.main.temp_max,
      current: currentWeather.main.temp,
      type: weatherType,
      city: currentWeather.name || `(${currentWeather.coord.lat.toFixed(4)}, ${currentWeather.coord.lon.toFixed(4)})`,
      country: currentWeather.sys.country,
      timezone: `GMT${timezone > 0 ? '+' : ''}${timezone}`
    }

    // -------------------------------------------------------------------------------------------------------------------
    // Render helpers
    // -------------------------------------------------------------------------------------------------------------------

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
          <WeatherHeader weatherStyle={weatherStyle!} displayWeather={displayWeather} onDelete={onDelete} />
          <View style={{ flex: 1, marginTop: -2, backgroundColor: weatherStyle!.color, paddingTop: 8 }}>
            <Text style={{ color: 'white', textAlign: 'center', fontSize: 10, marginBottom: 6 }}>
              Last updated: {format(new Date(lastUpdated), 'd MMM HH:mm:ss')}
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 }}>
              {renderCell(displayWeather!.min, 'Min')}
              {renderCell(displayWeather!.current, 'Current')}
              {renderCell(displayWeather!.max, 'Max')}
            </View>
            {forecastWeather && (
              <>
                <OneDayForecast forecast={forecastWeather} />
                <WeekForecast forecast={forecastWeather} />
              </>
            )}
            <View style={{ margin: 12, borderRadius: 12, backgroundColor: 'white', overflow: 'hidden' }}>
              <MapView
                style={{ width: '100%', height: 200 }}
                region={
                  {
                    latitude: location?.lat,
                    longitude: location?.lon,
                    latitudeDelta: 0.25,
                    longitudeDelta: 0.25
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

    // -------------------------------------------------------------------------------------------------------------------
    // Main render
    // -------------------------------------------------------------------------------------------------------------------

    return (
      <ScrollView
        overScrollMode="never"
        style={{ flex: 1, backgroundColor: '#F0F0F0' }}
        contentContainerStyle={{ alignItems: 'center' }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={doRefresh}
            colors={['royalblue']}
            tintColor="royalblue"
            progressBackgroundColor="white"
          />
        }
      >
        {renderScreenContents()}
      </ScrollView>
    )
  }
)
