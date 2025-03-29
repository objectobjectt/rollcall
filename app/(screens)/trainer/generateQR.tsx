import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRgenerator = () => {
  // State to store QR code data fetched from backend
  const [qrData, setQrData] = useState('0:0:0:0'); // Default placeholder data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch QR code data from backend
  const fetchQRData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call to your backend
      // For example:
      // const response = await fetch('https://your-api.com/qr-data');
      // const data = await response.json();
      // setQrData(data.qrContent);
      
      // Simulating API call with timeout
      setTimeout(() => {
        setQrData('0:0:0:0'); // This would be replaced with actual data from backend
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to fetch QR data. Please try again.');
      setLoading(false);
    }
  };

  // Initial data fetch on component mount
  useEffect(() => {
    fetchQRData();
  }, []);

  // Function to refresh QR code data
  const refreshQRCode = () => {
    fetchQRData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#1a5fb4" barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.title}>QR Code Generator</Text>
      </View>
      
      <View style={styles.qrContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#1a5fb4" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <QRCode
              value={qrData}
              size={200}
              backgroundColor="white"
              color="#1a5fb4"
            />
            {/* <Text style={styles.dataText}>
              Data: {qrData}
            </Text>
            <Text style={styles.infoText}>
              This QR code contains data fetched from backend.
            </Text> */}
          </>
        )}
      </View>
      
      <TouchableOpacity 
        style={styles.refreshButton}
        onPress={refreshQRCode}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Refreshing...' : 'Refresh QR Code'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafd',
    marginTop: 10,
  },
  header: {
    backgroundColor: '#1a5fb4',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  qrContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dataText: {
    marginTop: 20,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  infoText: {
    marginTop: 10,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#1a5fb4',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QRgenerator;