import { addHours, addSeconds, fromUnixTime } from 'date-fns'
import { ForecastReading, ForecastWeatherResponse } from './types.ts/ForecastWeatherResponse'
import { WeatherType } from './types.ts/weather'

// -------------------------------------------------------------------------------------------------------------------
// Refer to https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2
//
// There are multiple weather conditions: Thunderstorm, Drizzle, Rain, Snow, Atmosphere, Clear and Clouds
// However, we only have images for sunny, cloudy and rainy.
// -------------------------------------------------------------------------------------------------------------------
export const determineWeatherType = (weatherId: number) => {
  const idStr = String(weatherId)
  // 2xx is Thunderstorm
  // 3xx is Drizzle
  // 5xx is Rain
  // 6xx is Snow
  if (idStr.startsWith('2') || idStr.startsWith('3') || idStr.startsWith('5') || idStr.startsWith('6')) {
    return 'rainy' // We regard all of the above as rain
  } else if (idStr === '800') {
    return 'sunny'
  } else {
    // 1xx is not defined
    // 7xx is Atmosphere (mist, smoke, dust, etc)
    // We pretend these are the same as 8xx, which is Cloudy
    return 'cloudy'
  }
}

// -------------------------------------------------------------------------------------------------------------------
// 8 readings covers 24 hours
// Include timezone and local time in readings for convenience of displaying
// -------------------------------------------------------------------------------------------------------------------
export const getOneDayForecast = (forecastData: ForecastWeatherResponse) => {
  const oneDay = forecastData.list.slice(0, 8)
  return oneDay
  // return oneDay.map((reading) => {
  //   // We want to include timezone (as e.g. UTC+2) and local time in reading
  //   const timezoneOffset = forecastData.city.timezone
  //   const timezoneHours = timezoneOffset / 60 / 60
  //   const timezone = `UTC${timezoneOffset > 0 ? '+' : ''}${timezoneHours}`
  //   const date = addHours(fromUnixTime(reading.dt), timezoneHours)
  //   const localTime = String(date.getUTCHours()).padStart(2, '0') + ':00'
  //   return {
  //     ...reading,
  //     timezone,
  //     localTime
  //   }
  // })
}

// -------------------------------------------------------------------------------------------------------------------
// Group readings by date
// -------------------------------------------------------------------------------------------------------------------
export const groupReadingsByDate = (forecastData: ForecastWeatherResponse) => {
  const grouped: { [key: string]: ForecastReading[] } = {}
  for (const reading of forecastData.list) {
    const date = reading.dt_txt.split(' ')[0]
    if (grouped[date]) {
      grouped[date].push(reading)
    } else {
      grouped[date] = [reading]
    }
  }
  return grouped
}

// -------------------------------------------------------------------------------------------------------------------
// Return average temperature of a list of readings
// -------------------------------------------------------------------------------------------------------------------
export const getAverageTemp = (readings: ForecastReading[]) => {
  return Math.round(readings.reduce((acc, cur) => acc + cur.main.temp, 0) / readings.length)
}

// -------------------------------------------------------------------------------------------------------------------
// Find the 'average' weather type for a list of readings
// -------------------------------------------------------------------------------------------------------------------
export const determineAverageWeather = (readings: ForecastReading[]) => {
  const counts: { [key in WeatherType]: number } = {
    sunny: 0,
    rainy: 0,
    cloudy: 0
  }

  for (const r of readings) {
    const weatherType = determineWeatherType(r.weather[0].id)
    counts[weatherType]++
  }

  // Return whichever weather type we counted the most occurrences of.
  // In the event of a tie, order of preference is rainy, cloudy, sunny
  const maxCount = Math.max(...Object.values(counts))
  if (counts.rainy === maxCount) {
    return 'rainy'
  } else if (counts.cloudy === maxCount) {
    return 'cloudy'
  } else {
    return 'sunny'
  }
}
