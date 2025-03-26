import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { generateQRCode } from '@/utils/qrCode';
import { AttendanceStats } from './AttendanceStats';

export function TeacherDashboard() {
  const [qrData, setQRData] = useState('');
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setQRData(generateQRCode());
    }, 30000); // Refresh QR code every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const requestAttendance = () => {
    // Implement attendance request logic
  };

  return (
    <View style={styles.container}>
      <View style={styles.qrContainer}>
        <Text style={styles.title}>Current Session QR Code</Text>
        {/* <QRCode
          value={qrData}
          size={200}
          backgroundColor="white"
          color="black"
        /> */}
      </View>

      <AttendanceStats />

      <TouchableOpacity style={styles.button} onPress={requestAttendance}>
        <Text style={styles.buttonText}>Request Attendance</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
