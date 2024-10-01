import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Coordinates, getDeviceLocation } from './APIs/Location';

export default function App() {

  // -------------------------------------------------------------------------------------------------------------------
  // Hooks
  // -------------------------------------------------------------------------------------------------------------------

  const [location, setLocation] = useState<Coordinates | null>(null)

  const awaitLocation = async () => {
    const location = await getDeviceLocation()
    if (location === null) {
      // We should probably show an error here
    }
    setLocation(location)
  }

  useEffect(() => {
    awaitLocation()
  }, [])

  // -------------------------------------------------------------------------------------------------------------------
  // Main render
  // -------------------------------------------------------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.flex}>
      <StatusBar backgroundColor='black' style='light'/>
      <View style={styles.container}>
      <Text>{location ? JSON.stringify(location) : "No location..."}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
