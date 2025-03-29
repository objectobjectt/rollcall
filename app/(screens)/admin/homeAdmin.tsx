import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo icons
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeAdmin = () => {
  // Sample statistics data (replace with actual data fetching)
  const [stats, setStats] = useState({
    totalUsers: 124,
    activeUsers: 98,
    trainers: 15,
    learners: 105,
    admins: 4,
    coursesActive: 27,
    completionRate: 78,
  });

  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  interface Stats {
    totalUsers: number;
    activeUsers: number;
    trainers: number;
    learners: number;
    admins: number;
    coursesActive: number;
    completionRate: number;
  }

  const toggleCard = (cardName: string): void => {
    if (expandedCard === cardName) {
      setExpandedCard(null);
    } else {
      setExpandedCard(cardName);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#2c3e50" barStyle="light-content" />
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Admin Dashboard</Text>
          <View style={styles.profileIcon}>
            <TouchableOpacity>
              <Ionicons name="person-circle" size={40} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics Card */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={24} color="#3498db" />
              <Text style={styles.statNumber}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="school" size={24} color="#e74c3c" />
              <Text style={styles.statNumber}>{stats.trainers}</Text>
              <Text style={styles.statLabel}>Trainers</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="book" size={24} color="#2ecc71" />
              <Text style={styles.statNumber}>{stats.learners}</Text>
              <Text style={styles.statLabel}>Learners</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trophy" size={24} color="#f39c12" />
              <Text style={styles.statNumber}>{stats.completionRate}%</Text>
              <Text style={styles.statLabel}>Completion</Text>
            </View>
          </View>
        </View>

        {/* User Management Card */}
        <View style={styles.card}>
          <TouchableOpacity
            style={[
              styles.cardHeader,
              expandedCard === 'users' && styles.expandedCardHeader,
            ]}
            onPress={() => toggleCard('users')}
          >
            <Text style={styles.cardTitle}>User Management</Text>
            <Ionicons
              name={expandedCard === 'users' ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#2c3e50"
            />
          </TouchableOpacity>

          {expandedCard === 'users' && (
            <View style={styles.cardContent}>
              <TouchableOpacity style={styles.button}>
                <Ionicons
                  name="list"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>View All Users</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button}>
                <Ionicons
                  name="person-add"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Add Admin</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button}>
                <Ionicons
                  name="school-outline"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Add Trainer</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button}>
                <Ionicons
                  name="book-outline"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Add Learner</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Content Management Card */}
        <View style={styles.card}>
          <TouchableOpacity
            style={[
              styles.cardHeader,
              expandedCard === 'content' && styles.expandedCardHeader,
            ]}
            onPress={() => toggleCard('content')}
          >
            <Text style={styles.cardTitle}>Content Management</Text>
            <Ionicons
              name={expandedCard === 'content' ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#2c3e50"
            />
          </TouchableOpacity>

          {expandedCard === 'content' && (
            <View style={styles.cardContent}>
              <TouchableOpacity style={styles.button}>
                <Ionicons
                  name="list"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>View All Content</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button}>
                <Ionicons
                  name="add-circle"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Add New Course</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button}>
                <Ionicons
                  name="create"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Edit Courses</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Statistics Card */}
        <View style={styles.card}>
          <TouchableOpacity
            style={[
              styles.cardHeader,
              expandedCard === 'stats' && styles.expandedCardHeader,
            ]}
            onPress={() => toggleCard('stats')}
          >
            <Text style={styles.cardTitle}>Statistics</Text>
            <Ionicons
              name={expandedCard === 'stats' ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#2c3e50"
            />
          </TouchableOpacity>

          {expandedCard === 'stats' && (
            <View style={styles.cardContent}>
              <TouchableOpacity style={styles.button}>
                <Ionicons
                  name="bar-chart"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>User Statistics</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button}>
                <Ionicons
                  name="pie-chart"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Course Completion Stats</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button}>
                <Ionicons
                  name="analytics"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Performance Reports</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Settings Card */}
        <View style={styles.card}>
          <TouchableOpacity
            style={[
              styles.cardHeader,
              expandedCard === 'settings' && styles.expandedCardHeader,
            ]}
            onPress={() => toggleCard('settings')}
          >
            <Text style={styles.cardTitle}>Settings</Text>
            <Ionicons
              name={expandedCard === 'settings' ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#2c3e50"
            />
          </TouchableOpacity>

          {expandedCard === 'settings' && (
            <View style={styles.cardContent}>
              <TouchableOpacity style={styles.button}>
                <Ionicons
                  name="settings"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>System Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button}>
                <Ionicons
                  name="notifications"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Notification Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button}>
                <Ionicons
                  name="shield-checkmark"
                  size={20}
                  color="#fff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Privacy Settings</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Learning Management System v1.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeAdmin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    backgroundColor: '#2c3e50',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileIcon: {
    marginLeft: 'auto',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  statsContainer: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomColor: '#ecf0f1',
  },
  expandedCardHeader: {
    borderBottomWidth: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cardContent: {
    padding: 16,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
});
