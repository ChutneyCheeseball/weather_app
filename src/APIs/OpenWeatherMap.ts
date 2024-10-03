import axios from 'axios'
import { CurrentWeatherResponse } from '../types.ts/CurrentWeatherResponse'
import { ForecastWeatherResponse } from '../types.ts/ForecastWeatherResponse'
import MockedCurrentWeatherResponse from '../mocked/CurrentWeatherResponse.json'
import MockedForecastWeatherResponse from '../mocked/ForecastWeatherResponse.json'
import { Coordinates } from './Location'

const API_KEY = '33870ed02a4b3d62816eb9e54909530f'

// ---------------------------------------------------------------------------------------------------------------------
// Open Weather Map API with common parameters
// ---------------------------------------------------------------------------------------------------------------------

const weatherAPI = axios.create({
  method: 'get',
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 10 * 1000,
  params: {
    appid: API_KEY,
    units: 'metric'
  }
})

// ---------------------------------------------------------------------------------------------------------------------
// API logging
// ---------------------------------------------------------------------------------------------------------------------

// weatherAPI.interceptors.request.use((config) => {
//   const URI = axios.getUri(config)
//   console.log(config.method!.toUpperCase(), URI)
//   return config
// })

// weatherAPI.interceptors.response.use((response) => {
//   console.log(response.status, JSON.stringify(response.data))
//   return response
// })

// ---------------------------------------------------------------------------------------------------------------------
// The actual call to the API
// ---------------------------------------------------------------------------------------------------------------------

const callWeatherAPI = async (api: 'weather' | 'forecast', location: Coordinates) => {
  try {
    const response = await weatherAPI(`/${api}`, {
      params: {
        ...location
      }
    })
    if (response.status === 200) {
      return response.data
    }
  } catch (error) {
    console.error(error)
  }
  return null
}

// ---------------------------------------------------------------------------------------------------------------------
// Exported API functions
// ---------------------------------------------------------------------------------------------------------------------

export const getCurrentWeather = async (location: Coordinates, mocked?: boolean) => {
  const response = mocked ? MockedCurrentWeatherResponse : await callWeatherAPI('weather', location)
  return response !== null ? (response as CurrentWeatherResponse) : null
}

export const getForecastWeather = async (location: Coordinates, mocked?: boolean) => {
  const response = mocked ? MockedForecastWeatherResponse : await callWeatherAPI('forecast', location)
  return response !== null ? (response as ForecastWeatherResponse) : null
}
