import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Chip } from 'react-native-paper';

type AttendanceRecord = {
  id: string;
  date: string;
  subject: string;
  status: 'present' | 'absent' | 'late';
  time: string;
};

const mockAttendanceHistory: AttendanceRecord[] = [
  { id: '1', date: '2024-02-20', subject: 'Mathematics', status: 'present', time: '09:05 AM' },
  { id: '2', date: '2024-02-20', subject: 'Physics', status: 'late', time: '11:10 AM' },
  { id: '3', date: '2024-02-19', subject: 'Chemistry', status: 'present', time: '09:00 AM' },
  { id: '4', date: '2024-02-19', subject: 'Biology', status: 'absent', time: '11:00 AM' },
];

export default function HistoryScreen() {
  const user = {
    role: 'student',
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return '#4CAF50';
      case 'late':
        return '#FFC107';
      case 'absent':
        return '#F44336';
      default:
        return '#000';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">Attendance History</Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          {user?.role === 'teacher' ? 'Class Attendance Records' : 'Your Attendance Records'}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {mockAttendanceHistory.map((record) => (
          <Card key={record.id} style={styles.card}>
            <Card.Content>
              <View style={styles.recordHeader}>
                <Text variant="titleMedium">{record.subject}</Text>
                <Chip
                  textStyle={{ color: '#fff' }}
                  style={{
                    backgroundColor: getStatusColor(record.status),
                  }}
                >
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </Chip>
              </View>
              
              <View style={styles.recordDetails}>
                <Text variant="bodyMedium">{record.date}</Text>
                <Text variant="bodyMedium">{record.time}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  subtitle: {
    color: '#666',
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  card: {
    marginBottom: 16,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});