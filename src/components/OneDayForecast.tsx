import { Text, Image, View, ScrollView } from 'react-native'
import { determineWeatherType, getOneDayForecast } from '../utils'
import { ForecastWeatherResponse } from '../types.ts/ForecastWeatherResponse'
import { icons } from '../assets'

// ---------------------------------------------------------------------------------------------------------------------
// Show weather readings at 3 hour intervals for the next 24 hours
// ---------------------------------------------------------------------------------------------------------------------
export const OneDayForecast = (props: { forecast: ForecastWeatherResponse }) => {
  const readings = getOneDayForecast(props.forecast)
  return (
    <View
      style={{
        justifyContent: 'center',
        borderRadius: 12,
        padding: 12,
        marginHorizontal: 12,
        backgroundColor: 'rgba(10,10,10,0.6)',
        marginTop: 12
      }}
    >
      <View style={{ alignItems: 'center', paddingBottom: 8 }}>
        <Text style={{ color: 'white', marginBottom: 8 }}>Next 24 hours</Text>
        <ScrollView horizontal nestedScrollEnabled>
          {readings.map((reading) => {
            const weatherType = determineWeatherType(reading.weather[0].id)
            return (
              <View
                key={reading.dt}
                style={{
                  paddingHorizontal: 12,
                  alignItems: 'center'
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: '500', color: 'white' }}>
                  {reading.dt_txt.split(' ')[1].slice(0, 5)}
                </Text>
                <Image source={icons[weatherType]} style={{ height: 32, width: 32 }} />
                <Text style={{ fontSize: 12, fontWeight: '500', color: 'white' }}>
                  {Math.round(reading.main.temp)}°C
                </Text>
              </View>
            )
          })}
        </ScrollView>
      </View>
    </View>
  )
}
