import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Entypo, EvilIcons, Ionicons } from '@expo/vector-icons';
import HomeAdmin from '@/app/(screens)/admin/homeAdmin';
import HomeScreen from '@/app/(screens)/homeLearner';
import StudentScanner from '@/app/(screens)/StudentScanner';
import { View } from 'lucide-react-native';
import { Text } from 'react-native';
import MyProfile from '@/app/(screens)/profile';
import HomeTrainer from '@/app/(screens)/trainer/homeTrainer';
import CoursePage from '@/app/(screens)/admin/course';
import AddCoords from '@/app/(screens)/admin/addCoords';
import AdminProfile from '@/app/(screens)/admin/profile';
import { Book, Feather } from 'lucide-react-native';
import HistoryScreen from '@/app/(screens)/trainer/history';
import QRgenerator from '@/app/(screens)/trainer/generateQR';

const AdminTab = createBottomTabNavigator();
const TrainerTab = createBottomTabNavigator();
const LearnerTab = createBottomTabNavigator();

export const AdminTabNavigator = () => (
  <AdminTab.Navigator screenOptions={{ headerShown: false }}>
    <AdminTab.Screen
      name="Dashboard"
      component={HomeAdmin}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" size={size} color={color} />
        ),
      }}
    />
    <AdminTab.Screen
      name="Courses"
      component={CoursePage}
      options={{
        tabBarIcon: ({ color, size }) => (
          <AntDesign name="book" size={size} color={color} />
        ),
      }}
    />
    <AdminTab.Screen
      name="Add Coordinates"
      component={AddCoords}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Entypo name="location" size={size} color={color} />
        ),
      }}
    />
    <LearnerTab.Screen
      name="Profile"
      component={AdminProfile}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" size={size} color={color} />
        ),
      }}
    />
  </AdminTab.Navigator>
);

export const TrainerTabNavigator = () => (
  <TrainerTab.Navigator screenOptions={{ headerShown: false }}>
    <TrainerTab.Screen
      name="Home"
      component={HomeTrainer}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
      }}
    />
      <TrainerTab.Screen
        name="Generate QR"
        component={QRgenerator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scan" color={color} size={size} />
          ),
        }}
      />
      <TrainerTab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" color={color} size={size} />
          ),
        }}
      />
    <LearnerTab.Screen
      name="Profile"
      component={MyProfile}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" size={size} color={color} />
        ),
      }}
    />
  </TrainerTab.Navigator>
);

export const LearnerTabNavigator = () => (
  <LearnerTab.Navigator screenOptions={{ headerShown: false }}>
    <LearnerTab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
      }}
    />
    <LearnerTab.Screen
      name="Scan"
      component={StudentScanner}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="scan" size={size} color={color} />
        ),
      }}
    />
    <LearnerTab.Screen
      name="Profile"
      component={MyProfile}
      options={{
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person" size={size} color={color} />
        ),
      }}
    />
  </LearnerTab.Navigator>
);
