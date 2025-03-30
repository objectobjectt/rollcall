import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Api } from '@/constants/ApiConstants';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'trainer' | 'learner';
  status: 'active' | 'inactive';
};

const HomeAdmin = () => {
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
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'learner' as 'admin' | 'trainer' | 'learner',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'trainer',
      status: 'active',
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'learner',
      status: 'active',
    },
    {
      id: '4',
      name: 'Alice Brown',
      email: 'alice@example.com',
      role: 'learner',
      status: 'inactive',
    },
    {
      id: '5',
      name: 'Charlie Wilson',
      email: 'charlie@example.com',
      role: 'trainer',
      status: 'active',
    },
  ]);
  const router = useRouter();
  const [learners, setLearners] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const learners = await Api.get(Api.ADMIN_GET_LEARNERS);
      if (learners.responseJson) setLearners(learners.responseJson);
      const trainers = await Api.get(Api.ADMIN_GET_TRAINERS);
      if (trainers.responseJson) setTrainers(trainers.responseJson);

      // SUPER ADMIN ONLY
      // const admins = await Api.get(Api.ADMIN_GET_ADMINS);
      // if (admins.responseJson) setAdmins(admins.responseJson);

      console.log(learners, trainers, admins);
      
    }
    fetchData();
  }, [users]);

  const toggleCard = (cardName: string): void => {
    setExpandedCard(expandedCard === cardName ? null : cardName);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
            ...user,
            status: user.status === 'active' ? 'inactive' : 'active',
          }
          : user
      )
    );
  };

  const handleAddUser = async () => {
    if (newUser.name && newUser.email) {
      const user: User = {
        id: Math.random().toString(36).substring(7),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'active',
      };
      let url = Api.ADMIN_REGISTER_LEARNER;
      if (newUser.role === 'trainer') {
        url = Api.ADMIN_REGISTER_TRAINER;
      }
      if (newUser.role === 'admin') {
        throw new Error('Admin cannot be added by another admin');
      }
      const response = await Api.post(url, user);
      console.log(response);
      
      if (!response.responseJson) return

      setUsers([...users, user]);
      setNewUser({ name: newUser.name, email: newUser.email, role: newUser.role });
      setShowAddUserForm(false);
      setStats({
        ...stats,
        totalUsers: stats.totalUsers + 1,
        activeUsers: stats.activeUsers + 1,
        ...(user.role === 'trainer' && { trainers: stats.trainers + 1 }),
        ...(user.role === 'learner' && { learners: stats.learners + 1 }),
        ...(user.role === 'admin' && { admins: stats.admins + 1 }),
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderUserItem = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={styles.userRoleBadge}>
          <Text
            style={[
              styles.roleText,
              item.role === 'admin' && styles.adminRole,
              item.role === 'trainer' && styles.trainerRole,
              item.role === 'learner' && styles.learnerRole,
            ]}
          >
            {item.role.toUpperCase()}
          </Text>
          <Text
            style={[
              styles.statusText,
              item.status === 'active'
                ? styles.activeStatus
                : styles.inactiveStatus,
            ]}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => toggleUserStatus(item.id)}
        style={[
          styles.statusButton,
          item.status === 'active'
            ? styles.activeButton
            : styles.inactiveButton,
        ]}
      >
        <Ionicons
          name={item.status === 'active' ? 'checkmark-circle' : 'close-circle'}
          size={24}
          color={item.status === 'active' ? '#2ecc71' : '#e74c3c'}
        />
      </TouchableOpacity>
    </View>
  );

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

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statItem, styles.statItemElevated]}>
              <Ionicons name="people" size={24} color="#3498db" />
              <Text style={styles.statNumber}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={[styles.statItem, styles.statItemElevated]}>
              <Ionicons name="school" size={24} color="#e74c3c" />
              <Text style={styles.statNumber}>{stats.trainers}</Text>
              <Text style={styles.statLabel}>Trainers</Text>
            </View>
            <View style={[styles.statItem, styles.statItemElevated]}>
              <Ionicons name="book" size={24} color="#2ecc71" />
              <Text style={styles.statNumber}>{stats.learners}</Text>
              <Text style={styles.statLabel}>Learners</Text>
            </View>
            <View style={[styles.statItem, styles.statItemElevated]}>
              <Ionicons name="shield" size={24} color="#9b59b6" />
              <Text style={styles.statNumber}>{stats.admins}</Text>
              <Text style={styles.statLabel}>Admins</Text>
            </View>
            <View style={[styles.statItem, styles.statItemElevated]}>
              <Ionicons name="trophy" size={24} color="#f39c12" />
              <Text style={styles.statNumber}>{stats.completionRate}%</Text>
              <Text style={styles.statLabel}>Completion</Text>
            </View>
            <View style={[styles.statItem, styles.statItemElevated]}>
              <Ionicons name="layers" size={24} color="#1abc9c" />
              <Text style={styles.statNumber}>{stats.coursesActive}</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View
            style={[
              styles.cardHeader,
              expandedCard === 'users' && styles.expandedCardHeader,
            ]}
            onTouchEnd={() => toggleCard('users')}
          >
            <Text style={styles.cardTitle}>Users Management</Text>
            <Ionicons
              name={expandedCard === 'users' ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#2c3e50"
            />
          </View>
          {expandedCard === 'users' && (
            <View style={styles.cardContent}>
              <View style={styles.searchContainer}>
                <Ionicons
                  name="search"
                  size={20}
                  color="#7f8c8d"
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search users..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              <FlatList
                data={filteredUsers}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.userList}
              />

              {!showAddUserForm ? (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowAddUserForm(true)}
                >
                  <Ionicons name="add" size={24} color="#fff" />
                  <Text style={styles.addButtonText}>Add New User</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.addUserForm}>
                  <Text style={styles.formTitle}>Add New User</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={newUser.name}
                    onChangeText={(text) =>
                      setNewUser({ ...newUser, name: text })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    value={newUser.email}
                    onChangeText={(text) =>
                      setNewUser({ ...newUser, email: text })
                    }
                  />
                  <View style={styles.roleSelector}>
                    <Text style={styles.roleLabel}>Role:</Text>
                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        newUser.role === 'admin' && styles.roleButtonActive,
                      ]}
                      onPress={() => setNewUser({ ...newUser, role: 'admin' })}
                    >
                      <Text
                        style={[
                          styles.roleButtonText,
                          newUser.role === 'admin' &&
                          styles.roleButtonTextActive,
                        ]}
                      >
                        Admin
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        newUser.role === 'trainer' && styles.roleButtonActive,
                      ]}
                      onPress={() =>
                        setNewUser({ ...newUser, role: 'trainer' })
                      }
                    >
                      <Text
                        style={[
                          styles.roleButtonText,
                          newUser.role === 'trainer' &&
                          styles.roleButtonTextActive,
                        ]}
                      >
                        Trainer
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        newUser.role === 'learner' && styles.roleButtonActive,
                      ]}
                      onPress={() =>
                        setNewUser({ ...newUser, role: 'learner' })
                      }
                    >
                      <Text
                        style={[
                          styles.roleButtonText,
                          newUser.role === 'learner' &&
                          styles.roleButtonTextActive,
                        ]}
                      >
                        Learner
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.formButtons}>
                    <TouchableOpacity
                      style={[styles.formButton, styles.cancelButton]}
                      onPress={() => setShowAddUserForm(false)}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.formButton, styles.submitButton]}
                      onPress={handleAddUser}
                    >
                      <Text style={styles.submitButtonText}>Add User</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <View
            style={[
              styles.cardHeader,
              expandedCard === 'courses' && styles.expandedCardHeader,
            ]}
            onTouchEnd={() => toggleCard('courses')}
          >
            <Text style={styles.cardTitle}>Courses Overview</Text>
            <Ionicons
              name={expandedCard === 'courses' ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#2c3e50"
            />
          </View>
          {expandedCard === 'courses' && (
            <View style={styles.cardContent}>
              <View style={styles.courseStat}>
                <MaterialIcons name="library-books" size={24} color="#3498db" />
                <View style={styles.courseStatText}>
                  <Text style={styles.courseStatNumber}>
                    {stats.coursesActive}
                  </Text>
                  <Text style={styles.courseStatLabel}>Active Courses</Text>
                </View>
              </View>
              <View style={styles.courseStat}>
                <FontAwesome name="users" size={24} color="#2ecc71" />
                <View style={styles.courseStatText}>
                  <Text style={styles.courseStatNumber}>
                    {stats.activeUsers}
                  </Text>
                  <Text style={styles.courseStatLabel}>Active Learners</Text>
                </View>
              </View>
              <View style={styles.courseStat}>
                <Ionicons name="stats-chart" size={24} color="#f39c12" />
                <View style={styles.courseStatText}>
                  <Text style={styles.courseStatNumber}>
                    {stats.completionRate}%
                  </Text>
                  <Text style={styles.courseStatLabel}>Completion Rate</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  router.push('/(screens)/admin/course');
                }}
                style={styles.manageButton}
              >
                <Text style={styles.manageButtonText}>Manage Courses</Text>
                <Ionicons name="arrow-forward" size={20} color="#3498db" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Learners</Text>
          <FlatList
            data={learners}
            renderItem={({ item }) => (
              <View>
                <Text>{item.name}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Trainers</Text>
          <FlatList
            data={trainers}
            renderItem={({ item }) => (
              <View>
                <Text>{item.name}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>


        <View style={styles.card}>
          <Text style={styles.cardTitle}>Admins</Text>
          <FlatList
            data={admins}
            renderItem={({ item }) => (
              <View>
                <Text>{item.name}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Learning Management System v1.0</Text>
          <Text style={styles.footerSubText}>Admin Dashboard</Text>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
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
  },
  statItemElevated: {
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
    backgroundColor: '#f8f9fa',
  },
  expandedCardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cardContent: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#2c3e50',
  },
  userList: {
    paddingBottom: 8,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  userEmail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  userRoleBadge: {
    flexDirection: 'row',
    marginTop: 8,
  },
  roleText: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  adminRole: {
    backgroundColor: '#9b59b6',
    color: '#fff',
  },
  trainerRole: {
    backgroundColor: '#e74c3c',
    color: '#fff',
  },
  learnerRole: {
    backgroundColor: '#3498db',
    color: '#fff',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeStatus: {
    backgroundColor: '#2ecc71',
    color: '#fff',
  },
  inactiveStatus: {
    backgroundColor: '#e74c3c',
    color: '#fff',
  },
  statusButton: {
    padding: 8,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  inactiveButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  addUserForm: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#bdc3c7',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  roleSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  roleLabel: {
    marginRight: 12,
    color: '#7f8c8d',
  },
  roleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    marginRight: 8,
  },
  roleButtonActive: {
    borderColor: '#3498db',
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
  },
  roleButtonText: {
    color: '#7f8c8d',
  },
  roleButtonTextActive: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  formButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  cancelButtonText: {
    color: '#7f8c8d',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  courseStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  courseStatText: {
    marginLeft: 12,
  },
  courseStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  courseStatLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  manageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 8,
    marginTop: 8,
  },
  manageButtonText: {
    color: '#3498db',
    fontWeight: 'bold',
    marginRight: 8,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    marginTop: 16,
  },
  footerText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
  footerSubText: {
    color: '#bdc3c7',
    fontSize: 12,
    marginTop: 4,
  },
});
