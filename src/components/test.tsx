import { Text, View } from 'react-native'
import { memo } from 'react'

export const Test = (props: { name: string }) => {
  console.log('Test render', props)
  return (
    <View style={{ flex: 1 }}>
      <Text>{props.name}</Text>
    </View>
  )
}
