import { Text, Image, View } from 'react-native'
import { determineAverageWeather, getAverageTemp, groupReadingsByDate } from '../utils'
import { ForecastWeatherResponse } from '../types.ts/ForecastWeatherResponse'
import { icons } from '../assets'
import { format, parseISO } from 'date-fns'

// ---------------------------------------------------------------------------------------------------------------------
// Show the weekly forecast (we only get readings back for 5 days)
// Calculate average temperature and weather over a single day's readings and display them
// ---------------------------------------------------------------------------------------------------------------------
export const WeekForecast = (props: { forecast: ForecastWeatherResponse }) => {
  const readings = groupReadingsByDate(props.forecast)
  const dates = Object.keys(readings)

  return (
    <View
      style={{
        justifyContent: 'center',
        borderRadius: 12,
        padding: 8,
        marginHorizontal: 12,
        backgroundColor: 'rgba(10,10,10,0.6)',
        marginTop: 12
      }}
    >
      <View style={{ alignItems: 'center', paddingBottom: 8 }}>
        <Text style={{ color: 'white', marginBottom: 8 }}>The week ahead</Text>

        {dates.map((date) => {
          const dayOfWeek = format(parseISO(date), 'EEEE')
          const averageTemp = getAverageTemp(readings[date])
          const averageWeatherType = determineAverageWeather(readings[date])
          return (
            <View
              key={date}
              style={{
                width: '100%',
                paddingHorizontal: 12,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginVertical: 4
              }}
            >
              <Text style={{ color: 'white', flex: 1 }}>{dayOfWeek}</Text>
              <Image source={icons[averageWeatherType]} style={{ width: 30, height: 30 }} />
              <Text style={{ color: 'white', flex: 1, textAlign: 'right', fontWeight: 'bold' }}>{averageTemp}°C</Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}
