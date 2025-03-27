import StudentHistoryScreen from '@/components/StudentHistory';
import TeacherHistory from '@/components/TeacherHistory';
import { useAuth } from '@/hooks/useAuth';
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
  {
    id: '1',
    date: '2024-02-20',
    subject: 'Mathematics',
    status: 'present',
    time: '09:05 AM',
  },
  {
    id: '2',
    date: '2024-02-20',
    subject: 'Physics',
    status: 'late',
    time: '11:10 AM',
  },
  {
    id: '3',
    date: '2024-02-19',
    subject: 'Chemistry',
    status: 'present',
    time: '09:00 AM',
  },
  {
    id: '4',
    date: '2024-02-19',
    subject: 'Biology',
    status: 'absent',
    time: '11:00 AM',
  },
];

export default function HistoryScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      {user?.role === 'teacher' ? <TeacherHistory /> : <StudentHistoryScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
