import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Check, X, Clock, MapPin, Bluetooth, Camera, Home} from 'lucide-react-native';

const classInfo = {
  className: 'Computer Science 3A',
  teacherName: 'Dr. Emily Rodriguez',
  subject: 'Advanced Algorithms',
  lectureTime: '10:30 AM - 12:00 PM'
};

const AttendanceMarkScreen = () => {
  const [verificationSteps, setVerificationSteps] = useState({
    qrScanned: 'pending',
    locationVerified: 'pending',
    bluetoothVerified: 'pending',
    faceDetected: 'pending',
    livenessChecked: 'pending'
  });

  const [attendanceStatus, setAttendanceStatus] = useState('scanning');
  const [qrTimer, setQrTimer] = useState(120); // 2-minute QR validity for temporary testing

  useEffect(() => {
    const verifyAttendance = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setVerificationSteps(prev => ({ ...prev, qrScanned: 'success' }));

        await new Promise(resolve => setTimeout(resolve, 1000));
        setVerificationSteps(prev => ({ ...prev, locationVerified: 'success' }));

        await new Promise(resolve => setTimeout(resolve, 1000));
        setVerificationSteps(prev => ({ ...prev, bluetoothVerified: 'success' }));

        await new Promise(resolve => setTimeout(resolve, 1000));
        setVerificationSteps(prev => ({ ...prev, faceDetected: 'success' }));

        await new Promise(resolve => setTimeout(resolve, 1000));
        setVerificationSteps(prev => ({ ...prev, livenessChecked: 'success' }));

        setAttendanceStatus('success');
      } catch (error) {
        setAttendanceStatus('error');
      }
    };

    const timer = setInterval(() => {
      setQrTimer(prev => prev > 0 ? prev - 1 : 0);
    }, 3000);

    verifyAttendance();

    return () => clearInterval(timer);
  }, []);

  const renderVerificationIcon = (status:string) => {
    switch (status) {
      case 'pending':
        return <Clock color="#FFA500" size={24} />;
      case 'success':
        return <Check color="#4CAF50" size={24} />;
      case 'error':
        return <X color="#FF0000" size={24} />;
    }
  };

  if (attendanceStatus === 'success') {
    return (
      <SafeAreaView style={styles.successContainer}>
        <Check color="#4CAF50" size={120} />
        <Text style={styles.successTitle}>Attendance Marked Successfully!</Text>
        <Text style={styles.successSubtitle}>
          {classInfo.className} | {classInfo.subject}
        </Text>
        <TouchableOpacity style={styles.doneButton}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (attendanceStatus === 'error') {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <X color="#FF0000" size={120} />
        <Text style={styles.errorTitle}>Attendance Verification Failed</Text>
        <Text style={styles.errorSubtitle}>
          Please contact admin or try again
        </Text>
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.className}>{classInfo.className}</Text>
        <Text style={styles.teacherName}>{classInfo.teacherName}</Text>
        <Text style={styles.lectureInfo}>{classInfo.subject} | {classInfo.lectureTime}</Text>
      </View>

      <View style={styles.qrTimerContainer}>
        <Text style={styles.qrTimerText}>QR Valid For: {qrTimer} sec</Text>
      </View>

      <View style={styles.verificationContainer}>
        <View style={styles.verificationStep}>
          {renderVerificationIcon(verificationSteps.qrScanned)}
          <Text style={styles.verificationStepText}>QR Code Scanned</Text>
        </View>

        <View style={styles.verificationStep}>
          {renderVerificationIcon(verificationSteps.locationVerified)}
          <Text style={styles.verificationStepText}>Location Verified</Text>
        </View>

        <View style={styles.verificationStep}>
          {renderVerificationIcon(verificationSteps.bluetoothVerified)}
          <Text style={styles.verificationStepText}>Bluetooth Check</Text>
        </View>

        <View style={styles.verificationStep}>
          {renderVerificationIcon(verificationSteps.faceDetected)}
          <Text style={styles.verificationStepText}>Face Detection</Text>
        </View>

        <View style={styles.verificationStep}>
          {renderVerificationIcon(verificationSteps.livenessChecked)}
          <Text style={styles.verificationStepText}>Liveness Check</Text>
        </View>
      </View>

      <ActivityIndicator 
        size="large" 
        color="#0000ff" 
        style={styles.loadingIndicator}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    paddingTop: 50
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30
  },
  className: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  },
  teacherName: {
    fontSize: 18,
    color: '#666',
    marginTop: 5
  },
  lectureInfo: {
    fontSize: 16,
    color: '#888',
    marginTop: 5
  },
  qrTimerContainer: {
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 30
  },
  qrTimerText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center'
  },
  verificationContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  verificationStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 10
  },
  verificationStepText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333'
  },
  loadingIndicator: {
    marginTop: 30
  },
  successContainer: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center'
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 20
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 30
  },
  doneButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center'
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF0000',
    marginTop: 20
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 10
  },
  retryButton: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 50,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 30
  },
  retryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default AttendanceMarkScreen;