import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddCoords = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [corners, setCorners] = useState([
    { id: 1, name: 'Top Left', lat: '', lng: '', captured: false },
    { id: 2, name: 'Top Right', lat: '', lng: '', captured: false },
    { id: 3, name: 'Bottom Right', lat: '', lng: '', captured: false },
    { id: 4, name: 'Bottom Left', lat: '', lng: '', captured: false },
  ]);

  const [centerPoint, setCenterPoint] = useState({ lat: 0, lng: 0 });
  const [zoomLevel, setZoomLevel] = useState(0);
  const [roomName, setRoomName] = useState('');

  const [activeCorner, setActiveCorner] = useState(null);

  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);

  const watchIdRef = useRef(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        setLocationPermission(true);
        Alert.alert(
          'Success',
          'Location permission granted. You can now capture room coordinates.'
        );
      } else {
        setLocationPermission(false);
        Alert.alert(
          'Error',
          'Location permission denied. Cannot capture room coordinates automatically.'
        );
      }
    } catch (err) {
      console.warn(err);
      Alert.alert('Error', 'Failed to request location permission');
    }
  };

  const startTracking = async () => {
    if (!locationPermission) {
      requestLocationPermission();
      return;
    }

    try {
      if (watchIdRef.current) {
        await Location.stopLocationUpdatesAsync(watchIdRef.current);
      }

      const locationOptions = {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 0.1,
      };

      watchIdRef.current = await Location.watchPositionAsync(
        locationOptions,
        (location) => {
          const { latitude, longitude } = location.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        }
      );

      setIsTracking(true);
      Alert.alert(
        'Tracking Started',
        'Move to each corner of the room and tap "Capture This Corner"'
      );
    } catch (error) {
      Alert.alert('Error', `Location error: ${error.message}`);
      setIsTracking(false);
    }
  };

  const stopTracking = async () => {
    if (watchIdRef.current) {
      try {
        watchIdRef.current.remove();
        watchIdRef.current = null;
      } catch (error) {
        console.warn('Error stopping location updates:', error);
      }
    }
    setIsTracking(false);
    setActiveCorner(null);
  };

  const beginCaptureCorner = (cornerId) => {
    if (!locationPermission) {
      requestLocationPermission();
      return;
    }

    if (!isTracking) {
      startTracking();
    }
    setActiveCorner(cornerId);
    Alert.alert(
      'Corner Selected',
      `Move to the ${
        corners.find((c) => c.id === cornerId).name
      } corner and stand still, then tap "Capture This Position"`
    );
  };

  const captureCurrentPosition = () => {
    if (!currentLocation || activeCorner === null) {
      Alert.alert('Error', 'No active corner or location data available');
      return;
    }

    setCorners(
      corners.map((corner) =>
        corner.id === activeCorner
          ? {
              ...corner,
              lat: currentLocation.lat.toFixed(8),
              lng: currentLocation.lng.toFixed(8),
              captured: true,
            }
          : corner
      )
    );

    const remainingCorners = corners.filter(
      (c) => !c.captured && c.id !== activeCorner
    );

    if (remainingCorners.length > 0) {
      const nextCorner = remainingCorners[0].id;
      Alert.alert(
        'Corner Captured',
        `${
          corners.find((c) => c.id === activeCorner).name
        } has been captured. Would you like to capture the ${
          corners.find((c) => c.id === nextCorner).name
        } corner next?`,
        [
          {
            text: 'Yes',
            onPress: () => setActiveCorner(nextCorner),
          },
          {
            text: 'No',
            onPress: () => setActiveCorner(null),
          },
        ]
      );
    } else if (corners.filter((c) => !c.captured).length === 1) {
      Alert.alert(
        'All Corners Captured',
        'You have successfully captured all four corners of the room!'
      );
      setActiveCorner(null);
      stopTracking();
    } else {
      setActiveCorner(null);
    }
  };

  const updateCorner = (id, field, value) => {
    setCorners(
      corners.map((corner) =>
        corner.id === id ? { ...corner, [field]: value } : corner
      )
    );
  };

  useEffect(() => {
    calculateCenterAndZoom();
  }, [corners]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        watchIdRef.current.remove();
      }
    };
  }, []);

  const calculateCenterAndZoom = () => {
    const hasAllCoords = corners.every(
      (corner) => corner.lat !== '' && corner.lng !== ''
    );

    if (!hasAllCoords) return;

    const points = corners.map((corner) => ({
      lat: parseFloat(corner.lat),
      lng: parseFloat(corner.lng),
    }));

    const latSum = points.reduce((sum, point) => sum + point.lat, 0);
    const lngSum = points.reduce((sum, point) => sum + point.lng, 0);
    const center = {
      lat: latSum / points.length,
      lng: lngSum / points.length,
    };

    const minLat = Math.min(...points.map((p) => p.lat));
    const maxLat = Math.max(...points.map((p) => p.lat));
    const minLng = Math.min(...points.map((p) => p.lng));
    const maxLng = Math.max(...points.map((p) => p.lng));

    const latSpan = maxLat - minLat;
    const lngSpan = maxLng - minLng;

    const maxSpan = Math.max(latSpan, lngSpan);
    let zoom = 0;

    if (maxSpan <= 0.0001) zoom = 20;
    else if (maxSpan <= 0.0005) zoom = 18;
    else if (maxSpan <= 0.001) zoom = 16;
    else if (maxSpan <= 0.005) zoom = 14;
    else if (maxSpan <= 0.01) zoom = 12;
    else if (maxSpan <= 0.05) zoom = 10;
    else zoom = 8;

    setCenterPoint(center);
    setZoomLevel(zoom);
  };

  const useCurrentLocation = async () => {
    if (!locationPermission) {
      requestLocationPermission();
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const { latitude, longitude } = location.coords;
      const offsetLat = 0.0001;
      const offsetLng = 0.0001;

      setCorners([
        {
          id: 1,
          name: 'Top Left',
          lat: `${latitude - offsetLat}`,
          lng: `${longitude - offsetLng}`,
          captured: true,
        },
        {
          id: 2,
          name: 'Top Right',
          lat: `${latitude - offsetLat}`,
          lng: `${longitude + offsetLng}`,
          captured: true,
        },
        {
          id: 3,
          name: 'Bottom Right',
          lat: `${latitude + offsetLat}`,
          lng: `${longitude + offsetLng}`,
          captured: true,
        },
        {
          id: 4,
          name: 'Bottom Left',
          lat: `${latitude + offsetLat}`,
          lng: `${longitude - offsetLng}`,
          captured: true,
        },
      ]);
    } catch (error) {
      Alert.alert('Error', `Unable to get current location: ${error.message}`);
    }
  };

  const saveRoom = () => {
    if (!roomName.trim()) {
      Alert.alert('Error', 'Please enter a room name');
      return;
    }

    const hasAllCoords = corners.every(
      (corner) => corner.lat !== '' && corner.lng !== ''
    );

    if (!hasAllCoords) {
      Alert.alert('Error', 'Please enter all corner coordinates');
      return;
    }

    const roomData = {
      name: roomName,
      corners: corners.map(({ id, name, lat, lng }) => ({
        id,
        name,
        lat,
        lng,
      })),
      center: centerPoint,
      zoomLevel: zoomLevel,
      createdAt: new Date().toISOString(),
    };

    Alert.alert(
      'Room Saved',
      `Room: ${roomName}\nCenter: ${centerPoint.lat.toFixed(
        6
      )}, ${centerPoint.lng.toFixed(6)}\nZoom: ${zoomLevel}`
    );

    console.log('Saved room data:', roomData);

    resetForm();
  };

  const resetForm = () => {
    stopTracking();
    setLatitude('');
    setLongitude('');
    setRoomName('');
    setCorners([
      { id: 1, name: 'Top Left', lat: '', lng: '', captured: false },
      { id: 2, name: 'Top Right', lat: '', lng: '', captured: false },
      { id: 3, name: 'Bottom Right', lat: '', lng: '', captured: false },
      { id: 4, name: 'Bottom Left', lat: '', lng: '', captured: false },
    ]);
    setCenterPoint({ lat: 0, lng: 0 });
    setZoomLevel(0);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Room Coordinates</Text>
          {currentLocation && (
            <Text style={styles.locationText}>
              Current location: {currentLocation.lat.toFixed(6)},{' '}
              {currentLocation.lng.toFixed(6)}
            </Text>
          )}
          {!locationPermission && (
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestLocationPermission}
            >
              <Text style={styles.permissionButtonText}>
                Allow Location Access
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {!locationPermission && (
          <View style={styles.permissionBanner}>
            <Text style={styles.permissionBannerText}>
              Location permission is required to capture room coordinates
              automatically.
            </Text>
            <Button
              title="Grant Permission"
              onPress={requestLocationPermission}
              color="#4CAF50"
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Room Details</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Room Name:</Text>
            <TextInput
              style={styles.input}
              value={roomName}
              onChangeText={setRoomName}
              placeholder="Enter room name"
            />
          </View>

          <View style={styles.trackingControls}>
            <Text style={styles.subSectionTitle}>Automatic Corner Capture</Text>
            {!locationPermission ? (
              <Text style={styles.warningText}>
                Location permission required for tracking.
              </Text>
            ) : isTracking ? (
              <View>
                <Button
                  title="Stop Tracking"
                  onPress={stopTracking}
                  color="#f44336"
                />
                <Text style={styles.trackingActiveText}>
                  GPS tracking active. Move to corners and capture positions.
                </Text>
              </View>
            ) : (
              <Button
                title="Start Tracking"
                onPress={startTracking}
                color="#4CAF50"
              />
            )}

            {isTracking && activeCorner !== null && (
              <TouchableOpacity
                style={styles.captureButton}
                onPress={captureCurrentPosition}
              >
                <Text style={styles.captureButtonText}>
                  Capture This Position
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.subSectionTitle}>Corner Coordinates</Text>

          {corners.map((corner) => (
            <View
              key={corner.id}
              style={[
                styles.cornerContainer,
                corner.captured && styles.capturedCorner,
                activeCorner === corner.id && styles.activeCorner,
              ]}
            >
              <View style={styles.cornerHeader}>
                <Text style={styles.cornerTitle}>{corner.name}</Text>
                <TouchableOpacity
                  style={[
                    styles.cornerButton,
                    corner.captured && styles.cornerButtonCaptured,
                    activeCorner === corner.id && styles.cornerButtonActive,
                    !locationPermission && styles.cornerButtonDisabled,
                  ]}
                  onPress={() => beginCaptureCorner(corner.id)}
                  disabled={!locationPermission}
                >
                  <Text style={styles.cornerButtonText}>
                    {!locationPermission
                      ? 'Need Permission'
                      : corner.captured
                      ? 'Recapture'
                      : activeCorner === corner.id
                      ? 'Capturing...'
                      : 'Capture'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.coordInputRow}>
                <View style={styles.coordInput}>
                  <Text style={styles.label}>Latitude:</Text>
                  <TextInput
                    style={styles.input}
                    value={corner.lat}
                    onChangeText={(value) =>
                      updateCorner(corner.id, 'lat', value)
                    }
                    placeholder="Latitude"
                    keyboardType="numeric"
                    editable={!isTracking || activeCorner !== corner.id}
                  />
                </View>
                <View style={styles.coordInput}>
                  <Text style={styles.label}>Longitude:</Text>
                  <TextInput
                    style={styles.input}
                    value={corner.lng}
                    onChangeText={(value) =>
                      updateCorner(corner.id, 'lng', value)
                    }
                    placeholder="Longitude"
                    keyboardType="numeric"
                    editable={!isTracking || activeCorner !== corner.id}
                  />
                </View>
              </View>
            </View>
          ))}

          <View style={styles.buttonGroup}>
            <Button
              title="Use Current Location"
              onPress={useCurrentLocation}
              disabled={!locationPermission}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Room Summary</Text>

          <View style={styles.summaryContainer}>
            <Text style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Center Point: </Text>
              {centerPoint.lat.toFixed(6)}, {centerPoint.lng.toFixed(6)}
            </Text>
            <Text style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Zoom Level: </Text>
              {zoomLevel}
            </Text>
            <Text style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Corners Captured: </Text>
              {corners.filter((c) => c.captured).length} of 4
            </Text>
          </View>

          <View style={styles.buttonGroup}>
            <Button
              title="Save Room"
              onPress={saveRoom}
              color="#4CAF50"
              disabled={
                corners.filter((c) => c.captured).length < 4 || !roomName.trim()
              }
            />
            <View style={styles.buttonSpacer} />
            <Button title="Reset" onPress={resetForm} color="#f44336" />
          </View>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#3f51b5',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  locationText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginTop: 5,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  permissionBanner: {
    backgroundColor: '#ffeb3b',
    padding: 15,
    margin: 10,
    borderRadius: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  permissionBannerText: {
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  subSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#555',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  cornerContainer: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#3f51b5',
  },
  capturedCorner: {
    borderLeftColor: '#4CAF50',
    backgroundColor: '#f0f9f0',
  },
  activeCorner: {
    borderLeftColor: '#FF9800',
    backgroundColor: '#fff9f0',
  },
  cornerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cornerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3f51b5',
  },
  cornerButton: {
    backgroundColor: '#3f51b5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  cornerButtonCaptured: {
    backgroundColor: '#4CAF50',
  },
  cornerButtonActive: {
    backgroundColor: '#FF9800',
  },
  cornerButtonDisabled: {
    backgroundColor: '#9e9e9e',
  },
  cornerButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  coordInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coordInput: {
    flex: 1,
    marginRight: 5,
  },
  buttonGroup: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonSpacer: {
    width: 10,
  },
  summaryContainer: {
    backgroundColor: '#f0f4ff',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  summaryItem: {
    fontSize: 16,
    marginBottom: 5,
  },
  summaryLabel: {
    fontWeight: 'bold',
    color: '#3f51b5',
  },
  footer: {
    height: 30,
  },
  trackingControls: {
    backgroundColor: '#f0f4ff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  warningText: {
    color: '#f44336',
    fontStyle: 'italic',
    marginTop: 5,
  },
  trackingActiveText: {
    color: '#4CAF50',
    fontStyle: 'italic',
    marginTop: 5,
  },
  captureButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  captureButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddCoords;
