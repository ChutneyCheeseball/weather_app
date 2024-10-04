import { View, TouchableOpacity, Text, Modal, ActivityIndicator, ToastAndroid } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import MapView, { MapMarker } from 'react-native-maps'
import { Coordinates } from '../APIs/Location'
import { useEffect, useState } from 'react'

interface AddPlaceMapProps {
  visible: boolean
  onClose: () => void
  markers: { location: Coordinates; title: string }[]
  onAdd: (coordinate: Coordinates) => Promise<boolean>
}

export const AddPlaceMap = ({ markers, visible, onClose, onAdd }: AddPlaceMapProps) => {
  // Clear state when modal goes invisible
  useEffect(() => {
    if (!visible) {
      setNewPlace(null)
    }
  }, [visible])

  const [newPlace, setNewPlace] = useState<Coordinates | null>(null)
  const [busy, setBusy] = useState(false)

  // Substitute to some event handlers when we are busy saving a new place
  const doNothing = () => {}

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={busy ? doNothing : onClose}>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={onClose} style={{ padding: 7, width: 60 }} disabled={busy}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <Text style={{ fontWeight: 'bold', fontSize: 20, textAlign: 'center' }}>Add a place</Text>
          <View style={{ flex: 1 }} />
        </View>
        <MapView
          rotateEnabled={false}
          style={{ flex: 1 }}
          toolbarEnabled={false}
          onPress={
            busy
              ? doNothing
              : (event) => {
                  const { coordinate } = event.nativeEvent
                  setNewPlace({ lat: coordinate.latitude, lon: coordinate.longitude })
                }
          }
          onPoiClick={
            busy
              ? doNothing
              : (event) => {
                  const { coordinate } = event.nativeEvent
                  setNewPlace({ lat: coordinate.latitude, lon: coordinate.longitude })
                }
          }
        >
          {markers.map((m, idx) => (
            <MapMarker
              key={idx}
              title={m.title}
              coordinate={{
                latitude: m.location.lat,
                longitude: m.location.lon
              }}
            ></MapMarker>
          ))}
          {newPlace && (
            <MapMarker
              pinColor="blue"
              coordinate={{ latitude: newPlace.lat, longitude: newPlace.lon }}
              onPress={busy ? doNothing : () => setNewPlace(null)}
            />
          )}
        </MapView>
        <View style={{ height: 60, alignItems: 'center', justifyContent: 'center', padding: 12 }}>
          {!newPlace && <Text>Tap a location on the map</Text>}
          {newPlace && (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                backgroundColor: 'royalblue',
                width: '100%',
                height: '100%',
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center'
              }}
              disabled={busy}
              onPress={async () => {
                setBusy(true)
                const success = await onAdd(newPlace)
                setBusy(false)
                if (success) {
                  onClose()
                  ToastAndroid.show('Added place', 2000)
                } else {
                  ToastAndroid.show('Could not add place', 2000)
                }
              }}
            >
              {busy && <ActivityIndicator color="white" style={{ marginRight: 12 }} />}
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Add this place</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  )
}
