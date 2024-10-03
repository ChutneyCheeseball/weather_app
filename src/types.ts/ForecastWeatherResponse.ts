// ---------------------------------------------------------------------------------------------------------------------
// As returned by https://api.openweathermap.org/data/2.5/forecast
//
// See sample response in ../mocked/ForecastWeatherResponse.json
// ---------------------------------------------------------------------------------------------------------------------

export interface ForecastReading {
  dt: number
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    sea_level: number
    grnd_level: number
    humidity: number
    temp_kf: number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  clouds: { all: number }
  wind: {
    speed: number
    deg: number
    gust: number
  }
  visibility: number
  pop: number
  rain?: {
    '3h': number
  }
  snow?: {
    '3h': number
  }
  sys: {
    pod: 'd' | 'n'
  }
  dt_txt: string
}

export interface ForecastWeatherResponse {
  cod: string
  message: number
  cnt: number
  list: ForecastReading[]
  city: {
    id: number
    name: string
    coord: { lat: number; lon: number }
    country: string
    population: number
    timezone: number
    sunrise: number
    sunset: number
  }
}
