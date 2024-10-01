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
