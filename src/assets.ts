import { WeatherType } from './types.ts/weather'

const sunnyIcon = require('../assets/icons/sunny.png')
const cloudyIcon = require('../assets/icons/cloudy.png')
const rainyIcon = require('../assets/icons/rainy.png')

const sunnyImg = require('../assets/images/forest_sunny.png')
const cloudyImg = require('../assets/images/forest_cloudy.png')
const rainyImg = require('../assets/images/forest_rainy.png')

type assetCollection = {
  [key in WeatherType]: any
}

export const icons: assetCollection = {
  sunny: sunnyIcon,
  cloudy: cloudyIcon,
  rainy: rainyIcon
}

export const images: assetCollection = {
  sunny: sunnyImg,
  cloudy: cloudyImg,
  rainy: rainyImg
}
