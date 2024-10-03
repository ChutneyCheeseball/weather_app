import { ImageBackground, Text, StyleSheet, View, TouchableOpacity } from 'react-native'
import { DisplayWeather, WeatherStyle } from '../types.ts/weather'
import Ionicons from '@expo/vector-icons/Ionicons'

interface WeatherHeaderProps {
  displayWeather: DisplayWeather
  weatherStyle: WeatherStyle
  onDelete?: () => void
}

// ---------------------------------------------------------------------------------------------------------------------
// The header with image for the weather screen
// ---------------------------------------------------------------------------------------------------------------------
export const WeatherHeader = ({ displayWeather, weatherStyle, onDelete }: WeatherHeaderProps) => {
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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          left: 12,
          top: 6,
          width: '100%',
          height: 40
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: 18,
            fontWeight: '500',
            ...styles.shadowedText
          }}
        >
          {displayWeather.city.toUpperCase()}, {displayWeather.country}
        </Text>
        {onDelete && (
          <TouchableOpacity
            style={{
              marginRight: 24,
              backgroundColor: 'royalblue',
              padding: 4,
              borderRadius: 12,
              borderColor: 'white',
              borderWidth: 1
            }}
            onPress={onDelete}
          >
            <Ionicons color="white" name="trash" size={24} />
          </TouchableOpacity>
        )}
      </View>

      <Text
        style={{
          fontSize: 48,
          fontWeight: '500',
          ...styles.shadowedText
        }}
      >
        {Math.round(displayWeather.current)}°C
      </Text>
      <Text
        style={{
          fontSize: 36,
          marginTop: -16,
          ...styles.shadowedText
        }}
      >
        {displayWeather.type.toUpperCase()}
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
