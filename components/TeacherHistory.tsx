import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  FlatList,
} from 'react-native';
import {
  BookOpen,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from 'lucide-react-native';

// Sample data structure for classes and student attendance
const sampleClassData = [
  {
    id: 1,
    className: 'Advanced Mathematics',
    instructor: 'Dr. Emily Chen',
    date: '2024-03-15',
    time: '10:00 AM - 11:30 AM',
    totalStudents: 25,
    presentStudents: [
      { id: 101, name: 'Alex Rodriguez', status: 'Present' },
      { id: 102, name: 'Sarah Kim', status: 'Present' },
      { id: 103, name: 'Michael Thompson', status: 'Present' },
      { id: 104, name: 'Emma Watson', status: 'Absent' },
      { id: 105, name: 'David Lee', status: 'Late' },
    ],
  },
  {
    id: 2,
    className: 'Organic Chemistry',
    instructor: 'Prof. Jason Wright',
    date: '2024-03-16',
    time: '2:00 PM - 3:30 PM',
    totalStudents: 22,
    presentStudents: [
      { id: 201, name: 'Jessica Brown', status: 'Present' },
      { id: 202, name: 'Ryan Garcia', status: 'Present' },
      { id: 203, name: 'Olivia Martinez', status: 'Absent' },
      { id: 204, name: 'Ethan Kim', status: 'Late' },
    ],
  },
  {
    id: 3,
    className: 'World History',
    instructor: 'Ms. Maria Rodriguez',
    date: '2024-03-17',
    time: '9:00 AM - 10:30 AM',
    totalStudents: 28,
    presentStudents: [
      { id: 301, name: 'Sophia Lee', status: 'Present' },
      { id: 302, name: 'Lucas Wang', status: 'Present' },
      { id: 303, name: 'Isabella Garcia', status: 'Present' },
      { id: 304, name: 'Noah Chen', status: 'Absent' },
    ],
  },
];

const TeacherHistory = () => {
  const [selectedClass, setSelectedClass] = useState(null);

  // Attendance status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return styles.presentStatus;
      case 'Absent':
        return styles.absentStatus;
      case 'Late':
        return styles.lateStatus;
      default:
        return styles.defaultStatus;
    }
  };

  // Calculate attendance percentages
  const calculateAttendancePercentage = (students) => {
    const totalStudents = students.length;
    const presentStudents = students.filter(
      (s) => s.status === 'Present'
    ).length;
    return Math.round((presentStudents / totalStudents) * 100);
  };

  // Render Class Card
  const renderClassCard = ({ item }) => (
    <TouchableOpacity
      style={styles.classCard}
      onPress={() => setSelectedClass(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.className}>{item.className}</Text>
        <Calendar color="#2563EB" size={24} />
      </View>
      <View style={styles.cardDetails}>
        <Text style={styles.instructorText}>{item.instructor}</Text>
        <Text style={styles.dateTimeText}>
          {item.date} | {item.time}
        </Text>
      </View>
      <View style={styles.cardFooter}>
        <View style={styles.studentCountContainer}>
          <Users color="#10B981" size={20} />
          <Text style={styles.studentCountText}>
            {item.totalStudents} Students
          </Text>
        </View>
        <Text style={styles.presentPercentageText}>
          {calculateAttendancePercentage(item.presentStudents)}% Present
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Render Student Attendance Row
  const renderStudentRow = ({ item }) => (
    <View style={styles.studentRow}>
      <Text style={styles.studentName}>{item.name}</Text>
      <Text style={[styles.studentStatus, getStatusColor(item.status)]}>
        {item.status}
      </Text>
    </View>
  );

  // Detailed Class View
  const DetailedClassView = () => {
    const presentCount = selectedClass.presentStudents.filter(
      (s) => s.status === 'Present'
    ).length;
    const absentCount = selectedClass.presentStudents.filter(
      (s) => s.status === 'Absent'
    ).length;

    return (
      <View style={styles.detailedContainer}>
        <View style={styles.detailedHeader}>
          <TouchableOpacity
            onPress={() => setSelectedClass(null)}
            style={styles.backButton}
          >
            <ArrowLeft color="#2563EB" size={24} />
          </TouchableOpacity>
          <Text style={styles.detailedClassName}>
            {selectedClass.className}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Total Students</Text>
            <View style={styles.statContent}>
              <Users color="#10B981" size={24} />
              <Text style={styles.statValue}>
                {selectedClass.totalStudents}
              </Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Present</Text>
            <View style={styles.statContent}>
              <CheckCircle color="#2563EB" size={24} />
              <Text style={styles.statValue}>{presentCount}</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Absent</Text>
            <View style={styles.statContent}>
              <XCircle color="#EF4444" size={24} />
              <Text style={styles.statValue}>{absentCount}</Text>
            </View>
          </View>
        </View>

        <FlatList
          data={selectedClass.presentStudents}
          renderItem={renderStudentRow}
          keyExtractor={(item) => item.id.toString()}
          style={styles.studentList}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      {!selectedClass ? (
        <View style={styles.headerContainer}>
          <BookOpen color="#2563EB" size={32} />
          <Text style={styles.headerTitle}>Class Attendance</Text>
        </View>
      ) : null}

      {!selectedClass ? (
        <FlatList
          data={sampleClassData}
          renderItem={renderClassCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <DetailedClassView />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#1F2937',
  },
  listContainer: {
    padding: 16,
  },
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cardDetails: {
    marginBottom: 12,
  },
  instructorText: {
    color: '#4B5563',
    marginBottom: 4,
  },
  dateTimeText: {
    color: '#6B7280',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentCountText: {
    marginLeft: 8,
    color: '#10B981',
  },
  presentPercentageText: {
    fontWeight: 'bold',
    color: '#10B981',
  },
  detailedContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  detailedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    marginRight: 12,
  },
  detailedClassName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statTitle: {
    color: '#6B7280',
    marginBottom: 8,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  studentList: {
    paddingHorizontal: 16,
  },
  studentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  studentName: {
    fontSize: 16,
    color: '#1F2937',
  },
  studentStatus: {
    fontWeight: 'bold',
  },
  presentStatus: {
    color: '#10B981',
  },
  absentStatus: {
    color: '#EF4444',
  },
  lateStatus: {
    color: '#F59E0B',
  },
  defaultStatus: {
    color: '#6B7280',
  },
});

export default TeacherHistory;
