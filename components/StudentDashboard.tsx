import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, Button, Surface, ProgressBar, Chip } from 'react-native-paper';
// import { RootState } from '@/store';
import { router } from 'expo-router';
import { Users, Clock, BookOpen } from 'lucide-react-native';

export default function StudentDashboardScreen() {
  const user = {
    name: 'John Doe',
    role: 'teacher',
  }

  const handleScanQR = () => {
    // router.push('/scan');
  };

  if (user?.role !== 'teacher') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.greeting}>
            Welcome back, {user?.name}!
          </Text>
          <Text variant="bodyLarge" style={styles.role}>Student</Text>
        </View>

        <View style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">Today's Classes</Text>
              <View style={styles.classItem}>
                <Text>Mathematics</Text>
                <Text variant="bodySmall">09:00 AM - 10:30 AM</Text>
              </View>
              <View style={styles.classItem}>
                <Text>Physics</Text>
                <Text variant="bodySmall">11:00 AM - 12:30 PM</Text>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">Attendance Overview</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text variant="headlineMedium">85%</Text>
                  <Text variant="bodySmall">Present</Text>
                </View>
                <View style={styles.statItem}>
                  <Text variant="headlineMedium">12%</Text>
                  <Text variant="bodySmall">Late</Text>
                </View>
                <View style={styles.statItem}>
                  <Text variant="headlineMedium">3%</Text>
                  <Text variant="bodySmall">Absent</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Surface style={styles.headerCard} elevation={2}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800' }}
          style={styles.headerImage}
        />
        <View style={styles.headerOverlay}>
          <View style={styles.headerContent}>
            <Text variant="headlineMedium" style={styles.greeting}>
              Welcome back, {user?.name}!
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Mathematics Department
            </Text>
          </View>
        </View>
      </Surface>

      <View style={styles.statsContainer}>
        <Surface style={styles.statCard} elevation={1}>
          <Users size={24} color="#6366F1" />
          <Text variant="titleLarge" style={styles.statNumber}>156</Text>
          <Text variant="bodyMedium" style={styles.statLabel}>Total Students</Text>
        </Surface>

        <Surface style={styles.statCard} elevation={1}>
          <Clock size={24} color="#EC4899" />
          <Text variant="titleLarge" style={styles.statNumber}>24</Text>
          <Text variant="bodyMedium" style={styles.statLabel}>Classes Today</Text>
        </Surface>

        <Surface style={styles.statCard} elevation={1}>
          <BookOpen size={24} color="#14B8A6" />
          <Text variant="titleLarge" style={styles.statNumber}>89%</Text>
          <Text variant="bodyMedium" style={styles.statLabel}>Attendance Rate</Text>
        </Surface>
      </View>

      <Card style={styles.currentSessionCard}>
        <Card.Content>
          <View style={styles.sessionHeader}>
            <View>
              <Text variant="titleMedium" style={styles.currentSessionTitle}>
                Current Session
              </Text>
              <Text variant="bodyLarge" style={styles.className}>
                Advanced Mathematics - Class 12A
              </Text>
            </View>
            <Chip 
              mode="outlined" 
              style={styles.activeChip}
              textStyle={styles.activeChipText}
            >
              Active Now
            </Chip>
          </View>

          <View style={styles.attendanceProgress}>
            <View style={styles.progressHeader}>
              <Text variant="bodyMedium">Students Present</Text>
              <Text variant="bodyMedium" style={styles.progressText}>28/35</Text>
            </View>
            <ProgressBar progress={0.8} color="#6366F1" style={styles.progressBar} />
          </View>

          <Button
            mode="contained"
            onPress={handleScanQR}
            style={styles.scanButton}
            contentStyle={styles.scanButtonContent}
            labelStyle={styles.scanButtonLabel}
          >
            Start Attendance
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.scheduleCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.scheduleTitle}>Today's Schedule</Text>
          
          {[
            { time: '09:00 AM', class: 'Class 12-A', subject: 'Advanced Mathematics', room: 'Room 301', status: 'completed' },
            { time: '11:00 AM', class: 'Class 11-B', subject: 'Basic Calculus', room: 'Room 205', status: 'active' },
            { time: '02:00 PM', class: 'Class 10-C', subject: 'Algebra', room: 'Room 103', status: 'upcoming' },
          ].map((session, index) => (
            <Surface key={index} style={styles.scheduleItem} elevation={1}>
              <View style={styles.scheduleTime}>
                <Text variant="titleMedium" style={styles.timeText}>{session.time}</Text>
                <Chip 
                  mode="flat"
                  style={[
                    styles.statusChip,
                    session.status === 'completed' && styles.completedChip,
                    session.status === 'active' && styles.activeStatusChip,
                    session.status === 'upcoming' && styles.upcomingChip,
                  ]}
                  textStyle={styles.statusChipText}
                >
                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </Chip>
              </View>
              <View style={styles.scheduleDetails}>
                <Text variant="bodyLarge" style={styles.className}>{session.class}</Text>
                <Text variant="bodyMedium" style={styles.subjectText}>{session.subject}</Text>
                <Text variant="bodySmall" style={styles.roomText}>{session.room}</Text>
              </View>
            </Surface>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerCard: {
    height: 200,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
  },
  headerContent: {
    padding: 24,
  },
  greeting: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: -40,
  },
  statCard: {
    flex: 1,
    margin: 4,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  statNumber: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  currentSessionCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  currentSessionTitle: {
    fontWeight: 'bold',
    color: '#1E293B',
  },
  className: {
    color: '#334155',
    marginTop: 4,
  },
  activeChip: {
    backgroundColor: '#ECF0FF',
    borderColor: '#6366F1',
  },
  activeChipText: {
    color: '#6366F1',
  },
  attendanceProgress: {
    marginVertical: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressText: {
    fontWeight: '600',
    color: '#6366F1',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  scanButton: {
    marginTop: 16,
    backgroundColor: '#6366F1',
  },
  scanButtonContent: {
    height: 48,
  },
  scanButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleCard: {
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  scheduleTitle: {
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  scheduleItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  scheduleTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeText: {
    color: '#1E293B',
    fontWeight: '600',
  },
  statusChip: {
    borderRadius: 12,
  },
  completedChip: {
    backgroundColor: '#DCF7E3',
  },
  activeStatusChip: {
    backgroundColor: '#ECF0FF',
  },
  upcomingChip: {
    backgroundColor: '#FEF3C7',
  },
  statusChipText: {
    fontSize: 12,
  },
  scheduleDetails: {
    gap: 4,
  },
  subjectText: {
    color: '#64748B',
  },
  roomText: {
    color: '#94A3B8',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  role: {
    color: '#666',
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  card: {
    marginBottom: 20,
  },
  classItem: {
    marginTop: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statItem: {
    alignItems: 'center',
  },
});