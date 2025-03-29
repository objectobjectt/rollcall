import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Text, Card, Chip, Button, Avatar, Modal, Portal, List, Provider, Divider, Searchbar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@/hooks/useAuth';

// Sample data with learner information
const mockClassHistory = [
  {
    id: '1',
    date: '2024-03-25',
    subject: 'Advanced JavaScript',
    duration: '1h 30m',
    learners: [
      { id: 'l1', name: 'Alex Johnson', status: 'present' },
      { id: 'l2', name: 'Maria Garcia', status: 'present' },
      { id: 'l3', name: 'James Wilson', status: 'present' },
      { id: 'l4', name: 'Emily Chen', status: 'absent' },
      { id: 'l5', name: 'Michael Brown', status: 'present' },
    ],
    feedback: {
      rating: 4.7,
      count: 4
    }
  },
  {
    id: '2',
    date: '2024-03-23',
    subject: 'React Native Basics',
    duration: '2h 15m',
    learners: [
      { id: 'l1', name: 'Alex Johnson', status: 'present' },
      { id: 'l2', name: 'Maria Garcia', status: 'absent' },
      { id: 'l3', name: 'James Wilson', status: 'present' },
      { id: 'l6', name: 'Sarah Lee', status: 'present' },
      { id: 'l7', name: 'David Kim', status: 'present' },
      { id: 'l8', name: 'Jessica Patel', status: 'absent' },
    ],
    feedback: {
      rating: 4.5,
      count: 4
    }
  },
  {
    id: '3',
    date: '2024-03-20',
    subject: 'Database Design',
    duration: '1h 45m',
    learners: [
      { id: 'l2', name: 'Maria Garcia', status: 'present' },
      { id: 'l3', name: 'James Wilson', status: 'present' },
      { id: 'l8', name: 'Jessica Patel', status: 'present' },
      { id: 'l9', name: 'Robert Taylor', status: 'absent' },
      { id: 'l10', name: 'Emma Rodriguez', status: 'present' },
    ],
    feedback: {
      rating: 4.8,
      count: 4
    }
  },
  {
    id: '4',
    date: '2024-03-18',
    subject: 'UI/UX Design Principles',
    duration: '2h 00m',
    learners: [
      { id: 'l1', name: 'Alex Johnson', status: 'present' },
      { id: 'l4', name: 'Emily Chen', status: 'present' },
      { id: 'l7', name: 'David Kim', status: 'present' },
      { id: 'l11', name: 'Sophia Wang', status: 'absent' },
      { id: 'l12', name: 'Noah Martinez', status: 'present' },
    ],
    feedback: {
      rating: 4.9,
      count: 4
    }
  },
  {
    id: '5',
    date: '2024-03-15',
    subject: 'Cloud Computing',
    duration: '1h 30m',
    learners: [
      { id: 'l3', name: 'James Wilson', status: 'absent' },
      { id: 'l5', name: 'Michael Brown', status: 'present' },
      { id: 'l9', name: 'Robert Taylor', status: 'present' },
      { id: 'l13', name: 'Olivia Adams', status: 'present' },
      { id: 'l14', name: 'William Singh', status: 'absent' },
    ],
    feedback: {
      rating: 4.3,
      count: 3
    }
  },
];

export default function TrainerHistoryScreen() {
  const { signOut, user } = useAuth()
  const [selectedClass, setSelectedClass] = useState(null);
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHistory, setFilteredHistory] = useState(mockClassHistory);
  const [loading, setLoading] = useState(false);
  
  // Filter classes based on search query
  useFocusEffect(
    useCallback(() => {
      if (searchQuery.trim() === '') {
        setFilteredHistory(mockClassHistory);
        return;
      }
      
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = mockClassHistory.filter(
        record => record.subject.toLowerCase().includes(lowerCaseQuery) || 
                  record.date.includes(lowerCaseQuery)
      );
      setFilteredHistory(filtered);
    }, [searchQuery])
  );

  const onChangeSearch = query => {
    setSearchQuery(query);
  };
  
  const showClassDetails = (classRecord) => {
    setSelectedClass(classRecord);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const renderClassCard = (record) => {
    const presentCount = record.learners.filter(l => l.status === 'present').length;
    const totalCount = record.learners.length;
    const attendancePercentage = Math.round((presentCount / totalCount) * 100);
    
    // Improved color scheme with more professional blues
    let statusColor = '#2196F3'; // Standard blue
    let statusText = 'Good';
    
    if (attendancePercentage < 80) {
      statusColor = '#1976D2'; // Darker blue
      statusText = 'Average';
    }
    if (attendancePercentage < 60) {
      statusColor = '#0D47A1'; // Deep blue
      statusText = 'Low';
    }
    
    return (
      <TouchableOpacity 
        key={record.id} 
        onPress={() => showClassDetails(record)}
        activeOpacity={0.7}
      >
        <Card style={styles.classCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <View style={styles.titleContainer}>
                <Text style={styles.subjectTitle}>{record.subject}</Text>
                <Text style={styles.dateText}>
                  {formatDate(record.date)} • {record.duration}
                </Text>
              </View>
              <Chip 
                style={[styles.statusChip, { backgroundColor: statusColor }]} 
                textStyle={{ color: 'white', fontWeight: '600' }}
              >
                {statusText} {attendancePercentage}%
              </Chip>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{totalCount}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#4CAF50' }]}>{presentCount}</Text>
                <Text style={styles.statLabel}>Present</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: '#E57373' }]}>{totalCount - presentCount}</Text>
                <Text style={styles.statLabel}>Absent</Text>
              </View>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingValue}>★ {record.feedback.rating.toFixed(1)}</Text>
                <Text style={styles.ratingCount}>({record.feedback.count})</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No classes found matching your search.</Text>
      <Button 
        mode="outlined" 
        onPress={() => setSearchQuery('')}
        style={styles.emptyStateButton}
      >
        Clear Search
      </Button>
    </View>
  );

  return (
    <Provider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Portal>
            <Modal 
              visible={visible} 
              onDismiss={hideModal} 
              contentContainerStyle={styles.modalContainer}
              dismissable={true}
            >
              {selectedClass && (
                <View>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{selectedClass.subject}</Text>
                    <Text style={styles.modalSubtitle}>
                      {formatDate(selectedClass.date)} • {selectedClass.duration}
                    </Text>
                  </View>
                  
                  <View style={styles.attendanceSummary}>
                    <View style={styles.attendanceItem}>
                      <Text style={styles.attendanceValue}>{selectedClass.learners.length}</Text>
                      <Text style={styles.attendanceLabel}>Total</Text>
                    </View>
                    <View style={styles.attendanceItem}>
                      <Text style={[styles.attendanceValue, { color: '#4CAF50' }]}>
                        {selectedClass.learners.filter(l => l.status === 'present').length}
                      </Text>
                      <Text style={styles.attendanceLabel}>Present</Text>
                    </View>
                    <View style={styles.attendanceItem}>
                      <Text style={[styles.attendanceValue, { color: '#E57373' }]}>
                        {selectedClass.learners.filter(l => l.status === 'absent').length}
                      </Text>
                      <Text style={styles.attendanceLabel}>Absent</Text>
                    </View>
                  </View>
                  
                  <View style={styles.feedbackSummary}>
                    <Text style={styles.feedbackTitle}>Class Rating</Text>
                    <View style={styles.ratingDetails}>
                      <Text style={styles.modalRating}>
                        {selectedClass.feedback.rating.toFixed(1)}
                      </Text>
                      <View style={styles.starContainer}>
                        <Text style={styles.starText}>★★★★★</Text>
                        <Text style={styles.feedbackCount}>
                          ({selectedClass.feedback.count} ratings)
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <Text style={styles.sectionHeader}>Attendance Details</Text>
                  
                  <ScrollView style={styles.learnersList}>
                    {selectedClass.learners.map(learner => (
                      <List.Item
                        key={learner.id}
                        title={learner.name}
                        left={props => (
                          <List.Icon 
                            {...props} 
                            icon={learner.status === 'present' ? 'check-circle' : 'close-circle'} 
                            color={learner.status === 'present' ? '#4CAF50' : '#E57373'} 
                          />
                        )}
                        titleStyle={styles.learnerName}
                        style={styles.learnerItem}
                      />
                    ))}
                  </ScrollView>
                  
                  <View style={styles.buttonContainer}>
                    <Button 
                      mode="contained" 
                      onPress={hideModal} 
                      style={styles.closeButton}
                      labelStyle={styles.buttonLabel}
                    >
                      Close
                    </Button>
                    {/* <Button 
                      mode="outlined" 
                      onPress={() => {
                        hideModal();
                        // This would open a report view in a real app
                        console.log('Generate report for', selectedClass.id);
                      }} 
                      style={styles.reportButton}
                      labelStyle={styles.outlineButtonLabel}
                    >
                      
                    </Button> */}
                  </View>
                </View>
              )}
            </Modal>
          </Portal>
          
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Class History</Text>
            <Avatar.Icon 
              size={42} 
              icon="account" 
              style={styles.avatar} 
              color="#FFFFFF"
            />
          </View>
          
          <Searchbar
            placeholder="Search by subject or date"
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
            iconColor="#1976D2"
            placeholderTextColor="#90A4AE"
            loading={loading}
          />
          
          <Text style={styles.sectionTitle}>
            {searchQuery ? 'Search Results' : 'Recent Classes'}
          </Text>
          
          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {filteredHistory.length > 0 
              ? filteredHistory.map(record => renderClassCard(record))
              : renderEmptyState()
            }
            
            {/* Add a bit of space at the bottom for better scrolling */}
            <View style={styles.scrollPadding} />
          </ScrollView>
        </View>
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    marginTop:40,
    backgroundColor: '#FAFAFA',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  avatar: {
    backgroundColor: '#1976D2',
  },
  searchBar: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  searchInput: {
    fontSize: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 12,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollPadding: {
    height: 20,
  },
  classCard: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
    backgroundColor: 'white',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleContainer: {
    flex: 1,
    marginRight: 10,
  },
  subjectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  dateText: {
    fontSize: 13,
    color: '#546E7A',
    marginTop: 2,
  },
  statusChip: {
    height: 28,
    paddingHorizontal: 8,
  },
  divider: {
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  statLabel: {
    fontSize: 12,
    color: '#546E7A',
    marginTop: 2,
  },
  ratingContainer: {
    marginLeft: 'auto',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  ratingCount: {
    fontSize: 12,
    color: '#757575',
  },
  // Modal styles
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: '85%',
    elevation: 5,
  },
  modalHeader: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#546E7A',
    marginTop: 4,
  },
  attendanceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  attendanceItem: {
    alignItems: 'center',
  },
  attendanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1565C0',
  },
  attendanceLabel: {
    fontSize: 13,
    color: '#546E7A',
    marginTop: 4,
  },
  feedbackSummary: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#F57C00',
    marginBottom: 8,
  },
  ratingDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalRating: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9800',
    marginRight: 12,
  },
  starContainer: {
    flexDirection: 'column',
  },
  starText: {
    fontSize: 16,
    color: '#FF9800',
    letterSpacing: 2,
  },
  feedbackCount: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D47A1',
    marginBottom: 12,
  },
  learnersList: {
    maxHeight: 240,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  learnerItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  learnerName: {
    fontSize: 15,
    color: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  closeButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#1976D2',
    elevation: 2,
  },
  reportButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: '#1976D2',
    elevation: 1,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  outlineButtonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#78909C',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateButton: {
    borderColor: '#1976D2',
    borderWidth: 1,
  },
});