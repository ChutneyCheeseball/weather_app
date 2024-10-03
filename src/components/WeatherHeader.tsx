import { ImageBackground, Text, StyleSheet } from 'react-native'
import { CurrentWeather, WeatherStyle } from '../types.ts/weather'

// ---------------------------------------------------------------------------------------------------------------------
// The header with image for the weather screen
// ---------------------------------------------------------------------------------------------------------------------
export const WeatherHeader = (props: { weather: CurrentWeather; weatherStyle: WeatherStyle }) => {
  const { weather, weatherStyle } = props
  return (
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
          fontSize: 18,
          position: 'absolute',
          left: 12,
          top: 6,
          fontWeight: '500',
          ...styles.shadowedText
        }}
      >
        {weather!.city.toUpperCase()}, {weather!.country}
      </Text>
      <Text
        style={{
          fontSize: 48,
          fontWeight: '500',
          ...styles.shadowedText
        }}
      >
        {Math.round(weather!.current)}°C
      </Text>
      <Text
        style={{
          fontSize: 36,
          marginTop: -16,
          ...styles.shadowedText
        }}
      >
        {weather!.type.toUpperCase()}
      </Text>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  shadowedText: {
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1
  }
})
