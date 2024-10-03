export type WeatherType = 'sunny' | 'cloudy' | 'rainy'

export interface WeatherStyle {
  img: any
  color: string
}

export interface DisplayWeather {
  type: WeatherType
  min: number
  max: number
  current: number
  city: string
  country: string
}
