import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeAdmin from '@/app/(screens)/homeAdmin';
import HomeTrainer from '@/app/(screens)/homeTrainer';
import HomeScreen from '@/app/(screens)/homeLearner';

const AdminTab = createBottomTabNavigator();
const TrainerTab = createBottomTabNavigator();
const LearnerTab = createBottomTabNavigator();

export const AdminTabNavigator = () => (
  <AdminTab.Navigator>
    <AdminTab.Screen
      name="Dashboard"
      component={HomeAdmin}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
      }}
    />
  </AdminTab.Navigator>
);

export const TrainerTabNavigator = () => (
  <TrainerTab.Navigator>
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
  <LearnerTab.Navigator>
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
