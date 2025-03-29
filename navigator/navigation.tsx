import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Entypo, EvilIcons, Ionicons } from '@expo/vector-icons';
import HomeAdmin from '@/app/(screens)/admin/homeAdmin';
import HomeScreen from '@/app/(screens)/homeLearner';
import HomeTrainer from '@/app/(screens)/homeTrainer';
import CoursePage from '@/app/(screens)/admin/course';
import AddCoords from '@/app/(screens)/admin/addCoords';
import AdminProfile from '@/app/(screens)/admin/profile';
import { Book, Feather } from 'lucide-react-native';

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
    <AdminTab.Screen
      name="Profile"
      component={AdminProfile}
      options={{
        tabBarIcon: ({ color, size }) => (
          <EvilIcons name="user" size={size} color={color} />
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
  </LearnerTab.Navigator>
);
